import { Router, Request, Response } from "express";
import {
  authmiddleware,
  adminMiddleware,
  managerMiddleware,
} from "../middleware";
import { prisma } from "../lib/prisma";
import z from "zod";
import { WarehouseCreateSchema, WarehouseQuerySchema } from "../lib/types";

const router = Router();

/*
List Warehouses
GET /api/warehouses
Query Parameters:

location - Filter by location
search - Search by name or location
hasCapacity - Filter warehouses with available capacity (true/false)
page - Page number
limit - Items per page
sortBy - Sort field (name, location)
order - Sort order (asc, desc)

Get Warehouse by ID
GET /api/warehouses/:id
Include Options:

?include=employees - Include assigned employees
?include=lots - Include stored lots
?include=orders - Include orders

Get Warehouse Statistics
GET /api/warehouses/:id/stats
Returns: Total lots, total quantity, capacity utilization, active orders

Create Warehouse
POST /api/warehouses

Update Warehouse
PATCH /api/warehouses/:id

Delete Warehouse
DELETE /api/warehouses/:id
*/

router.post(
  "/create-warehouse",
  adminMiddleware,
  async (req: Request, res: Response) => {
    const parsed = WarehouseCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    try {
      const warehouse = await prisma.warehouse.create({
        data: parsed.data,
      });
      return res.status(201).json({ message: warehouse.id });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/", authmiddleware, async (req: Request, res: Response) => {
  try {
    const validatedQuery = WarehouseQuerySchema.safeParse(req.query);
    if (!validatedQuery.success) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }
    const {
      id,
      location,
      search,
      hasCapacity,
      page = "1",
      limit = "10",
      sortBy = "name",
      order = "asc",
    } = validatedQuery.data;

    const whereClause: any = {};

    if (id) {
      whereClause.id = id;
    }

    if (location) {
      whereClause.location = { contains: location, mode: "insensitive" };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    // Pagination
    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    // Sorting
    const orderBy: any = {};
    orderBy[sortBy] = order;

    // Query warehouses
    let warehouses = await prisma.warehouse.findMany({
      where: whereClause,
      include: {
        assignedEmployees: true,
        assignedManager: true,
        lots: true,
        orders: true,
      },
      orderBy,
      skip,
      take,
    });

    // Filter by hasCapacity if requested
    if (hasCapacity === "true") {
      warehouses = warehouses.filter((wh) => {
        // maxStorageCapacity may be string or null
        const maxCap = wh.maxStorageCapacity
          ? Number(wh.maxStorageCapacity)
          : null;
        if (!maxCap || !wh.lots || wh.lots.length === 0) return true;
        const totalQty = wh.lots.reduce(
          (sum, lot) => sum + (lot.quantity || 0),
          0
        );
        return totalQty < maxCap;
      });
    } else if (hasCapacity === "false") {
      warehouses = warehouses.filter((wh) => {
        const maxCap = wh.maxStorageCapacity
          ? Number(wh.maxStorageCapacity)
          : null;
        if (!maxCap || !wh.lots || wh.lots.length === 0) return false;
        const totalQty = wh.lots.reduce(
          (sum, lot) => sum + (lot.quantity || 0),
          0
        );
        return totalQty >= maxCap;
      });
    }

    return res.status(200).json({ warehouses });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as warehouseRouter };
