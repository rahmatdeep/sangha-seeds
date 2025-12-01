import { useState, useEffect } from "react";
import { FaSeedling, FaFilter } from "react-icons/fa";
import { fetchVarieties } from "../api";
import FilterModal from "../components/FilterModal";
import type { Variety } from "../types";
import { theme } from "../theme";
import { useNavigate } from "react-router-dom";

export default function Varieties() {
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  useEffect(() => {
    async function loadVarieties() {
      setLoading(true);
      try {
        const data = await fetchVarieties(filters);
        setVarieties(data);
      } catch {
        setVarieties([]);
      }
      setLoading(false);
    }
    loadVarieties();
  }, [filters]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      <div className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaSeedling className="text-2xl" style={{ color: theme.colors.secondary }} />
            <h2 className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
              Varieties
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
              onClick={() => navigate("/varieties/create")}
            >
              <span className="text-lg font-bold" style={{ lineHeight: 1 }}>
                +
              </span>
              <span>Create Variety</span>
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilter && (
          <FilterModal
            filters={filters}
            setFilters={setFilters}
            onClose={() => setShowFilter(false)}
            type="varieties"
          />
        )}

        {/* State messages */}
        {loading && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: theme.colors.surface, color: theme.colors.primary }}>
            Loading varieties…
          </div>
        )}
        {!loading && varieties.length === 0 && (
          <div className="rounded-lg px-4 py-6 text-center text-sm" style={{ backgroundColor: theme.colors.surface, color: theme.colors.primary }}>
            No varieties found.
          </div>
        )}

        {/* Varieties list */}
        {!loading && varieties.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {varieties.map((v) => (
              <article
                key={v.id}
                className="flex items-center gap-3 rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
                style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.accent }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold sm:h-12 sm:w-12 sm:text-lg"
                  style={{ background: theme.colors.accent, color: theme.colors.primary }}>
                  {v.name?.[0]?.toUpperCase() ?? "V"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold sm:text-base" style={{ color: theme.colors.primary }}>
                    {v.name}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}