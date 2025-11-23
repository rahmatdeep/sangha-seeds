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
exports.varietyRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const middleware_1 = require("../middleware");
const types_1 = require("../lib/types");
// List Varieties
// GET /api/varieties
// Query Parameters:
// search - Search by name
// hasLots - Only varieties with available lots (true/false)
// page - Page number
// limit - Items per page
// Get Variety by ID
// GET /api/varieties/:id
// Include Options:
// ?include=lots - Include all lots of this variety
// Create Variety
// POST /api/varieties
// Update Variety
// PATCH /api/varieties/:id
// Delete Variety
// DELETE /api/varieties/:id
const router = (0, express_1.Router)();
exports.varietyRouter = router;
router.get("/", middleware_1.readOnlyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, hasLots, page = "1", limit = "10" } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const whereClause = {};
    if (search) {
        whereClause.name = { contains: search, mode: "insensitive" };
    }
    if (hasLots === "true") {
        whereClause.lots = { some: { quantity: { gt: 0 } } };
    }
    try {
        const varieties = yield prisma_1.prisma.variety.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
        });
        return res.status(200).json(varieties);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/:name", middleware_1.readOnlyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const varietyName = req.params.name;
    const includeLots = req.query.include === "lots";
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
    try {
        const variety = yield prisma_1.prisma.variety.findFirst({
            where: { name: varietyName },
            include: {
                lots: includeLots
                    ? {
                        skip,
                        take: limit,
                    }
                    : false,
            },
        });
        if (!variety) {
            return res.status(404).json({ message: "Variety not found" });
        }
        return res.status(200).json(variety);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/variety/:id", middleware_1.readOnlyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const varietyId = req.params.id;
    const includeLots = req.query.include === "lots";
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;
    try {
        const variety = yield prisma_1.prisma.variety.findUnique({
            where: { id: varietyId },
            include: {
                lots: includeLots
                    ? {
                        skip,
                        take: limit,
                    }
                    : false,
            },
        });
        if (!variety) {
            return res.status(404).json({ message: "Variety not found" });
        }
        return res.status(200).json(variety);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/", middleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = types_1.VarietyCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request data" });
    }
    try {
        const variety = yield prisma_1.prisma.variety.create({
            data: parsed.data,
        });
        return res.status(201).json({ message: variety.id });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.patch("/:id", middleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const varietyId = req.params.id;
    const parsed = types_1.VarietyUpdateSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request data" });
    }
    try {
        const variety = yield prisma_1.prisma.variety.update({
            where: { id: varietyId },
            data: parsed.data,
        });
        return res.status(200).json({ message: "Variety updated successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.delete("/:id", middleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const varietyId = req.params.id;
    try {
        yield prisma_1.prisma.variety.delete({
            where: { id: varietyId },
        });
        return res.status(200).json({ message: "Variety deleted successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
