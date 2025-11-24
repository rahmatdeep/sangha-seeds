import type { Order } from "../types/order";
import { theme } from "../theme";
import { acknowledgeOrder, completeOrder } from "../api/orders";

export default function OrderCard({
  order,
  token,
  onStatusChange,
}: {
  order: Order;
  token: string;
  onStatusChange?: () => void;
}) {
  const handleAcknowledge = async () => {
    await acknowledgeOrder(order.id, token);
    if (onStatusChange) onStatusChange();
  };

  const handleComplete = async () => {
    await completeOrder(order.id, token);
    if (onStatusChange) onStatusChange();
  };

  return (
    <div
      className="rounded-2xl shadow-lg mb-6 p-5 flex flex-col gap-3"
      style={{
        background: theme.colors.surface,
        border: `1.5px solid ${theme.colors.accent}`,
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className="font-bold text-lg tracking-wide"
          style={{ color: theme.colors.primary }}
        >
          Lot #{order.lotId}
        </span>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold capitalize shadow"
          style={{
            background:
              order.status === "completed"
                ? theme.colors.success
                : order.status === "acknowledged"
                ? theme.colors.secondary
                : theme.colors.warning,
            color: theme.colors.surface,
            letterSpacing: "0.05em",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          }}
        >
          {order.status}
        </span>
      </div>
      <div
        className="grid grid-cols-2 gap-3 text-base"
        style={{ color: theme.colors.primary }}
      >
        <div>
          <div className="font-medium opacity-70">Quantity</div>
          <div className="font-semibold">{order.quantity}</div>
        </div>
        <div>
          <div className="font-medium opacity-70">Destination</div>
          <div className="font-semibold">{order.destination || "N/A"}</div>
        </div>
        <div>
          <div className="font-medium opacity-70">Warehouse</div>
          <div className="font-semibold">{order.warehouseId}</div>
        </div>
        <div>
          <div className="font-medium opacity-70">Date</div>
          <div className="font-semibold" style={{ color: theme.colors.info }}>
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="mt-4 flex gap-4">
        {order.status === "placed" && (
          <button
            className="flex-1 px-4 py-2 rounded-xl text-white text-base font-semibold shadow transition
              hover:brightness-95 hover:scale-[1.03] cursor-pointer"
            style={{
              background: theme.colors.secondary,
              borderRadius: theme.borderRadius.lg,
            }}
            onClick={handleAcknowledge}
          >
            Mark as Acknowledged
          </button>
        )}
        {order.status === "acknowledged" && (
          <button
            className="flex-1 px-4 py-2 rounded-xl text-white text-base font-semibold shadow transition
              hover:brightness-95 hover:scale-[1.03] cursor-pointer"
            style={{
              background: theme.colors.success,
              borderRadius: theme.borderRadius.lg,
            }}
            onClick={handleComplete}
          >
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
}
