"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const middleware_1 = require("./middleware");
const userRouter_1 = require("./routes/userRouter");
const warehouseRouter_1 = require("./routes/warehouseRouter");
const lotRouter_1 = require("./routes/lotRouter");
const orderRouter_1 = require("./routes/orderRouter");
const searchRouter_1 = require("./routes/searchRouter");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});
app.use(middleware_1.authmiddleware);
app.use("/api/v1/user", userRouter_1.userRouter);
app.use("/api/v1/warehouse", warehouseRouter_1.warehouseRouter);
app.use("/api/v1/lot", lotRouter_1.lotRouter);
app.use("/api/v1/order", orderRouter_1.orderRouter);
app.use("/api/v1/search", searchRouter_1.searchRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
