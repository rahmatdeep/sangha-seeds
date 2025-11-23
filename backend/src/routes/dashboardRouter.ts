import { Router, Request, Response } from "express";
import { readOnlyMiddleware } from "../middleware";
import { prisma } from "../lib/prisma";
/*
Dashboard Overview
GET /api/dashboard
Query Parameters:

warehouseId - Filter by warehouse
dateFrom - Start date for metrics
dateTo - End date for metrics

Returns:

Total orders (by status)
Total lots and quantities
Warehouse utilization
Pending orders
Recent activity

Inventory Report
GET /api/reports/inventory
Query Parameters:

warehouseId - Filter by warehouse
varietyId - Filter by variety
groupBy - Group results (warehouse, variety, size)

Order Performance Report
GET /api/reports/order-performance
Query Parameters:

warehouseId - Filter by warehouse
dateFrom - Start date
dateTo - End date
groupBy - Group by (day, week, month, user)

Expiry Alert
GET /api/reports/expiry-alerts
Query Parameters:

daysUntilExpiry - Alert threshold (default: 30 days)
warehouseId - Filter by warehouse
*/
const router = Router();

router.get("/", readOnlyMiddleware, async (req: Request, res: Response) => {
  const { warehouseId, dateFrom, dateTo } = req.query;
    try {
    const dashboardData = await prisma.$queryRawUnsafe(`
      SELECT 
        (SELECT COUNT(*) FROM "Order" WHERE "warehouseId" = ${warehouseId} AND "createdAt" BETWEEN ${dateFrom} AND ${dateTo}) AS "totalOrders",
        (SELECT COUNT(*) FROM "Lot" WHERE "warehouseId" = ${warehouseId}) AS "totalLots",
        (SELECT SUM(quantity) FROM "Lot" WHERE "warehouseId" = ${warehouseId}) AS "totalQuantity",
        (SELECT COUNT(*) FROM "Order" WHERE "warehouseId" = ${warehouseId} AND status = 'Pending') AS "pendingOrders"
    `);
    if (!dashboardData) {
      return res.status(404).json({ message: "Dashboard data not found" });
    }
    return res.status(200).json(dashboardData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  } 
  
});



export {router as dashboardRouter};