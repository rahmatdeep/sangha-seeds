import { useEffect, useState } from "react";
import { fetchWarehouses } from "../api";
import { theme } from "../theme";
import type { Warehouse } from "../types";
import { FaWarehouse } from "react-icons/fa";
import { IoStorefrontOutline } from "react-icons/io5";
import WarehouseCard from "../components/WarehouseCard";

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchWarehouses(token);
        setWarehouses(data);
      } catch {
        // handle error
      }
      setLoading(false);
    }
    load();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaWarehouse
          className="text-3xl"
          style={{ color: theme.colors.secondary }}
        />
        <h2
          className="text-3xl font-bold"
          style={{ color: theme.colors.primary }}
        >
          Warehouses
        </h2>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl p-6"
              style={{
                background: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.accent}`,
              }}
            >
              <div
                className="h-6 rounded mb-4"
                style={{
                  backgroundColor: theme.colors.accent,
                  width: "40%",
                }}
              />
              <div
                className="h-4 rounded mb-3"
                style={{
                  backgroundColor: theme.colors.accent,
                  width: "60%",
                }}
              />
              <div
                className="h-4 rounded"
                style={{
                  backgroundColor: theme.colors.accent,
                  width: "50%",
                }}
              />
            </div>
          ))}
        </div>
      ) : warehouses.length === 0 ? (
        /* Empty State */
        <div
          className="text-center py-16 px-6 rounded-xl"
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            border: `2px dashed ${theme.colors.accent}`,
          }}
        >
          <IoStorefrontOutline
            className="mx-auto mb-4"
            style={{ fontSize: "4rem", color: theme.colors.accent }}
          />
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: theme.colors.primary }}
          >
            No warehouses found
          </h3>
          <p
            className="text-sm"
            style={{ color: theme.colors.primary, opacity: 0.7 }}
          >
            Warehouses will appear here once they are added
          </p>
        </div>
      ) : (
        /* Warehouse List */
        <div className="space-y-4">
          {warehouses.map((wh) => (
            <WarehouseCard key={wh.id} warehouse={wh} />
          ))}
        </div>
      )}
    </div>
  );
}
