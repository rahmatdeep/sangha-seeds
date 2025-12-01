import { useState, useEffect } from "react";
import { FaBoxOpen, FaFilter } from "react-icons/fa";
import { fetchLots, fetchWarehouses, fetchVarieties } from "../api";
import FilterModal from "../components/FilterModal";
import type { Lot, Warehouse, Variety } from "../types";
import { theme } from "../theme";
import { useNavigate } from "react-router-dom";

export default function Lots() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadWarehouses() {
      try {
        const data = await fetchWarehouses();
        setWarehouses(data);
      } catch {
        setWarehouses([]);
      }
    }
    async function loadVarieties() {
      try {
        const data = await fetchVarieties();
        setVarieties(data);
      } catch {
        setVarieties([]);
      }
    }
    loadWarehouses();
    loadVarieties();
  }, []);

  useEffect(() => {
    async function loadLots() {
      setLoading(true);
      try {
        const data = await fetchLots(filters);
        setLots(data);
      } catch {
        setLots([]);
      }
      setLoading(false);
    }
    loadLots();
  }, [filters]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      <div className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaBoxOpen className="text-2xl" style={{ color: theme.colors.secondary }} />
            <h2 className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
              Lots
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
            <button
              className="px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
              }}
              onClick={() => navigate("/lots/create")}
            >
              <span className="text-lg font-bold" style={{ lineHeight: 1 }}>
                +
              </span>
              <span>Create Lot</span>
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilter && (
          <FilterModal
            filters={filters}
            setFilters={setFilters}
            onClose={() => setShowFilter(false)}
            warehouses={warehouses}
            varieties={varieties}
            type="lots"
          />
        )}

        {/* State messages */}
        {loading && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: theme.colors.surface, color: theme.colors.primary }}>
            Loading lots…
          </div>
        )}
        {!loading && lots.length === 0 && (
          <div className="rounded-lg px-4 py-6 text-center text-sm" style={{ backgroundColor: theme.colors.surface, color: theme.colors.primary }}>
            No lots found.
          </div>
        )}

        {/* Lots list */}
        {!loading && lots.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {lots.map((lot) => (
              <article
                key={lot.id}
                className="flex items-center gap-3 rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
                style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.accent }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold sm:h-12 sm:w-12 sm:text-lg"
                  style={{ background: theme.colors.accent, color: theme.colors.primary }}>
                  {lot.lotNo?.[0]?.toUpperCase() ?? "L"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold sm:text-base" style={{ color: theme.colors.primary }}>
                    {lot.lotNo}
                  </div>
                  <div className="truncate text-xs text-gray-600 sm:text-sm">
                    Quantity: {lot.quantity}
                  </div>
                  <div className="truncate text-xs text-gray-600 sm:text-sm">
                    Size: {lot.size}
                  </div>
                  {lot.expiryDate && (
                    <div className="truncate text-xs text-gray-600 sm:text-sm">
                      Expiry: {new Date(lot.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}