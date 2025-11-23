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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authmiddleware = authmiddleware;
exports.adminMiddleware = adminMiddleware;
exports.managerMiddleware = managerMiddleware;
exports.readOnlyMiddleware = readOnlyMiddleware;
const prisma_1 = require("./lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authmiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const isBearer = authHeader.split(" ")[0] === "Bearer";
    if (!isBearer) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
function adminMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isAdmin = yield prisma_1.prisma.user.findFirst({
                where: {
                    role: "Administrator",
                    id: req.userId,
                },
            });
            if (!isAdmin) {
                return res.status(403).json({ message: "Forbidden" });
            }
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(403).json({ message: "Forbidden" });
        }
    });
}
function managerMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isManager = yield prisma_1.prisma.user.findFirst({
                where: {
                    role: { in: ["Manager", "Administrator"] },
                    id: req.userId,
                },
            });
            if (!isManager) {
                return res.status(403).json({ message: "Forbidden" });
            }
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(403).json({ message: "Forbidden" });
        }
    });
}
function readOnlyMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isManager = yield prisma_1.prisma.user.findFirst({
                where: {
                    role: { in: ["Manager", "ReadOnlyManager", "Administrator"] },
                    id: req.userId,
                },
            });
            if (!isManager) {
                return res.status(403).json({ message: "Forbidden" });
            }
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(403).json({ message: "Forbidden" });
        }
    });
}
