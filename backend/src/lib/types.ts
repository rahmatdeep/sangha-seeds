import { z } from "zod";

// Enums
export const UserRolesSchema = z.enum([
  "Administrator",
  "Manager",
  "ReadOnlyManager",
  "Employee",
]);

export const PotatoSizesSchema = z.enum([
  "Seed",
  "Soot12",
  "Soot11",
  "Soot10",
  "Soot8",
  "Soot4to6",
  "Soot4to8",
]);

export const OrderStatusSchema = z.enum([
  "placed",
  "acknowledged",
  "completed",
]);

// User Schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits").max(10, "Mobile number cannot exceed 10 digits"),
  role: UserRolesSchema,
  areaOfResponsibility: z.string().nullable().optional(),
  warehouseid: z.string().uuid().nullable().optional(),
  remarks: z.string().nullable().optional(),
});

export const UserCreateSchema = UserSchema.omit({ id: true });

export const UserUpdateSchema = UserSchema.omit({ id: true }).partial();

// Warehouse Schema
export const WarehouseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Warehouse name is required"),
  location: z.string().min(1, "Location is required"),
  maxStorageCapacity: z.string().nullable().optional(),
  maxDryingCapacity: z.string().nullable().optional(),
  assignedManagerId: z.string().uuid().nullable().optional(),
  remarks: z.string().nullable().optional(),
});

export const WarehouseCreateSchema = WarehouseSchema.omit({ id: true });

export const WarehouseUpdateSchema = WarehouseSchema.omit({
  id: true,
}).partial();

// Variety Schema
export const VarietySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Variety name is required"),
});

export const VarietyCreateSchema = VarietySchema.omit({ id: true });

export const VarietyUpdateSchema = VarietySchema.omit({ id: true }).partial();

// Lot Schema
export const LotSchema = z
  .object({
    id: z.string().uuid(),
    lotNo: z.string().min(1, "Lot number is required"),
    varietyId: z.string().uuid(),
    quantity: z.number().int().positive("Quantity must be positive"),
    quantityOnHold: z
      .number()
      .int()
      .nonnegative("Quantity on hold cannot be negative"),
    size: PotatoSizesSchema,
    storageDate: z.date().nullable().optional(),
    expiryDate: z.date().nullable().optional(),
    warehouseId: z.string().uuid().nullable().optional(),
    remarks: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      !data.expiryDate ||
      !data.storageDate ||
      data.expiryDate > data.storageDate,
    {
      message: "Expiry date must be after storage date",
      path: ["expiryDate"],
    }
  );

export const LotCreateSchema = LotSchema.omit({ id: true });

export const LotUpdateSchema = LotSchema.omit({
  id: true,
  quantityOnHold: true,
}).partial();

// Order Schema
export const OrderSchema = z
  .object({
    id: z.string().uuid(),
    destination: z.string().nullable().optional(),
    lotId: z.string().uuid(),
    quantity: z.number().int().positive("Quantity must be positive"),
    warehouseId: z.string().uuid(),
    createdById: z.string().uuid(),
    assignedManagerId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date().nullable().optional(),
    completedAt: z.date().nullable().optional(),
    isComplete: z.boolean(),
    completedById: z.string().uuid().nullable().optional(),
    isAcknowledged: z.boolean(),
    acknowledgedById: z.string().uuid().nullable().optional(),
    acknowledgedAt: z.date().nullable().optional(),
    remarks: z.string().nullable().optional(),
    status: OrderStatusSchema,
  })
  .refine(
    (data) => {
      if (data.isComplete && !data.completedById) {
        return false;
      }
      return true;
    },
    {
      message: "Completed orders must have a completedById",
      path: ["completedById"],
    }
  )
  .refine(
    (data) => {
      if (data.isAcknowledged && !data.acknowledgedById) {
        return false;
      }
      return true;
    },
    {
      message: "Acknowledged orders must have an acknowledgedById",
      path: ["acknowledgedById"],
    }
  )
  .refine(
    (data) => {
      // Status should align with completion and acknowledgment flags
      if (data.status === "completed" && !data.isComplete) {
        return false;
      }
      if (data.status === "acknowledged" && !data.isAcknowledged) {
        return false;
      }
      if (
        data.status === "placed" &&
        (data.isAcknowledged || data.isComplete)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Order status must align with isComplete and isAcknowledged flags",
      path: ["status"],
    }
  );

export const OrderCreateSchema = OrderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  acknowledgedAt: true,
});

export const OrderUpdateSchema = OrderSchema.omit({
  id: true,
  createdAt: true,
  createdById: true,
}).partial();

// Types inferred from schemas
export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export type Warehouse = z.infer<typeof WarehouseSchema>;
export type WarehouseCreate = z.infer<typeof WarehouseCreateSchema>;
export type WarehouseUpdate = z.infer<typeof WarehouseUpdateSchema>;

export type Variety = z.infer<typeof VarietySchema>;
export type VarietyCreate = z.infer<typeof VarietyCreateSchema>;
export type VarietyUpdate = z.infer<typeof VarietyUpdateSchema>;

export type Lot = z.infer<typeof LotSchema>;
export type LotCreate = z.infer<typeof LotCreateSchema>;
export type LotUpdate = z.infer<typeof LotUpdateSchema>;

export type Order = z.infer<typeof OrderSchema>;
export type OrderCreate = z.infer<typeof OrderCreateSchema>;
export type OrderUpdate = z.infer<typeof OrderUpdateSchema>;

export type UserRole = z.infer<typeof UserRolesSchema>;
export type PotatoSize = z.infer<typeof PotatoSizesSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

// ============================================
// QUERY PARAMETER SCHEMAS FOR API ENDPOINTS
// ============================================

// Common pagination and sorting schemas
const PaginationSchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default("1"),
  limit: z.string().regex(/^\d+$/).optional().default("10"),
});

const SortOrderSchema = z.enum(["asc", "desc"]).optional().default("desc");

// User Query Parameters
export const UserQuerySchema = PaginationSchema.extend({
  role: UserRolesSchema.optional(),
  warehouseId: z.string().uuid().optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["name", "email", "createdAt", "role"])
    .optional()
    .default("name"),
  order: SortOrderSchema,
});

// Warehouse Query Parameters
export const WarehouseQuerySchema = PaginationSchema.extend({
  id: z.string().uuid().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  hasCapacity: z.enum(["true", "false"]).optional(),
  sortBy: z
    .enum(["name", "location", "maxStorageCapacity"])
    .optional()
    .default("name"),
  order: SortOrderSchema,
});

// Warehouse Detail Query Parameters
export const WarehouseDetailQuerySchema = z.object({
  include: z.enum(["employees", "lots", "orders", "manager", "all"]).optional(),
});

// Variety Query Parameters
export const VarietyQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  hasLots: z.enum(["true", "false"]).optional(),
  sortBy: z.enum(["name"]).optional().default("name"),
  order: SortOrderSchema,
});

// Variety Detail Query Parameters
export const VarietyDetailQuerySchema = z.object({
  include: z.enum(["lots"]).optional(),
});

// Lot Query Parameters
export const LotQuerySchema = PaginationSchema.extend({
  warehouseId: z.string().uuid().optional(),
  varietyId: z.string().uuid().optional(),
  size: PotatoSizesSchema.optional(),
  minQuantity: z.string().regex(/^\d+$/).optional(),
  maxQuantity: z.string().regex(/^\d+$/).optional(),
  availableOnly: z.enum(["true", "false"]).optional(),
  expiryBefore: z.string().datetime().optional(),
  expiryAfter: z.string().datetime().optional(),
  storageDateFrom: z.string().datetime().optional(),
  storageDateTo: z.string().datetime().optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["lotNo", "quantity", "storageDate", "expiryDate", "size"])
    .optional()
    .default("storageDate"),
  order: SortOrderSchema,
});

// Lot Detail Query Parameters
export const LotDetailQuerySchema = z.object({
  include: z.enum(["variety", "warehouse", "orders", "all"]).optional(),
});

// Order Query Parameters
export const OrderQuerySchema = PaginationSchema.extend({
  status: OrderStatusSchema.optional(),
  warehouseId: z.string().uuid().optional(),
  lotId: z.string().uuid().optional(),
  varietyId: z.string().uuid().optional(),
  createdById: z.string().uuid().optional(),
  assignedManagerId: z.string().uuid().optional(),
  assignedEmployeeId: z.string().uuid().optional(),
  completedById: z.string().uuid().optional(),
  acknowledgedById: z.string().uuid().optional(),
  isComplete: z.enum(["true", "false"]).optional(),
  isAcknowledged: z.enum(["true", "false"]).optional(),
  createdFrom: z.string().datetime().optional(),
  createdTo: z.string().datetime().optional(),
  completedFrom: z.string().datetime().optional(),
  completedTo: z.string().datetime().optional(),
  destination: z.string().optional(),
  sortBy: z
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
export const OrderDetailQuerySchema = z.object({
  include: z
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
export const MyOrdersQuerySchema = PaginationSchema.extend({
  type: z
    .enum(["created", "assigned", "managed", "completed", "acknowledged"])
    .optional(),
  status: OrderStatusSchema.optional(),
  sortBy: z
    .enum(["createdAt", "completedAt", "acknowledgedAt"])
    .optional()
    .default("createdAt"),
  order: SortOrderSchema,
});

// Dashboard Query Parameters
export const DashboardQuerySchema = z.object({
  warehouseId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// Inventory Report Query Parameters
export const InventoryReportQuerySchema = z.object({
  warehouseId: z.string().uuid().optional(),
  varietyId: z.string().uuid().optional(),
  groupBy: z.enum(["warehouse", "variety", "size"]).optional(),
});

// Order Performance Report Query Parameters
export const OrderPerformanceQuerySchema = z.object({
  warehouseId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  groupBy: z.enum(["day", "week", "month", "user"]).optional().default("day"),
});

// Expiry Alert Query Parameters
export const ExpiryAlertQuerySchema = z.object({
  daysUntilExpiry: z.string().regex(/^\d+$/).optional().default("30"),
  warehouseId: z.string().uuid().optional(),
});

// Global Search Query Parameters
export const GlobalSearchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  type: z
    .enum(["users", "warehouses", "lots", "orders", "varieties", "all"])
    .optional()
    .default("all"),
  limit: z.string().regex(/^\d+$/).optional().default("5"),
});

// Assign Manager/Employee Body Schemas
export const AssignManagerSchema = z.object({
  managerId: z.string().uuid(),
});

export const AssignEmployeeSchema = z.object({
  employeeId: z.string().uuid(),
});

// Order Action Schemas (for acknowledge/complete)
export const AcknowledgeOrderSchema = z.object({
  acknowledgedById: z.string().uuid(),
  remarks: z.string().optional(),
});

export const CompleteOrderSchema = z.object({
  completedById: z.string().uuid(),
  remarks: z.string().optional(),
});

// Inferred Types for Query Parameters
export type UserQuery = z.infer<typeof UserQuerySchema>;
export type WarehouseQuery = z.infer<typeof WarehouseQuerySchema>;
export type WarehouseDetailQuery = z.infer<typeof WarehouseDetailQuerySchema>;
export type VarietyQuery = z.infer<typeof VarietyQuerySchema>;
export type VarietyDetailQuery = z.infer<typeof VarietyDetailQuerySchema>;
export type LotQuery = z.infer<typeof LotQuerySchema>;
export type LotDetailQuery = z.infer<typeof LotDetailQuerySchema>;
export type OrderQuery = z.infer<typeof OrderQuerySchema>;
export type OrderDetailQuery = z.infer<typeof OrderDetailQuerySchema>;
export type MyOrdersQuery = z.infer<typeof MyOrdersQuerySchema>;
export type DashboardQuery = z.infer<typeof DashboardQuerySchema>;
export type InventoryReportQuery = z.infer<typeof InventoryReportQuerySchema>;
export type OrderPerformanceQuery = z.infer<typeof OrderPerformanceQuerySchema>;
export type ExpiryAlertQuery = z.infer<typeof ExpiryAlertQuerySchema>;
export type GlobalSearchQuery = z.infer<typeof GlobalSearchQuerySchema>;
export type AssignManager = z.infer<typeof AssignManagerSchema>;
export type AssignEmployee = z.infer<typeof AssignEmployeeSchema>;
export type AcknowledgeOrder = z.infer<typeof AcknowledgeOrderSchema>;
export type CompleteOrder = z.infer<typeof CompleteOrderSchema>;

export type MyOrdersResponseOrder = Order & {
  acknowledgedBy?: User | null;
  completedBy?: User | null;
  createdBy: User;
  assignedManager: User;
  assignedEmployees: User[];
  lot: Lot;
  warehouse: Warehouse;
};

export type MyOrdersResponse = {
  orders: MyOrdersResponseOrder[];
};

export type WarehouseResponse = Warehouse & {
  assignedEmployees: User[];
  assignedManager: User | null;
  lots: Lot[];
  orders: Order[];
};

export type WarehousesResponse = {
  warehouses: WarehouseResponse[];
};
