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
exports.lotRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const prisma_1 = require("../lib/prisma");
const types_1 = require("../lib/types");
const router = (0, express_1.Router)();
exports.lotRouter = router;
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
router.get("/", middleware_1.readOnlyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { warehouseId, varietyId, size, minQuantity, maxQuantity, availableOnly, expiryBefore, expiryAfter, storageDateFrom, storageDateTo, search, page = "1", limit = "10", sortBy, order, } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const whereClause = {};
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
        whereClause.quantity = { gte: parseInt(minQuantity, 10) };
    }
    if (maxQuantity) {
        whereClause.quantity = Object.assign(Object.assign({}, whereClause.quantity), { lte: parseInt(maxQuantity, 10) });
    }
    if (availableOnly === "true") {
        whereClause.quantity = { gt: 0 };
    }
    if (expiryBefore) {
        whereClause.expiryDate = Object.assign(Object.assign({}, whereClause.expiryDate), { lt: new Date(expiryBefore) });
    }
    if (expiryAfter) {
        whereClause.expiryDate = Object.assign(Object.assign({}, whereClause.expiryDate), { gt: new Date(expiryAfter) });
    }
    if (storageDateFrom) {
        whereClause.storageDate = Object.assign(Object.assign({}, whereClause.storageDate), { gte: new Date(storageDateFrom) });
    }
    if (storageDateTo) {
        whereClause.storageDate = Object.assign(Object.assign({}, whereClause.storageDate), { lte: new Date(storageDateTo) });
    }
    if (search) {
        whereClause.lotNo = { contains: search, mode: "insensitive" };
    }
    try {
        const lots = yield prisma_1.prisma.lot.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: sortBy
                ? {
                    [sortBy]: order === "desc" ? "desc" : "asc",
                }
                : undefined,
        });
        return res.status(200).json(lots);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/:id", middleware_1.readOnlyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lotId = req.params.id;
    const includeVariety = req.query.include === "variety";
    const includeWarehouse = req.query.include === "warehouse";
    const includeOrders = req.query.include === "orders";
    try {
        const lot = yield prisma_1.prisma.lot.findUnique({
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/:id/availability", middleware_1.readOnlyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lotId = req.params.id;
    try {
        const lot = yield prisma_1.prisma.lot.findUnique({
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/", middleware_1.managerMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.LotCreateSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid request data" });
    }
    try {
        const lot = yield prisma_1.prisma.lot.create({
            data: parsedData.data,
        });
        return res.status(201).json({ message: lot.id });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
//locked quantity cannot be changed directly
router.patch("/:id", middleware_1.managerMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lotId = req.params.id;
    const parsedData = types_1.LotUpdateSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid request data" });
    }
    try {
        const lot = yield prisma_1.prisma.lot.update({
            where: { id: lotId },
            data: parsedData.data,
        });
        return res
            .status(200)
            .json({ message: `Lot id: ${lot.id} updated successfully` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.delete("/:id", middleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lotId = req.params.id;
    try {
        const lot = yield prisma_1.prisma.lot.delete({
            where: { id: lotId },
        });
        return res
            .status(200)
            .json({ message: `Lot id: ${lot.id} deleted successfully` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
