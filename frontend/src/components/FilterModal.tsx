import { useState } from "react";
import { theme } from "../theme";
import Dropdown from "./ui/Dropdown";
import Calendar from "./ui/Calendar";
import type { Lot, User, Variety, Warehouse } from "../types";
import { IoClose } from "react-icons/io5";
import Checkbox from "./ui/Checkbox";
import Input from "./ui/Input";

interface FilterModalProps {
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  onClose: () => void;
  lots?: Lot[];
  warehouses?: Warehouse[];
  managers?: User[];
  employees?: User[];
  varieties?: Variety[];
  role: string;
  type: "orders" | "warehouses" | "users";
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
  managers = [],
  employees = [],
  varieties = [],
  role,
  type,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showMyOrders, setShowMyOrders] = useState(
    type === "orders" ? filters.showMyOrders || false : false
  );

  const isEmployee = role === "Employee";

  const handleChange = (name: string, value: string) => {
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleApply = () => {
    if (type === "orders") {
      setFilters({ ...localFilters, showMyOrders });
    } else {
      setFilters({ ...localFilters });
    }
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    setShowMyOrders(false);
    setFilters({});
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm max-h-[90vh]"
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
            {type === "orders" ? "Filter Orders" : "Filter Warehouses"}
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

        {/* Order Filters */}
        {type === "orders" && (
          <>
            {/* Status */}
            <div className="mb-3">
              <Dropdown
                label="Status"
                options={statusOptions}
                value={localFilters.status || ""}
                onChange={(val) => handleChange("status", val)}
                placeholder="Select status"
              />
            </div>
            {!isEmployee && (
              <>
                {/* Warehouse */}
                <div className="mb-3">
                  <Dropdown
                    label="Warehouse"
                    options={warehouses.map((wh: Warehouse) => ({
                      value: wh.id,
                      label: wh.name,
                    }))}
                    value={localFilters.warehouseId || ""}
                    onChange={(val) => handleChange("warehouseId", val)}
                    placeholder="Select warehouse"
                    searchable
                  />
                </div>

                {/* Lot*/}
                <div className="mb-3">
                  <Dropdown
                    label="Lot"
                    options={lots.map((lot: Lot) => ({
                      value: lot.id,
                      label: lot.lotNo,
                    }))}
                    value={localFilters.lotId || ""}
                    onChange={(val) => handleChange("lotId", val)}
                    placeholder="Select lot"
                    searchable
                  />
                </div>

                {/* Variety */}
                <div className="mb-3">
                  <Dropdown
                    label="Variety"
                    options={
                      varieties?.map((variety) => ({
                        value: variety.id,
                        label: variety.name,
                      })) || []
                    }
                    value={localFilters.varietyId || ""}
                    onChange={(val) => handleChange("varietyId", val)}
                    placeholder="Select variety"
                    searchable
                  />
                </div>

                {/* Assigned Manager */}
                <div className="mb-3">
                  <Dropdown
                    label="Assigned Manager"
                    options={
                      managers?.map((mgr) => ({
                        value: mgr.id,
                        label: mgr.name,
                      })) || []
                    }
                    value={localFilters.assignedManagerId || ""}
                    onChange={(val) => handleChange("assignedManagerId", val)}
                    placeholder="Select manager"
                    searchable
                  />
                </div>

                {/* Assigned Employee */}
                <div className="mb-3">
                  <Dropdown
                    label="Assigned Employee"
                    options={
                      employees?.map((emp) => ({
                        value: emp.id,
                        label: emp.name,
                      })) || []
                    }
                    value={localFilters.assignedEmployeeId || ""}
                    onChange={(val) => handleChange("assignedEmployeeId", val)}
                    placeholder="Select employee"
                    searchable
                  />
                </div>
              </>
            )}

            {/* Created From */}
            <div className="mb-3">
              <Calendar
                label="Created From"
                value={localFilters.createdFrom || ""}
                onChange={(val) => handleChange("createdFrom", val)}
                max={localFilters.createdTo || undefined}
              />
            </div>

            {/* Created To */}
            <div className="mb-3">
              <Calendar
                label="Created To"
                value={localFilters.createdTo || ""}
                onChange={(val) => handleChange("createdTo", val)}
                min={localFilters.createdFrom || undefined}
              />
            </div>

            {/* Show My Orders Checkbox - Admin/Manager/ReadOnlyManager Only */}
            {!isEmployee && (
              <div className="mb-4">
                <Checkbox
                  id="showMyOrders"
                  label="Show only my orders"
                  checked={showMyOrders}
                  onChange={setShowMyOrders}
                />
              </div>
            )}
          </>
        )}

        {/* Warehouse Filters */}
        {type === "warehouses" && (
          <>
            <div className="mb-3">
              <Input
                label="Search"
                placeholder="Search name or location"
                value={localFilters.search || ""}
                onChange={(e) => handleChange("search", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <Input
                label="Location"
                type="text"
                value={localFilters.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Enter location"
              />
            </div>
            <div className="mb-3">
              <Checkbox
                id="hasCapacity"
                label="Has available capacity"
                checked={localFilters.hasCapacity === "true"}
                onChange={(checked) =>
                  handleChange("hasCapacity", checked ? "true" : "false")
                }
              />
            </div>
            <div className="mb-3">
              <Dropdown
                label="Sort By"
                options={[
                  { value: "name", label: "Name" },
                  { value: "location", label: "Location" },
                  {
                    value: "maxStorageCapacity",
                    label: "Max Storage Capacity",
                  },
                ]}
                value={localFilters.sortBy || ""}
                onChange={(val) => handleChange("sortBy", val)}
                placeholder="Sort by"
              />
            </div>
            <div className="mb-3">
              <Dropdown
                label="Order"
                options={[
                  { value: "asc", label: "Ascending" },
                  { value: "desc", label: "Descending" },
                ]}
                value={localFilters.order || "desc"}
                onChange={(val) => handleChange("order", val)}
                placeholder="Order"
              />
            </div>
          </>
        )}

        {/* User Filters */}
        {type === "users" && (
          <>
            <div className="mb-3">
              <Input
                label="Search"
                placeholder="Search name or email or mobile"
                value={localFilters.search || ""}
                onChange={(e) => handleChange("search", e.target.value)}
              />
            </div>
            <div>
              <Dropdown
                label="Warehouse"
                options={warehouses.map((wh: Warehouse) => ({
                  value: wh.id,
                  label: wh.name,
                }))}
                value={localFilters.warehouseId || ""}
                onChange={(val) => handleChange("warehouseId", val)}
                placeholder="Select warehouse"
              />
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 py-2 rounded"
            style={{
              background: theme.colors.accent,
              color: theme.colors.primary,
              fontWeight: 600,
              borderRadius: theme.borderRadius.md,
            }}
            onClick={handleClear}
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
