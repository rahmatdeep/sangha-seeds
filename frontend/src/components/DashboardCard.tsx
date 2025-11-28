// DashboardCard.tsx
import { theme } from "../theme";

interface DashboardCardProps {
  title: string;
  count: number;
  color: string;
  orders: Array<{
    id: string;
    quantity: number;
    status: string;
  }>;
  loading: boolean;
}

export default function DashboardCard({
  title,
  count,
  color,
  orders,
  loading,
}: DashboardCardProps) {
  return (
    <div
      className="rounded-xl shadow-md overflow-hidden"
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.accent}`,
      }}
    >
      {/* Header Section */}
      <div className="p-4 pb-3">
        <div
          className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2"
          style={{ color: theme.colors.primary }}
        >
          {title}
        </div>
        
        {/* Count Display */}
        {loading ? (
          <div 
            className="h-10 w-20 rounded animate-pulse"
            style={{ background: `${color}20` }}
          />
        ) : (
          <div
            className="text-4xl font-bold mb-1"
            style={{ color }}
          >
            {count}
          </div>
        )}
        
        <div
          className="text-xs opacity-50"
          style={{ color: theme.colors.primary }}
        >
          {orders.length === 1 ? "order" : "orders"} today
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${theme.colors.accent}40` }} />

      {/* Orders List */}
      <div className="p-4 pt-3">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 rounded animate-pulse"
                style={{ background: `${theme.colors.accent}30` }}
              />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-2">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between text-xs py-2 px-3 rounded-lg"
                style={{
                  background: `${color}10`,
                  border: `1px solid ${color}20`,
                }}
              >
                <span
                  className="font-mono font-semibold"
                  style={{ color: theme.colors.primary }}
                >
                  #{order.id.slice(0, 8)}
                </span>
                <span
                  className="opacity-70"
                  style={{ color: theme.colors.primary }}
                >
                  {order.quantity} qty
                </span>
              </div>
            ))}
            {orders.length > 3 && (
              <div
                className="text-xs text-center py-2 opacity-60"
                style={{ color: theme.colors.primary }}
              >
                +{orders.length - 3} more
              </div>
            )}
          </div>
        ) : (
          <div
            className="text-center py-6 px-3 rounded-lg"
            style={{
              background: `${theme.colors.accent}15`,
              border: `1px solid ${theme.colors.accent}30`,
            }}
          >
            <div
              className="text-xs opacity-60"
              style={{ color: theme.colors.primary }}
            >
              No orders yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
