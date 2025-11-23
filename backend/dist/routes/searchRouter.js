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
exports.searchRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
/*
Global Search
GET /api/search
Query Parameters:

q - Search query
type - Filter by type (users, warehouses, lots, orders, varieties)
limit - Max results per type

Returns combined results from all models
*/
const router = (0, express_1.Router)();
exports.searchRouter = router;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q, type, limit = "5" } = req.query;
    const limitNumber = parseInt(limit, 10);
    if (!q || (type && !["users", "warehouses", "lots", "orders", "varieties"].includes(type))) {
        return res.status(400).json({ message: "Invalid query parameters" });
    }
    const results = {};
    try {
        if (!type || type === "users") {
            const users = yield prisma_1.prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: "insensitive" } },
                        { email: { contains: q, mode: "insensitive" } },
                    ],
                },
                take: limitNumber,
            });
            results.users = users;
        }
        if (!type || type === "warehouses") {
            const warehouses = yield prisma_1.prisma.warehouse.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: "insensitive" } },
                        { location: { contains: q, mode: "insensitive" } },
                    ],
                },
                take: limitNumber,
            });
            results.warehouses = warehouses;
        }
        if (!type || type === "lots") {
            const lots = yield prisma_1.prisma.lot.findMany({
                where: {
                    lotNo: { contains: q, mode: "insensitive" },
                },
                take: limitNumber,
            });
            results.lots = lots;
        }
        if (!type || type === "orders") {
            const orders = yield prisma_1.prisma.order.findMany({
                where: {
                    id: { contains: q, mode: "insensitive" },
                },
                take: limitNumber,
            });
            results.orders = orders;
        }
        if (!type || type === "varieties") {
            const varieties = yield prisma_1.prisma.variety.findMany({
                where: {
                    name: { contains: q, mode: "insensitive" },
                },
                take: limitNumber,
            });
            results.varieties = varieties;
        }
        return res.status(200).json(results);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
