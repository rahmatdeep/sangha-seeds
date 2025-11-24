import { Router, Request, Response } from "express";
import {
  authmiddleware,
  adminMiddleware,
  managerMiddleware,
  readOnlyMiddleware,
} from "../middleware";
import { prisma } from "../lib/prisma";
import z, { parse } from "zod";
import {
  OrderCreateSchema,
  OrderQuerySchema,
  OrderStatusSchema,
  OrderUpdateSchema,
  UserCreateSchema,
} from "../lib/types";
import { ca, tr } from "zod/v4/locales";
import { OrderStatus } from "@prisma/client";

const router = Router();
// add logic for workers to update order status etc.

/*
List Orders
GET /api/orders
Query Parameters:

status - Filter by status (placed, acknowledged, completed)
warehouseId - Filter by warehouse
lotId - Filter by lot
varietyId - Filter by variety (through lot)
createdById - Filter by creator
assignedManagerId - Filter by assigned manager
assignedEmployeeId - Filter by assigned employee
completedById - Filter by who completed
acknowledgedById - Filter by who acknowledged
isComplete - Filter by completion status (true/false)
isAcknowledged - Filter by acknowledgment status (true/false)
createdFrom - Created after date
createdTo - Created before date
completedFrom - Completed after date
completedTo - Completed before date
destination - Filter by destination
page - Page number
limit - Items per page
sortBy - Sort field (createdAt, completedAt, acknowledgedAt, quantity)
order - Sort order (asc, desc)

Examples:
GET /api/orders?status=placed&warehouseId=xxx
GET /api/orders?assignedEmployeeId=xxx&isComplete=false
GET /api/orders?createdFrom=2025-01-01&createdTo=2025-01-31
GET /api/orders?status=acknowledged&sortBy=createdAt&order=desc
Get Order by ID
GET /api/orders/:id
Include Options:

?include=lot - Include lot details
?include=warehouse - Include warehouse details
?include=createdBy - Include creator details
?include=assignedManager - Include assigned managers
?include=assignedEmployees - Include assigned employees
?include=all - Include all related data

Get My Orders (for logged-in user)
GET /api/orders/my-orders
Query Parameters:

type - Filter type (created, assigned, managed, completed, acknowledged)
status - Filter by status
page - Page number
limit - Items per page

Get Order Statistics
GET /api/orders/stats
Query Parameters:

warehouseId - Stats for specific warehouse
dateFrom - Start date
dateTo - End date

Returns: Total orders, by status, average completion time, etc.
Create Order
POST /api/orders
Update Order
PATCH /api/orders/:id
Acknowledge Order
POST /api/orders/:id/acknowledge
Complete Order
POST /api/orders/:id/complete
Assign Manager to Order
POST /api/orders/:id/assign-manager
Body: { managerId: "uuid" }
Assign Employee to Order
POST /api/orders/:id/assign-employee
Body: { employeeId: "uuid" }
Delete Order
DELETE /api/orders/:id
*/

router.get("/", readOnlyMiddleware, async (req: Request, res: Response) => {
  try {
    const validatedQuery = OrderQuerySchema.safeParse(req.query);
    if (!validatedQuery.success) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }
    const {
      status,
      warehouseId,
      lotId,
      varietyId,
      createdById,
      assignedManagerId,
      assignedEmployeeId,
      completedById,
      acknowledgedById,
      isComplete,
      isAcknowledged,
      createdFrom,
      createdTo,
      completedFrom,
      completedTo,
      destination,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "asc",
    } = validatedQuery.data;

    let whereClause: any = {};
    if (status) whereClause.status = status;
    if (warehouseId) whereClause.warehouseId = warehouseId;
    if (lotId) whereClause.lotId = lotId;
    if (varietyId) whereClause.lot = { varietyId: varietyId };
    if (createdById) whereClause.createdById = createdById;
    if (assignedManagerId)
      whereClause.assignedManagers = { some: { id: assignedManagerId } };
    if (assignedEmployeeId)
      whereClause.assignedEmployees = { some: { id: assignedEmployeeId } };
    if (completedById) whereClause.completedById = completedById;
    if (acknowledgedById) whereClause.acknowledgedById = acknowledgedById;
    if (isComplete !== undefined)
      whereClause.status = isComplete ? "completed" : { not: "completed" };
    if (isAcknowledged !== undefined)
      whereClause.status = isAcknowledged
        ? { in: ["acknowledged", "completed"] }
        : "placed";
    if (createdFrom || createdTo) {
      whereClause.createdAt = {};
      if (createdFrom) whereClause.createdAt.gte = new Date(createdFrom);
      if (createdTo) whereClause.createdAt.lte = new Date(createdTo);
    }
    if (completedFrom || completedTo) {
      whereClause.completedAt = {};
      if (completedFrom) whereClause.completedAt.gte = new Date(completedFrom);
      if (completedTo) whereClause.completedAt.lte = new Date(completedTo);
    }
    if (destination)
      whereClause.destination = { contains: destination, mode: "insensitive" };
    const pageNumber = parseInt(page as unknown as string);
    const limitNumber = parseInt(limit as unknown as string);

    const orders = await prisma.order.findMany({
      where: whereClause,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      orderBy: {
        [sortBy]: order,
      },
    });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/my-orders", async (req: Request, res: Response) => {
  const userId = req.userId;
  const {
    type,
    status,
    page = 1,
    limit = 10,
    createdFrom,
    createdTo,
  } = req.query;
  try {
    let whereClause: any = {};
    if (type === "created") {
      whereClause.createdById = userId;
    } else if (type === "assigned") {
      whereClause.assignedEmployees = {
        some: { id: userId },
      };
    } else if (type === "managed") {
      whereClause.assignedManagers = {
        some: { id: userId },
      };
    } else if (type === "completed") {
      whereClause.completedById = userId;
    } else if (type === "acknowledged") {
      whereClause.acknowledgedById = userId;
    }
    if (status) {
      const parsedStatus = OrderStatusSchema.safeParse(status);
      if (!parsedStatus.success) {
        return res.status(400).json({ message: "Invalid status parameter" });
      }
      whereClause.status = parsedStatus.data;
    }
    if (createdFrom || createdTo) {
      whereClause.createdAt = {};
      if (createdFrom) {
        whereClause.createdAt.gte = new Date(createdFrom as string);
      }
      if (createdTo) {
        whereClause.createdAt.lte = new Date(createdTo as string);
      }
    } else {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      whereClause.createdAt = {
        gte: startOfDay,
        lte: now,
      };
    }
    const orders = await prisma.order.findMany({
      where: whereClause,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/stats",
  readOnlyMiddleware,
  async (req: Request, res: Response) => {
    const { warehouseId, dateFrom, dateTo } = req.query;
    try {
      let whereClause: any = {};
      if (warehouseId) whereClause.warehouseId = warehouseId;
      if (dateFrom || dateTo) {
        whereClause.createdAt = {};
        if (dateFrom) whereClause.createdAt.gte = new Date(dateFrom as string);
        if (dateTo) whereClause.createdAt.lte = new Date(dateTo as string);
      }
      const totalOrders = await prisma.order.count({
        where: whereClause,
      });
      const byStatus = await prisma.order.groupBy({
        by: ["status"],
        where: whereClause,
        _count: {
          status: true,
        },
      });
      return res.status(200).json({ totalOrders, byStatus });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/create",
  managerMiddleware,
  async (req: Request, res: Response) => {
    const parsed = OrderCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    const quantity = parseInt(req.body.quantity, 10);
    try {
      const orderId = await prisma.$transaction(async (tx) => {
        const lot = await tx.lot.findUnique({
          where: { id: parsed.data.lotId },
        });
        if (!lot) {
          res.status(400).json({ message: "Lot not found" });
          throw new Error("Lot not found");
        }
        if (lot.quantity < quantity) {
          res.status(400).json({ message: "Insufficient lot quantity" });
          throw new Error("Insufficient lot quantity");
        }
        await tx.lot.update({
          where: { id: lot.id },
          data: {
            quantity: lot.quantity - quantity,
            quantityOnHold: lot.quantityOnHold + quantity,
          },
        });
        const order = await tx.order.create({
          data: parsed.data,
        });
        return order.id;
      });
      return res.status(201).json({ message: orderId });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.patch(
  "/update/:id",
  managerMiddleware,
  async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const parsed = OrderUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    if (parsed.data.quantity) {
      const newQuantity = Number(parsed.data.quantity);
      try {
        const updatedOrderId = await prisma.$transaction(async (tx) => {
          const order = await tx.order.findUnique({
            where: { id: orderId },
          });
          if (!order) {
            res.status(404).json({ message: "Order not found" });
            throw new Error("Order not found");
          }
          const lot = await tx.lot.findUnique({
            where: { id: order.lotId },
          });
          if (!lot) {
            res.status(400).json({ message: "Lot not found" });
            throw new Error("Lot not found");
          }
          await tx.lot.update({
            where: { id: lot.id },
            data: {
              quantity: lot.quantity + order.quantity - newQuantity,
              quantityOnHold: lot.quantityOnHold - order.quantity + newQuantity,
            },
          });
          const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: parsed.data,
          });
          return updatedOrder.id;
        });
        return res.status(200).json({
          message: `Order id: ${updatedOrderId} updated successfully`,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      try {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: parsed.data,
        });
        return res.status(200).json({ message: "Order updated successfully" });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  }
);

router.post("/acknowledge/:id", async (req: Request, res: Response) => {
  const orderId = req.params.id;
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "acknowledged",
        acknowledgedAt: new Date(),
        acknowledgedById: req.userId,
      },
    });
    return res
      .status(200)
      .json({ message: `Order id: ${order.id} acknowledged successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/complete/:id", async (req: Request, res: Response) => {
  const orderId = req.params.id;
  try {
    const completedOrderId = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        throw new Error("Order not found");
      }
      const lot = await tx.lot.findUnique({
        where: { id: order.lotId },
      });
      if (!lot) {
        res.status(400).json({ message: "Lot not found" });
        throw new Error("Lot not found");
      }
      await tx.lot.update({
        where: { id: lot.id },
        data: {
          quantityOnHold: lot.quantityOnHold - order.quantity,
        },
      });
      const completedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: "completed",
          completedAt: new Date(),
          completedById: req.userId,
        },
      });
      return completedOrder.id;
    });
    return res.status(200).json({
      message: `Order id: ${completedOrderId} completed successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/assign-manager/:id",
  adminMiddleware,
  async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const { managerId } = req.body;
    if (!managerId || !orderId) {
      return res.status(400).json({ message: "Missing managerId or orderId" });
    }
    try {
      const manager = await prisma.user.findUnique({
        where: { id: managerId },
      });
      if (
        !manager ||
        (manager.role !== "Manager" && manager.role !== "Administrator")
      ) {
        return res.status(400).json({ message: "Invalid manager ID" });
      }
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          assignedManager: {
            connect: { id: manager.id },
          },
        },
      });
      return res.status(200).json({
        message: `Manager ${manager.id} assigned to order id: ${order.id}`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/assign-employee/:id",
  managerMiddleware,
  async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const { employeeId } = req.body;
    if (!employeeId || !orderId) {
      return res.status(400).json({ message: "Missing employeeId or orderId" });
    }
    try {
      const employee = await prisma.user.findUnique({
        where: { id: employeeId },
      });
      if (!employee) {
        return res.status(400).json({ message: "Invalid employee ID" });
      }
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          assignedEmployees: {
            connect: { id: employee.id },
          },
        },
      });
      return res.status(200).json({
        message: `Employee ${employee.id} assigned to order id: ${order.id}`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.delete(
  "/delete/:id",
  managerMiddleware,
  async (req: Request, res: Response) => {
    const orderId = req.params.id;
    try {
      const deletedOrderId = prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
        });
        if (!order) {
          res.status(404).json({ message: "Order not found" });
          throw new Error("Order not found");
        }
        if (
          order.status === OrderStatus.completed ||
          order.completedAt != null ||
          order.completedById != null
        ) {
          res
            .status(400)
            .json({ message: "Completed orders cannot be deleted" });
          throw new Error("Completed orders cannot be deleted");
        }
        const lot = await tx.lot.findUnique({
          where: { id: order.lotId },
        });
        if (!lot) {
          res.status(400).json({ message: "Lot not found" });
          throw new Error("Lot not found");
        }
        await tx.lot.update({
          where: { id: lot.id },
          data: {
            quantity: lot.quantity + order.quantity,
            quantityOnHold: lot.quantityOnHold - order.quantity,
          },
        });
        await tx.order.delete({
          where: { id: orderId },
        });
        return order.id;
      });

      return res
        .status(200)
        .json({ message: `Order id: ${deletedOrderId} deleted successfully` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// router.get(
//   "/all-orders",
//   readOnlyMiddleware,
//   async (req: Request, res: Response) => {
//     try {
//       const orders = await prisma.order.findMany();
//       return res.status(200).json(orders);
//     } catch (error) {
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

// router.get(
//   "/order-by-id/:id",
//   readOnlyMiddleware,
//   async (req: Request, res: Response) => {
//     const orderId = req.params.id;
//     try {
//       const order = await prisma.order.findUnique({
//         where: { id: orderId },
//       });
//       if (!order) {
//         return res.status(404).json({ message: "Order not found" });
//       }
//       return res.status(200).json(order);
//     } catch (error) {
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );
// router.get(
//   "/order-by-date/:date",
//   readOnlyMiddleware,
//   async (req: Request, res: Response) => {
//     const dateParam = req.params.date;
//     const date = new Date(dateParam);
//     if (isNaN(date.getTime())) {
//       return res.status(400).json({ message: "Invalid date format" });
//     }
//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);
//     try {
//       const orders = await prisma.order.findMany({
//         where: {
//           createdAt: {
//             gte: startOfDay,
//             lte: endOfDay,
//           },
//         },
//       });
//       return res.status(200).json(orders);
//     } catch (error) {
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

// router.get(
//   "/order-by-user/:userId",
//   readOnlyMiddleware,
//   async (req: Request, res: Response) => {
//     const userId = req.params.userId;
//     try {
//       const orders = await prisma.order.findMany({
//         where: {
//           createdById: userId,
//         },
//       });
//       return res.status(200).json(orders);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

// router.get(
//   "/order-by-warehouse/:warehouseId",
//   readOnlyMiddleware,
//   async (req: Request, res: Response) => {
//     const warehouseId = req.params.warehouseId;
//     try {
//       const orders = await prisma.order.findMany({
//         where: {
//           warehouseId: warehouseId,
//         },
//       });
//       return res.status(200).json(orders);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

// router.get(
//   "/order-status/:status/:date",
//   readOnlyMiddleware,
//   async (req: Request, res: Response) => {
//     const parsedData = OrderStatusSchema.safeParse(req.params.status);
//     if (!parsedData.success) {
//       return res.status(400).json({ message: "Invalid status parameter" });
//     }
//     const status = parsedData.data;
//     let date;
//     let startOfDay;
//     if (!req.params.date) {
//       date = new Date();
//       const startOfDay = new Date(date);
//       startOfDay.setHours(0, 0, 0, 0);
//     } else {
//       date = new Date(req.params.date);
//       startOfDay = new Date(date);
//       startOfDay.setHours(0, 0, 0, 0);
//       const endOfDay = new Date(date);
//       endOfDay.setHours(23, 59, 59, 999);
//     }

//     try {
//       const orders = await prisma.order.findMany({
//         where: {
//           status: status,
//           createdAt: {
//             gte: startOfDay,
//           },
//         },
//       });
//       return res.status(200).json(orders);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

export { router as orderRouter };
