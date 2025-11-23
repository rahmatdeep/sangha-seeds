"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const prisma_1 = require("../lib/prisma");
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
const router = (0, express_1.Router)();
exports.dashboardRouter = router;
router.get("/", middleware_1.readOnlyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { warehouseId, dateFrom, dateTo } = req.query;
    try {
        const dashboardData = yield prisma_1.prisma.$queryRawUnsafe(`
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
