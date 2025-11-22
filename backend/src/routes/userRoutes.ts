import { Router, Request, Response } from "express";
import {
  authmiddleware,
  adminMiddleware,
  managerMiddleware,
} from "../middleware";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/create-user", adminMiddleware, async (req: Request, res: Response) => {
});

export {router as userRouter};
