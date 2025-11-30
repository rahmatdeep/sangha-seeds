import { useEffect, useState } from "react";
import { fetchWarehouses } from "../api";
import { theme } from "../theme";
import type { Warehouse } from "../types";
import { FaWarehouse, FaFilter } from "react-icons/fa";
import { IoStorefrontOutline } from "react-icons/io5";
import WarehouseCard from "../components/WarehouseCard";
import { useNavigate } from "react-router-dom";
import FilterModal from "../components/FilterModal";

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchWarehouses(filters);
        setWarehouses(data);
      } catch {
        // handle error
      }
      setLoading(false);
    }
    load();
  }, [filters]);
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <FaWarehouse
            className="text-2xl"
            style={{ color: theme.colors.secondary }}
          />
          <h2
            className="text-2xl font-bold"
            style={{ color: theme.colors.primary }}
          >
            Warehouses
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            className="relative px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
            }}
            onClick={() => setShowFilter(true)}
          >
            <FaFilter />
            <span className="hidden sm:inline">Filter</span>
            {/* Add filter count badge if you implement filters */}
            {Object.keys(filters).length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{
                  background: theme.colors.warning,
                  color: theme.colors.surface,
                }}
              >
                {Object.keys(filters).length}
              </span>
            )}
          </button>
          {role === "Administrator" && (
            <button
              className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
              }}
              onClick={() => navigate("/warehouses/create")}
            >
              <span className="text-lg font-bold" style={{ lineHeight: 1 }}>
                +
              </span>
              <span className="hidden sm:inline">Create Warehouse</span>
              <span className="sm:hidden">Create</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <FilterModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilter(false)}
          role={role}
          type="warehouses"
        />
      )}
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
