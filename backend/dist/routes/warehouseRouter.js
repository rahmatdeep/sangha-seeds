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
exports.warehouseRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const prisma_1 = require("../lib/prisma");
const types_1 = require("../lib/types");
const router = (0, express_1.Router)();
exports.warehouseRouter = router;
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
router.post("/create-warehouse", middleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = types_1.WarehouseCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request data" });
    }
    try {
        const warehouse = yield prisma_1.prisma.warehouse.create({
            data: parsed.data,
        });
        return res.status(201).json({ message: warehouse.id });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/warehouses", middleware_1.authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const warehouses = yield prisma_1.prisma.warehouse.findMany();
        return res.status(200).json(warehouses);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}));
