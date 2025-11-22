import express from "express";
import cors from "cors";
import { adminMiddleware, authmiddleware } from "./middleware";
import { userRouter } from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.use(authmiddleware);
app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
