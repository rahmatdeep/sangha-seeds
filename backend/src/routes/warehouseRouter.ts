import { Router, Request, Response } from "express";
import {
  authmiddleware,
  adminMiddleware,
  managerMiddleware,
} from "../middleware";
import { prisma } from "../lib/prisma";
import z from "zod";
import { WarehouseCreateSchema } from "../lib/types";

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

router.get(
  "/warehouses",
  authmiddleware,
  async (req: Request, res: Response) => {
    try {
      const warehouses = await prisma.warehouse.findMany();
      return res.status(200).json(warehouses);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as warehouseRouter };
