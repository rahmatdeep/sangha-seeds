import { useState } from "react";
import { theme } from "../theme";
import Dropdown from "./ui/Dropdown";
import Calendar from "./ui/Calendar";
import type { Lot, Warehouse } from "../types";
import { IoClose } from "react-icons/io5";
import Checkbox from "./ui/Checkbox";

interface FilterModalProps {
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  onClose: () => void;
  lots?: Lot[];
  warehouses?: Warehouse[];
  role: string;
}

const statusOptions = [
  { value: "placed", label: "Placed" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "completed", label: "Completed" },
];

export default function FilterModal({
  filters,
  setFilters,
  onClose,
  lots = [],
  warehouses = [],
  role,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  // Only show for admin
  const [showMyOrders, setShowMyOrders] = useState(
    filters.showMyOrders || false
  );

  const handleChange = (name: string, value: string) => {
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleApply = () => {
    setFilters({ ...localFilters, showMyOrders });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
        style={{
          background: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          boxShadow: "0 6px 32px rgba(0,0,0,0.10)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg font-bold"
            style={{ color: theme.colors.primary }}
          >
            Filter Orders
          </h3>
          <button
            className="text-xl text-gray-400 hover:text-red-500 transition"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <IoClose />
          </button>
        </div>
        {/* Show My Orders Checkbox - Admin Only */}
        {role === "Administrator" && (
          <div className="mb-4">
            <Checkbox
              id="showMyOrders"
              label="Show only my orders"
              checked={showMyOrders}
              onChange={setShowMyOrders}
            />
          </div>
        )}

        <div className="mb-3">
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: theme.colors.primary }}
          >
            Status
          </label>
          <Dropdown
            options={statusOptions}
            value={localFilters.status || ""}
            onChange={(val) => handleChange("status", val)}
            placeholder="Select status"
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: theme.colors.primary }}
          >
            Warehouse ID
          </label>
          <Dropdown
            options={warehouses.map((wh: Warehouse) => ({
              value: wh.id,
              label: wh.name,
            }))}
            value={localFilters.warehouseId || ""}
            onChange={(val) => handleChange("warehouseId", val)}
            placeholder="Select warehouse"
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: theme.colors.primary }}
          >
            Lot ID
          </label>
          <Dropdown
            options={lots.map((lot: Lot) => ({
              value: lot.id,
              label: lot.lotNo,
            }))}
            value={localFilters.lotId || ""}
            onChange={(val) => handleChange("lotId", val)}
            placeholder="Select lot"
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: theme.colors.primary }}
          >
            Created From
          </label>
          <Calendar
            value={localFilters.createdFrom || ""}
            onChange={(val) => handleChange("createdFrom", val)}
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: theme.colors.primary }}
          >
            Created To
          </label>
          <Calendar
            value={localFilters.createdTo || ""}
            onChange={(val) => handleChange("createdTo", val)}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 py-2 rounded"
            style={{
              background: theme.colors.accent,
              color: theme.colors.primary,
              fontWeight: 600,
              borderRadius: theme.borderRadius.md,
            }}
            onClick={() => {
              setLocalFilters({});
              setFilters({});
              onClose();
            }}
            type="button"
          >
            Clear
          </button>
          <button
            className="flex-1 py-2 rounded"
            style={{
              background: theme.colors.success,
              color: theme.colors.surface,
              fontWeight: 600,
              borderRadius: theme.borderRadius.md,
            }}
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
