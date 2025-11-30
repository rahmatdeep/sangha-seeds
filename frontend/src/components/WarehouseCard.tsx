import { useState } from "react";
import type { User, Lot, Order, WarehouseResponse } from "../types";
import { theme } from "../theme";
import {
  IoChevronDown,
  IoLocationOutline,
  IoPeopleOutline,
  IoStorefrontOutline,
  IoDocumentTextOutline,
  IoPersonOutline,
  IoLayersOutline,
} from "react-icons/io5";

export default function WarehouseCard({
  warehouse,
}: {
  warehouse: WarehouseResponse;
}) {
  const [showCapacity, setShowCapacity] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  const employeeCount = warehouse.assignedEmployees?.length || 0;
  const lotCount = warehouse.lots?.length || 0;
  const activeOrderCount =
    warehouse.orders?.filter((order: Order) => order.status !== "completed")
      .length || 0;

  // Calculate total storage used from lots
  const totalStorageUsed =
    warehouse.lots?.reduce((sum: number, lot: Lot) => sum + lot.quantity, 0) ||
    0;

  return (
    <div
      className="rounded-xl shadow-md mb-3 overflow-hidden"
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.accent}`,
      }}
    >
      {/* Header - Always Visible */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <span
              className="font-bold text-lg mb-1"
              style={{ color: theme.colors.primary }}
            >
              {warehouse.name}
            </span>
            <div className="flex items-center gap-1.5 text-sm">
              <IoLocationOutline
                className="w-4 h-4"
                style={{ color: theme.colors.primary, opacity: 0.6 }}
              />
              <span
                className="opacity-70"
                style={{ color: theme.colors.primary }}
              >
                {warehouse.location}
              </span>
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0"
            style={{
              background:
                activeOrderCount > 0
                  ? theme.colors.secondary + "20"
                  : theme.colors.accent + "40",
              color:
                activeOrderCount > 0
                  ? theme.colors.secondary
                  : theme.colors.primary,
              border: `1px solid ${
                activeOrderCount > 0
                  ? theme.colors.secondary + "40"
                  : theme.colors.accent
              }`,
            }}
          >
            {activeOrderCount > 0 ? "Active" : "Idle"}
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-sm mb-3">
          <div
            className="text-center p-2 rounded-lg"
            style={{ background: theme.colors.accent + "20" }}
          >
            <div
              className="text-xs opacity-60 mb-0.5"
              style={{ color: theme.colors.primary }}
            >
              Staff
            </div>
            <div
              className="font-bold text-lg"
              style={{ color: theme.colors.primary }}
            >
              {employeeCount}
            </div>
          </div>
          <div
            className="text-center p-2 rounded-lg"
            style={{ background: theme.colors.accent + "20" }}
          >
            <div
              className="text-xs opacity-60 mb-0.5"
              style={{ color: theme.colors.primary }}
            >
              Lots
            </div>
            <div
              className="font-bold text-lg"
              style={{ color: theme.colors.primary }}
            >
              {lotCount}
            </div>
          </div>
          <div
            className="text-center p-2 rounded-lg"
            style={{ background: theme.colors.accent + "20" }}
          >
            <div
              className="text-xs opacity-60 mb-0.5"
              style={{ color: theme.colors.primary }}
            >
              Orders
            </div>
            <div
              className="font-bold text-lg"
              style={{ color: theme.colors.primary }}
            >
              {activeOrderCount}
            </div>
          </div>
        </div>

        {/* Remarks - If exists */}
        {warehouse.remarks && (
          <div
            className="rounded-lg p-3 mb-3"
            style={{
              backgroundColor: theme.colors.accent + "20",
              border: `1px solid ${theme.colors.accent}40`,
            }}
          >
            <div className="flex items-start gap-2">
              <IoDocumentTextOutline
                className="w-4 h-4 mt-0.5 shrink-0"
                style={{ color: theme.colors.primary, opacity: 0.6 }}
              />
              <div className="min-w-0 flex-1">
                <div
                  className="text-xs opacity-60 mb-1"
                  style={{ color: theme.colors.primary }}
                >
                  Remarks
                </div>
                <div
                  className="text-sm leading-relaxed"
                  style={{ color: theme.colors.primary }}
                >
                  {warehouse.remarks}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion Sections */}
      <div style={{ borderTop: `1px solid ${theme.colors.accent}40` }}>
        {/* Capacity Accordion */}
        <button
          onClick={() => setShowCapacity(!showCapacity)}
          className="w-full px-4 py-3 flex items-center justify-between transition-colors hover:bg-opacity-50"
          style={{
            backgroundColor: showCapacity
              ? theme.colors.accent + "15"
              : "transparent",
            color: theme.colors.primary,
          }}
        >
          <div className="flex items-center gap-2">
            <IoLayersOutline className="w-4 h-4" />
            <span className="font-semibold text-sm">Capacity Details</span>
          </div>
          <IoChevronDown
            className="w-4 h-4 transition-transform"
            style={{
              transform: showCapacity ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
        {showCapacity && (
          <div
            className="px-4 pb-3 space-y-2 text-xs"
            style={{ backgroundColor: theme.colors.background + "50" }}
          >
            {warehouse.maxStorageCapacity && (
              <div className="flex justify-between items-center gap-2">
                <span
                  className="opacity-60"
                  style={{ color: theme.colors.primary }}
                >
                  Max Storage Capacity
                </span>
                <span
                  className="font-semibold"
                  style={{ color: theme.colors.info }}
                >
                  {warehouse.maxStorageCapacity}
                </span>
              </div>
            )}

            {warehouse.maxDryingCapacity && (
              <div className="flex justify-between items-center gap-2">
                <span
                  className="opacity-60"
                  style={{ color: theme.colors.primary }}
                >
                  Max Drying Capacity
                </span>
                <span
                  className="font-semibold"
                  style={{ color: theme.colors.secondary }}
                >
                  {warehouse.maxDryingCapacity}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center gap-2">
              <span
                className="opacity-60"
                style={{ color: theme.colors.primary }}
              >
                Current Storage Used
              </span>
              <span
                className="font-semibold"
                style={{ color: theme.colors.success }}
              >
                {totalStorageUsed.toLocaleString()} units
              </span>
            </div>

            {!warehouse.maxStorageCapacity && !warehouse.maxDryingCapacity && (
              <div
                className="text-center py-2 opacity-60"
                style={{ color: theme.colors.primary }}
              >
                No capacity information available
              </div>
            )}
          </div>
        )}

        {/* Team Accordion */}
        <button
          onClick={() => setShowTeam(!showTeam)}
          className="w-full px-4 py-3 flex items-center justify-between transition-colors hover:bg-opacity-50"
          style={{
            borderTop: `1px solid ${theme.colors.accent}40`,
            backgroundColor: showTeam
              ? theme.colors.accent + "15"
              : "transparent",
            color: theme.colors.primary,
          }}
        >
          <div className="flex items-center gap-2">
            <IoPeopleOutline className="w-4 h-4" />
            <span className="font-semibold text-sm">Assigned Team</span>
          </div>
          <IoChevronDown
            className="w-4 h-4 transition-transform"
            style={{
              transform: showTeam ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
        {showTeam && (
          <div
            className="px-4 pb-3 space-y-2 text-sm"
            style={{ backgroundColor: theme.colors.background + "50" }}
          >
            <div>
              <div
                className="text-xs opacity-60 mb-1 flex items-center gap-1"
                style={{ color: theme.colors.primary }}
              >
                <IoPersonOutline className="w-3 h-3" />
                Manager
              </div>
              <div
                className="font-semibold"
                style={{ color: theme.colors.primary }}
              >
                {warehouse.assignedManagerId
                  ? warehouse.assignedManager?.name
                  : "Not assigned"}
              </div>
            </div>
            <div>
              <div
                className="text-xs opacity-60 mb-1 flex items-center gap-1"
                style={{ color: theme.colors.primary }}
              >
                <IoPeopleOutline className="w-3 h-3" />
                Employees ({employeeCount})
              </div>
              <div
                className="font-semibold"
                style={{ color: theme.colors.primary }}
              >
                {warehouse.assignedEmployees &&
                warehouse.assignedEmployees.length > 0 ? (
                  <div className="space-y-1">
                    {warehouse.assignedEmployees.map((emp: User) => (
                      <div
                        key={emp.id}
                        className="text-xs p-2 rounded"
                        style={{
                          background: theme.colors.accent + "30",
                          color: theme.colors.primary,
                        }}
                      >
                        <div className="font-semibold">{emp.name}</div>
                        {emp.areaOfResponsibility && (
                          <div className="opacity-60 text-[11px]">
                            {emp.areaOfResponsibility}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  "No employees assigned"
                )}
              </div>
            </div>
          </div>
        )}

        {/* Inventory Accordion */}
        <button
          onClick={() => setShowInventory(!showInventory)}
          className="w-full px-4 py-3 flex items-center justify-between transition-colors hover:bg-opacity-50"
          style={{
            borderTop: `1px solid ${theme.colors.accent}40`,
            backgroundColor: showInventory
              ? theme.colors.accent + "15"
              : "transparent",
            color: theme.colors.primary,
          }}
        >
          <div className="flex items-center gap-2">
            <IoStorefrontOutline className="w-4 h-4" />
            <span className="font-semibold text-sm">
              Inventory Summary ({lotCount} lots)
            </span>
          </div>
          <IoChevronDown
            className="w-4 h-4 transition-transform"
            style={{
              transform: showInventory ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
        {showInventory && (
          <div
            className="px-4 pb-3 text-xs"
            style={{ backgroundColor: theme.colors.background + "50" }}
          >
            {warehouse.lots && warehouse.lots.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {warehouse.lots.map((lot: Lot) => (
                  <div
                    key={lot.id}
                    className="flex justify-between items-center p-2 rounded"
                    style={{
                      background: theme.colors.surface,
                      border: `1px solid ${theme.colors.accent}40`,
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        className="font-semibold"
                        style={{ color: theme.colors.primary }}
                      >
                        {lot.lotNo}
                    </div>
                      <div
                        className="opacity-60 text-[11px]"
                        style={{ color: theme.colors.primary }}
                      >
                        {lot.size}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-bold"
                        style={{ color: theme.colors.success }}
                      >
                        {lot.quantity}
                      </div>
                      {lot.quantityOnHold > 0 && (
                        <div
                          className="text-[11px]"
                          style={{ color: theme.colors.warning }}
                        >
                          {lot.quantityOnHold} on hold
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-3 opacity-60"
                style={{ color: theme.colors.primary }}
              >
                No lots stored
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
