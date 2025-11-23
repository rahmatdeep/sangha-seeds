import { Router, Request, Response } from "express";
import {
  authmiddleware,
  adminMiddleware,
  managerMiddleware,
  readOnlyMiddleware,
} from "../middleware";
import { prisma } from "../lib/prisma";
import z from "zod";
import { UserCreateSchema, UserUpdateSchema } from "../lib/types";

const router = Router();

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

router.get("/", readOnlyMiddleware, async (req: Request, res: Response) => {
  const { role, warehouseId, search, page = "1", limit = "10", sortBy, order } =
    req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const whereClause: any = {};

  if (role) {
    whereClause.role = role;
  }
  if (warehouseId) {
    whereClause.assignedWarehouseId = warehouseId;
  }
  if (search) {
    whereClause.OR = [
      { name: { contains: search as string, mode: "insensitive" } },
      { email: { contains: search as string, mode: "insensitive" } },
      { mobile: { contains: search as string, mode: "insensitive" } },
    ];
  }

  try {
    const users = await prisma.user.findMany({
      where: whereClause,
      skip,
      take: limitNumber,
      orderBy: sortBy
        ? {
            [sortBy as string]: order === "desc" ? "desc" : "asc",
          }
        : undefined,
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/create", adminMiddleware, async (req: Request, res: Response) => {
  const parsed = UserCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid request data" });
  }
  try {
    const user = await prisma.user.create({
      data: parsed.data,
    });
    return res.status(201).json({ message: user.id });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch(
  "/update/:id",
  adminMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const parsed = UserUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: parsed.data,
      });
      return res
        .status(200)
        .json({ message: `User id: ${user.id} updated successfully` });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.delete(
  "/delete/:id",
  adminMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
      return res
        .status(200)
        .json({ message: `User id: ${userId} deleted successfully` });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as userRouter };
