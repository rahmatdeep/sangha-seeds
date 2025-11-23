import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import { adminMiddleware, readOnlyMiddleware } from "../middleware";
import { VarietyCreateSchema, VarietyUpdateSchema } from "../lib/types";

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
const router = Router();

router.get("/", readOnlyMiddleware, async (req: Request, res: Response) => {
  const { search, hasLots, page = "1", limit = "10" } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const whereClause: any = {};

  if (search) {
    whereClause.name = { contains: search as string, mode: "insensitive" };
  }
  if (hasLots === "true") {
    whereClause.lots = { some: { quantity: { gt: 0 } } };
  }

  try {
    const varieties = await prisma.variety.findMany({
      where: whereClause,
      skip,
      take: limitNumber,
    });
    return res.status(200).json(varieties);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:name",
  readOnlyMiddleware,
  async (req: Request, res: Response) => {
    const varietyName = req.params.name;
    const includeLots = req.query.include === "lots";
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const skip = (page - 1) * limit;
    try {
      const variety = await prisma.variety.findFirst({
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/variety/:id",
  readOnlyMiddleware,
  async (req: Request, res: Response) => {
    const varietyId = req.params.id;
    const includeLots = req.query.include === "lots";
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const skip = (page - 1) * limit;

    try {
      const variety = await prisma.variety.findUnique({
        where: { id: varietyId },
        include: {
          lots: includeLots
            ? {
                skip,
                take: limit,
              }
            : false,
        }
        ,
      });
      if (!variety) {
        return res.status(404).json({ message: "Variety not found" });
      }
      return res.status(200).json(variety);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/", adminMiddleware, async (req: Request, res: Response) => {
    const parsed = VarietyCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    try {
      const variety = await prisma.variety.create({
        data: parsed.data,
      });
      return res.status(201).json({ message: variety.id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.patch("/:id", adminMiddleware, async (req: Request, res: Response) => {
    const varietyId = req.params.id;
    const parsed = VarietyUpdateSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    try {
      const variety = await prisma.variety.update({
        where: { id: varietyId },
        data: parsed.data,
      });
      return res.status(200).json({ message: "Variety updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.delete("/:id", adminMiddleware, async (req: Request, res: Response) => {
    const varietyId = req.params.id;
    try {
      await prisma.variety.delete({
        where: { id: varietyId },
      });
      return res.status(200).json({ message: "Variety deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { router as varietyRouter };
