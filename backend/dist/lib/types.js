"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteOrderSchema = exports.AcknowledgeOrderSchema = exports.AssignEmployeeSchema = exports.AssignManagerSchema = exports.GlobalSearchQuerySchema = exports.ExpiryAlertQuerySchema = exports.OrderPerformanceQuerySchema = exports.InventoryReportQuerySchema = exports.DashboardQuerySchema = exports.MyOrdersQuerySchema = exports.OrderDetailQuerySchema = exports.OrderQuerySchema = exports.LotDetailQuerySchema = exports.LotQuerySchema = exports.VarietyDetailQuerySchema = exports.VarietyQuerySchema = exports.WarehouseDetailQuerySchema = exports.WarehouseQuerySchema = exports.UserQuerySchema = exports.OrderUpdateSchema = exports.OrderCreateSchema = exports.OrderSchema = exports.LotUpdateSchema = exports.LotCreateSchema = exports.LotSchema = exports.VarietyUpdateSchema = exports.VarietyCreateSchema = exports.VarietySchema = exports.WarehouseUpdateSchema = exports.WarehouseCreateSchema = exports.WarehouseSchema = exports.UserUpdateSchema = exports.UserCreateSchema = exports.UserSchema = exports.OrderStatusSchema = exports.PotatoSizesSchema = exports.UserRolesSchema = void 0;
const zod_1 = require("zod");
// Enums
exports.UserRolesSchema = zod_1.z.enum([
    "Administrator",
    "Manager",
    "ReadOnlyManager",
    "Employee",
]);
exports.PotatoSizesSchema = zod_1.z.enum([
    "Seed",
    "Soot12",
    "Soot11",
    "Soot10",
    "Soot8",
    "Soot4to6",
    "Soot4to8",
]);
exports.OrderStatusSchema = zod_1.z.enum([
    "placed",
    "acknowledged",
    "completed",
]);
// User Schema
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    mobile: zod_1.z.string().min(10, "Mobile number must be at least 10 digits"),
    role: exports.UserRolesSchema,
    areaOfResponsibility: zod_1.z.string().nullable().optional(),
    warehouseid: zod_1.z.string().uuid().nullable().optional(),
    remarks: zod_1.z.string().nullable().optional(),
});
exports.UserCreateSchema = exports.UserSchema.omit({ id: true });
exports.UserUpdateSchema = exports.UserSchema.omit({ id: true }).partial();
// Warehouse Schema
exports.WarehouseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1, "Warehouse name is required"),
    location: zod_1.z.string().min(1, "Location is required"),
    maxStorageCapacity: zod_1.z.string().nullable().optional(),
    maxDryingCapacity: zod_1.z.string().nullable().optional(),
    remarks: zod_1.z.string().nullable().optional(),
});
exports.WarehouseCreateSchema = exports.WarehouseSchema.omit({ id: true });
exports.WarehouseUpdateSchema = exports.WarehouseSchema.omit({
    id: true,
}).partial();
// Variety Schema
exports.VarietySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1, "Variety name is required"),
});
exports.VarietyCreateSchema = exports.VarietySchema.omit({ id: true });
exports.VarietyUpdateSchema = exports.VarietySchema.omit({ id: true }).partial();
// Lot Schema
exports.LotSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid(),
    lotNo: zod_1.z.string().min(1, "Lot number is required"),
    varietyId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().int().positive("Quantity must be positive"),
    quantityOnHold: zod_1.z
        .number()
        .int()
        .nonnegative("Quantity on hold cannot be negative"),
    size: exports.PotatoSizesSchema,
    storageDate: zod_1.z.date().nullable().optional(),
    expiryDate: zod_1.z.date().nullable().optional(),
    warehouseId: zod_1.z.string().uuid().nullable().optional(),
    remarks: zod_1.z.string().nullable().optional(),
})
    .refine((data) => !data.expiryDate ||
    !data.storageDate ||
    data.expiryDate > data.storageDate, {
    message: "Expiry date must be after storage date",
    path: ["expiryDate"],
});
exports.LotCreateSchema = exports.LotSchema.omit({ id: true });
exports.LotUpdateSchema = exports.LotSchema.omit({
    id: true,
    quantityOnHold: true,
}).partial();
// Order Schema
exports.OrderSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid(),
    destination: zod_1.z.string().nullable().optional(),
    lotId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().int().positive("Quantity must be positive"),
    warehouseId: zod_1.z.string().uuid(),
    createdById: zod_1.z.string().uuid(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date().nullable().optional(),
    completedAt: zod_1.z.date().nullable().optional(),
    isComplete: zod_1.z.boolean(),
    completedById: zod_1.z.string().uuid().nullable().optional(),
    isAcknowledged: zod_1.z.boolean(),
    acknowledgedById: zod_1.z.string().uuid().nullable().optional(),
    acknowledgedAt: zod_1.z.date().nullable().optional(),
    remarks: zod_1.z.string().nullable().optional(),
    status: exports.OrderStatusSchema,
})
    .refine((data) => {
    if (data.isComplete && !data.completedById) {
        return false;
    }
    return true;
}, {
    message: "Completed orders must have a completedById",
    path: ["completedById"],
})
    .refine((data) => {
    if (data.isAcknowledged && !data.acknowledgedById) {
        return false;
    }
    return true;
}, {
    message: "Acknowledged orders must have an acknowledgedById",
    path: ["acknowledgedById"],
})
    .refine((data) => {
    // Status should align with completion and acknowledgment flags
    if (data.status === "completed" && !data.isComplete) {
        return false;
    }
    if (data.status === "acknowledged" && !data.isAcknowledged) {
        return false;
    }
    if (data.status === "placed" &&
        (data.isAcknowledged || data.isComplete)) {
        return false;
    }
    return true;
}, {
    message: "Order status must align with isComplete and isAcknowledged flags",
    path: ["status"],
});
exports.OrderCreateSchema = exports.OrderSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    completedAt: true,
    acknowledgedAt: true,
});
exports.OrderUpdateSchema = exports.OrderSchema.omit({
    id: true,
    createdAt: true,
    createdById: true,
}).partial();
// ============================================
// QUERY PARAMETER SCHEMAS FOR API ENDPOINTS
// ============================================
// Common pagination and sorting schemas
const PaginationSchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).optional().default("1"),
    limit: zod_1.z.string().regex(/^\d+$/).optional().default("10"),
});
const SortOrderSchema = zod_1.z.enum(["asc", "desc"]).optional().default("desc");
// User Query Parameters
exports.UserQuerySchema = PaginationSchema.extend({
    role: exports.UserRolesSchema.optional(),
    warehouseId: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z
        .enum(["name", "email", "createdAt", "role"])
        .optional()
        .default("name"),
    order: SortOrderSchema,
});
// Warehouse Query Parameters
exports.WarehouseQuerySchema = PaginationSchema.extend({
    location: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    hasCapacity: zod_1.z.enum(["true", "false"]).optional(),
    sortBy: zod_1.z
        .enum(["name", "location", "maxStorageCapacity"])
        .optional()
        .default("name"),
    order: SortOrderSchema,
});
// Warehouse Detail Query Parameters
exports.WarehouseDetailQuerySchema = zod_1.z.object({
    include: zod_1.z.enum(["employees", "lots", "orders", "all"]).optional(),
});
// Variety Query Parameters
exports.VarietyQuerySchema = PaginationSchema.extend({
    search: zod_1.z.string().optional(),
    hasLots: zod_1.z.enum(["true", "false"]).optional(),
    sortBy: zod_1.z.enum(["name"]).optional().default("name"),
    order: SortOrderSchema,
});
// Variety Detail Query Parameters
exports.VarietyDetailQuerySchema = zod_1.z.object({
    include: zod_1.z.enum(["lots"]).optional(),
});
// Lot Query Parameters
exports.LotQuerySchema = PaginationSchema.extend({
    warehouseId: zod_1.z.string().uuid().optional(),
    varietyId: zod_1.z.string().uuid().optional(),
    size: exports.PotatoSizesSchema.optional(),
    minQuantity: zod_1.z.string().regex(/^\d+$/).optional(),
    maxQuantity: zod_1.z.string().regex(/^\d+$/).optional(),
    availableOnly: zod_1.z.enum(["true", "false"]).optional(),
    expiryBefore: zod_1.z.string().datetime().optional(),
    expiryAfter: zod_1.z.string().datetime().optional(),
    storageDateFrom: zod_1.z.string().datetime().optional(),
    storageDateTo: zod_1.z.string().datetime().optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z
        .enum(["lotNo", "quantity", "storageDate", "expiryDate", "size"])
        .optional()
        .default("storageDate"),
    order: SortOrderSchema,
});
// Lot Detail Query Parameters
exports.LotDetailQuerySchema = zod_1.z.object({
    include: zod_1.z.enum(["variety", "warehouse", "orders", "all"]).optional(),
});
// Order Query Parameters
exports.OrderQuerySchema = PaginationSchema.extend({
    status: exports.OrderStatusSchema.optional(),
    warehouseId: zod_1.z.string().uuid().optional(),
    lotId: zod_1.z.string().uuid().optional(),
    varietyId: zod_1.z.string().uuid().optional(),
    createdById: zod_1.z.string().uuid().optional(),
    assignedManagerId: zod_1.z.string().uuid().optional(),
    assignedEmployeeId: zod_1.z.string().uuid().optional(),
    completedById: zod_1.z.string().uuid().optional(),
    acknowledgedById: zod_1.z.string().uuid().optional(),
    isComplete: zod_1.z.enum(["true", "false"]).optional(),
    isAcknowledged: zod_1.z.enum(["true", "false"]).optional(),
    createdFrom: zod_1.z.string().datetime().optional(),
    createdTo: zod_1.z.string().datetime().optional(),
    completedFrom: zod_1.z.string().datetime().optional(),
    completedTo: zod_1.z.string().datetime().optional(),
    destination: zod_1.z.string().optional(),
    sortBy: zod_1.z
        .enum([
        "createdAt",
        "completedAt",
        "acknowledgedAt",
        "quantity",
        "updatedAt",
    ])
        .optional()
        .default("createdAt"),
    order: SortOrderSchema,
});
// Order Detail Query Parameters
exports.OrderDetailQuerySchema = zod_1.z.object({
    include: zod_1.z
        .enum([
        "lot",
        "warehouse",
        "createdBy",
        "assignedManager",
        "assignedEmployees",
        "completedBy",
        "acknowledgedBy",
        "all",
    ])
        .optional(),
});
// My Orders Query Parameters
exports.MyOrdersQuerySchema = PaginationSchema.extend({
    type: zod_1.z
        .enum(["created", "assigned", "managed", "completed", "acknowledged"])
        .optional(),
    status: exports.OrderStatusSchema.optional(),
    sortBy: zod_1.z
        .enum(["createdAt", "completedAt", "acknowledgedAt"])
        .optional()
        .default("createdAt"),
    order: SortOrderSchema,
});
// Dashboard Query Parameters
exports.DashboardQuerySchema = zod_1.z.object({
    warehouseId: zod_1.z.string().uuid().optional(),
    dateFrom: zod_1.z.string().datetime().optional(),
    dateTo: zod_1.z.string().datetime().optional(),
});
// Inventory Report Query Parameters
exports.InventoryReportQuerySchema = zod_1.z.object({
    warehouseId: zod_1.z.string().uuid().optional(),
    varietyId: zod_1.z.string().uuid().optional(),
    groupBy: zod_1.z.enum(["warehouse", "variety", "size"]).optional(),
});
// Order Performance Report Query Parameters
exports.OrderPerformanceQuerySchema = zod_1.z.object({
    warehouseId: zod_1.z.string().uuid().optional(),
    dateFrom: zod_1.z.string().datetime().optional(),
    dateTo: zod_1.z.string().datetime().optional(),
    groupBy: zod_1.z.enum(["day", "week", "month", "user"]).optional().default("day"),
});
// Expiry Alert Query Parameters
exports.ExpiryAlertQuerySchema = zod_1.z.object({
    daysUntilExpiry: zod_1.z.string().regex(/^\d+$/).optional().default("30"),
    warehouseId: zod_1.z.string().uuid().optional(),
});
// Global Search Query Parameters
exports.GlobalSearchQuerySchema = zod_1.z.object({
    q: zod_1.z.string().min(1, "Search query is required"),
    type: zod_1.z
        .enum(["users", "warehouses", "lots", "orders", "varieties", "all"])
        .optional()
        .default("all"),
    limit: zod_1.z.string().regex(/^\d+$/).optional().default("5"),
});
// Assign Manager/Employee Body Schemas
exports.AssignManagerSchema = zod_1.z.object({
    managerId: zod_1.z.string().uuid(),
});
exports.AssignEmployeeSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
});
// Order Action Schemas (for acknowledge/complete)
exports.AcknowledgeOrderSchema = zod_1.z.object({
    acknowledgedById: zod_1.z.string().uuid(),
    remarks: zod_1.z.string().optional(),
});
exports.CompleteOrderSchema = zod_1.z.object({
    completedById: zod_1.z.string().uuid(),
    remarks: zod_1.z.string().optional(),
});
