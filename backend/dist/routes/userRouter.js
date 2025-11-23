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
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const prisma_1 = require("../lib/prisma");
const types_1 = require("../lib/types");
const router = (0, express_1.Router)();
exports.userRouter = router;
/*
List users
GET /api/users

Query Parameters:

role - Filter by role (Administrator, Manager, ReadOnlyManager, Employee)
warehouseId - Filter by assigned warehouse
search - Search by name, email, or mobile
page - Page number (pagination)
limit - Items per page
sortBy - Sort field (name, email, createdAt)
order - Sort order (asc, desc)

eg GET /api/users?role=Employee&warehouseId=xxx&page=1&limit=10

Get user by id
GET /api/users/:id

Create user
POST /api/users

Update user
PATCH /api/users/:id

Delete user
DELETE /api/users/:id
*/
router.get("/", middleware_1.readOnlyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, warehouseId, search, page = "1", limit = "10", sortBy, order } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const whereClause = {};
    if (role) {
        whereClause.role = role;
    }
    if (warehouseId) {
        whereClause.assignedWarehouseId = warehouseId;
    }
    if (search) {
        whereClause.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { mobile: { contains: search, mode: "insensitive" } },
        ];
    }
    try {
        const users = yield prisma_1.prisma.user.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: sortBy
                ? {
                    [sortBy]: order === "desc" ? "desc" : "asc",
                }
                : undefined,
        });
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/create", middleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = types_1.UserCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request data" });
    }
    try {
        const user = yield prisma_1.prisma.user.create({
            data: parsed.data,
        });
        return res.status(201).json({ message: user.id });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.patch("/update/:id", middleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const parsed = types_1.UserUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request data" });
    }
    try {
        const user = yield prisma_1.prisma.user.update({
            where: { id: userId },
            data: parsed.data,
        });
        return res
            .status(200)
            .json({ message: `User id: ${user.id} updated successfully` });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}));
router.delete("/delete/:id", middleware_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        yield prisma_1.prisma.user.delete({
            where: { id: userId },
        });
        return res
            .status(200)
            .json({ message: `User id: ${userId} deleted successfully` });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}));
