import express from "express";
import cors from "cors";
import { adminMiddleware, authmiddleware } from "./middleware";
import { userRouter } from "./routes/userRouter";
import { warehouseRouter } from "./routes/warehouseRouter";
import { lotRouter } from "./routes/lotRouter";
import { orderRouter } from "./routes/orderRouter";
import { searchRouter } from "./routes/searchRouter";
import { varietyRouter } from "./routes/varietyRouter";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.use(authmiddleware);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/warehouse", warehouseRouter);
app.use("/api/v1/lot", lotRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/variety", varietyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
