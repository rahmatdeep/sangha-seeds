import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
/*
Global Search
GET /api/search
Query Parameters:

q - Search query
type - Filter by type (users, warehouses, lots, orders, varieties)
limit - Max results per type

Returns combined results from all models
*/

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { q, type, limit = "5" } = req.query;
  const limitNumber = parseInt(limit as string, 10);

  if (
    !q ||
    (type &&
      !["users", "warehouses", "lots", "orders", "varieties", "all"].includes(
        type as string
      ))
  ) {
    return res.status(400).json({ message: "Invalid query parameters" });
  }

  const results: any = {};

  try {
    if (!type || type === "users" || type === "all") {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q as string, mode: "insensitive" } },
            { email: { contains: q as string, mode: "insensitive" } },
          ],
        },
        take: limitNumber,
      });
      results.users = users;
    }

    if (!type || type === "warehouses" || type === "all") {
      const warehouses = await prisma.warehouse.findMany({
        where: {
          OR: [
            { name: { contains: q as string, mode: "insensitive" } },
            { location: { contains: q as string, mode: "insensitive" } },
          ],
        },
        take: limitNumber,
      });
      results.warehouses = warehouses;
    }

    if (!type || type === "lots" || type === "all") {
      const lots = await prisma.lot.findMany({
        where: {
          lotNo: { contains: q as string, mode: "insensitive" },
        },
        take: limitNumber,
      });
      results.lots = lots;
    }

    if (!type || type === "orders" || type === "all") {
      const orders = await prisma.order.findMany({
        where: {
          id: { contains: q as string, mode: "insensitive" },
        },
        take: limitNumber,
      });
      results.orders = orders;
    }

    if (!type || type === "varieties" || type === "all") {
      const varieties = await prisma.variety.findMany({
        where: {
          name: { contains: q as string, mode: "insensitive" },
        },
        take: limitNumber,
      });
      results.varieties = varieties;
    }

    return res.status(200).json({ results });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as searchRouter };
