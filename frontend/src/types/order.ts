export type OrderStatus = "placed" | "acknowledged" | "completed";
export interface Order {
  id: string;
  lotId: string;
  lot?: { lotNo: string };
  warehouseId: string;
  warehouse?: { name: string };
  quantity: number;
  destination?: string;
  status: OrderStatus;
  remarks?: string;
  createdAt: string;
}
