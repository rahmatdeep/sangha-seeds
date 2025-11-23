import { Router, Request, Response } from "express";
import {
  authmiddleware,
  adminMiddleware,
  managerMiddleware,
  readOnlyMiddleware,
} from "../middleware";
import { prisma } from "../lib/prisma";
import {
  LotCreateSchema,
  LotUpdateSchema,
  WarehouseCreateSchema,
} from "../lib/types";

const router = Router();

/*
List Lots
GET /api/lots
Query Parameters:

warehouseId - Filter by warehouse
varietyId - Filter by variety
size - Filter by potato size
minQuantity - Minimum available quantity
maxQuantity - Maximum available quantity
availableOnly - Only lots with available quantity (true/false)
expiryBefore - Expiring before date (ISO format)
expiryAfter - Expiring after date (ISO format)
storageDateFrom - Stored after date
storageDateTo - Stored before date
search - Search by lot number
page - Page number
limit - Items per page
sortBy - Sort field (lotNo, quantity, storageDate, expiryDate)
order - Sort order (asc, desc)

Examples:
GET /api/lots?warehouseId=xxx&availableOnly=true&size=Soot10
GET /api/lots?expiryBefore=2025-12-31&sortBy=expiryDate&order=asc
GET /api/lots?varietyId=xxx&minQuantity=100


Get Lot by ID
GET /api/lots/:id
Include Options:

?include=variety - Include variety details
?include=warehouse - Include warehouse details
?include=orders - Include related orders

Get Lot Availability
GET /api/lots/:id/availability
Returns: Available quantity (quantity - quantityOnHold)

Create Lot
POST /api/lots

Update Lot
PATCH /api/lots/:id

Delete Lot
DELETE /api/lots/:id
*/

router.get("/", readOnlyMiddleware, async (req: Request, res: Response) => {
  const {
    warehouseId,
    varietyId,
    size,
    minQuantity,
    maxQuantity,
    availableOnly,
    expiryBefore,
    expiryAfter,
    storageDateFrom,
    storageDateTo,
    search,
    page = "1",
    limit = "10",
    sortBy,
    order,
  } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const whereClause: any = {};

  if (warehouseId) {
    whereClause.warehouseId = warehouseId;
  }
  if (varietyId) {
    whereClause.varietyId = varietyId;
  }
  if (size) {
    whereClause.size = size;
  }
  if (minQuantity) {
    whereClause.quantity = { gte: parseInt(minQuantity as string, 10) };
  }
  if (maxQuantity) {
    whereClause.quantity = {
      ...whereClause.quantity,
      lte: parseInt(maxQuantity as string, 10),
    };
  }
  if (availableOnly === "true") {
    whereClause.quantity = { gt: 0 };
  }
  if (expiryBefore) {
    whereClause.expiryDate = {
      ...whereClause.expiryDate,
      lt: new Date(expiryBefore as string),
    };
  }
  if (expiryAfter) {
    whereClause.expiryDate = {
      ...whereClause.expiryDate,
      gt: new Date(expiryAfter as string),
    };
  }
  if (storageDateFrom) {
    whereClause.storageDate = {
      ...whereClause.storageDate,
      gte: new Date(storageDateFrom as string),
    };
  }
  if (storageDateTo) {
    whereClause.storageDate = {
      ...whereClause.storageDate,
      lte: new Date(storageDateTo as string),
    };
  }
  if (search) {
    whereClause.lotNo = { contains: search as string, mode: "insensitive" };
  }

  try {
    const lots = await prisma.lot.findMany({
      where: whereClause,
      skip,
      take: limitNumber,
      orderBy: sortBy
        ? {
            [sortBy as string]: order === "desc" ? "desc" : "asc",
          }
        : undefined,
    });
    return res.status(200).json(lots);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", readOnlyMiddleware, async (req: Request, res: Response) => {
  const lotId = req.params.id;
  const includeVariety = req.query.include === "variety";
  const includeWarehouse = req.query.include === "warehouse";
  const includeOrders = req.query.include === "orders";

  try {
    const lot = await prisma.lot.findUnique({
      where: { id: lotId },
      include: {
        variety: includeVariety,
        warehouse: includeWarehouse,
        orders: includeOrders,
      },
    });
    if (!lot) {
      return res.status(404).json({ message: "Lot not found" });
    }
    return res.status(200).json(lot);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/:id/availability",
  readOnlyMiddleware,
  async (req: Request, res: Response) => {
    const lotId = req.params.id;
    try {
      const lot = await prisma.lot.findUnique({
        where: { id: lotId },
        select: {
          quantity: true,
          quantityOnHold: true,
        },
      });
      if (!lot) {
        return res.status(404).json({ message: "Lot not found" });
      }
      const availableQuantity = lot.quantity - lot.quantityOnHold;
      return res.status(200).json({ availableQuantity });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/", managerMiddleware, async (req: Request, res: Response) => {
  const parsedData = LotCreateSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Invalid request data" });
  }
  try {
    const lot = await prisma.lot.create({
      data: parsedData.data,
    });
    return res.status(201).json({ message: lot.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//locked quantity cannot be changed directly
router.patch("/:id", managerMiddleware, async (req: Request, res: Response) => {
  const lotId = req.params.id;
  const parsedData = LotUpdateSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Invalid request data" });
  }
  try {
    const lot = await prisma.lot.update({
      where: { id: lotId },
      data: parsedData.data,
    });
    return res
      .status(200)
      .json({ message: `Lot id: ${lot.id} updated successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", adminMiddleware, async (req: Request, res: Response) => {
  const lotId = req.params.id;
  try {
    const lot = await prisma.lot.delete({
      where: { id: lotId },
    });
    return res
      .status(200)
      .json({ message: `Lot id: ${lot.id} deleted successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as lotRouter };
