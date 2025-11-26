import { useState } from "react";
import type { MyOrdersResponseOrder } from "../types";
import { theme } from "../theme";
import { acknowledgeOrder, completeOrder } from "../api";
import {
  IoChevronDown,
  IoTimeOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoEllipseOutline,
} from "react-icons/io5";
import { useToast } from "../hooks/toastContext";

export default function OrderCard({
  order,
  token,
  onStatusChange,
}: {
  order: MyOrdersResponseOrder;
  token: string;
  onStatusChange?: () => void;
}) {
  const { showSuccess, showError } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  const [showTimeline, setShowTimeline] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is assigned as employee or manager
  const isAssignedEmployee = order.assignedEmployees?.some(
    (emp) => emp.id === userId
  );
  const isAssignedManager = order.assignedManager?.id === userId;
  const canAcknowledgeOrComplete = isAssignedEmployee || isAssignedManager;

  const handleAcknowledge = async () => {
    setLoading(true);
    try {
      await acknowledgeOrder(order.id, token);
      showSuccess("Order acknowledged successfully!");
      if (onStatusChange) onStatusChange();
    } catch {
      showError("Failed to acknowledge order");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeOrder(order.id, token);
      showSuccess("Order completed successfully!");
      if (onStatusChange) onStatusChange();
    } catch {
      showError("Failed to complete order");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const getStatusIcon = () => {
    switch (order.status) {
      case "completed":
        return <IoCheckmarkCircle className="w-4 h-4" />;
      case "acknowledged":
        return <IoEllipseOutline className="w-4 h-4" />;
      default:
        return <IoEllipseOutline className="w-4 h-4" />;
    }
  };

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
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-bold text-lg tracking-wide"
                style={{ color: theme.colors.primary }}
              >
                Lot #{order.lot?.lotNo || order.lotId}
              </span>
            </div>
            <span
              className="text-xs font-mono opacity-50 block"
              style={{ color: theme.colors.primary }}
            >
              ID: {order.id}
            </span>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize flex items-center gap-1.5 shrink-0"
            style={{
              background:
                order.status === "completed"
                  ? theme.colors.success + "20"
                  : order.status === "acknowledged"
                  ? theme.colors.secondary + "20"
                  : theme.colors.warning + "20",
              color:
                order.status === "completed"
                  ? theme.colors.success
                  : order.status === "acknowledged"
                  ? theme.colors.secondary
                  : theme.colors.warning,
              border: `1px solid ${
                order.status === "completed"
                  ? theme.colors.success
                  : order.status === "acknowledged"
                  ? theme.colors.secondary
                  : theme.colors.warning
              }40`,
            }}
          >
            {getStatusIcon()}
            {order.status}
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div>
            <div
              className="text-xs opacity-60 mb-0.5"
              style={{ color: theme.colors.primary }}
            >
              Quantity
            </div>
            <div
              className="font-bold text-base"
              style={{ color: theme.colors.primary }}
            >
              {order.quantity}
            </div>
          </div>
          <div>
            <div
              className="text-xs opacity-60 mb-0.5"
              style={{ color: theme.colors.primary }}
            >
              Warehouse
            </div>
            <div
              className="font-semibold text-sm truncate"
              style={{ color: theme.colors.primary }}
            >
              {order.warehouse?.name || "N/A"}
            </div>
          </div>
          {order.destination && (
            <div className="col-span-2">
              <div
                className="text-xs opacity-60 mb-0.5"
                style={{ color: theme.colors.primary }}
              >
                Destination
              </div>
              <div
                className="font-semibold text-sm"
                style={{ color: theme.colors.primary }}
              >
                {order.destination}
              </div>
            </div>
          )}
        </div>

        {/* Remarks - If exists */}
        {order.remarks && (
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
                  {order.remarks}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {canAcknowledgeOrComplete &&
          (order.status === "placed" || order.status === "acknowledged") && (
            <div className="mb-3">
              {order.status === "placed" && (
                <button
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: theme.colors.secondary,
                    color: theme.colors.surface,
                  }}
                  onClick={handleAcknowledge}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Mark as Acknowledged"}
                </button>
              )}
              {order.status === "acknowledged" && (
                <button
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: theme.colors.success,
                    color: theme.colors.surface,
                  }}
                  onClick={handleComplete}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Mark as Completed"}
                </button>
              )}
            </div>
          )}
      </div>

      {/* Accordion Sections */}
      <div style={{ borderTop: `1px solid ${theme.colors.accent}40` }}>
        {/* Timeline Accordion */}
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full px-4 py-3 flex items-center justify-between transition-colors hover:bg-opacity-50"
          style={{
            backgroundColor: showTimeline
              ? theme.colors.accent + "15"
              : "transparent",
            color: theme.colors.primary,
          }}
        >
          <div className="flex items-center gap-2">
            <IoTimeOutline className="w-4 h-4" />
            <span className="font-semibold text-sm">Timeline</span>
          </div>
          <IoChevronDown
            className="w-4 h-4 transition-transform"
            style={{
              transform: showTimeline ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
        {showTimeline && (
          <div
            className="px-4 pb-3 space-y-2 text-xs"
            style={{ backgroundColor: theme.colors.background + "50" }}
          >
            <div className="flex justify-between items-start gap-2">
              <span
                className="opacity-60"
                style={{ color: theme.colors.primary }}
              >
                Created
              </span>
              <span
                className="font-semibold text-right"
                style={{ color: theme.colors.info }}
              >
                {formatDateTime(order.createdAt)}
                <br />
                <span className="opacity-70">by {order.createdBy.name}</span>
              </span>
            </div>

            {order.acknowledgedAt && (
              <div className="flex justify-between items-start gap-2">
                <span
                  className="opacity-60"
                  style={{ color: theme.colors.primary }}
                >
                  Acknowledged
                </span>
                <span
                  className="font-semibold text-right"
                  style={{ color: theme.colors.secondary }}
                >
                  {formatDateTime(order.acknowledgedAt)}
                  {order.acknowledgedBy && (
                    <>
                      <br />
                      <span className="opacity-70">
                        by {order.acknowledgedBy.name}
                      </span>
                    </>
                  )}
                </span>
              </div>
            )}

            {order.completedAt && (
              <div className="flex justify-between items-start gap-2">
                <span
                  className="opacity-60"
                  style={{ color: theme.colors.primary }}
                >
                  Completed
                </span>
                <span
                  className="font-semibold text-right"
                  style={{ color: theme.colors.success }}
                >
                  {formatDateTime(order.completedAt)}
                  {order.completedBy && (
                    <>
                      <br />
                      <span className="opacity-70">
                        by {order.completedBy.name}
                      </span>
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Assignments Accordion */}
        <button
          onClick={() => setShowAssignments(!showAssignments)}
          className="w-full px-4 py-3 flex items-center justify-between transition-colors hover:bg-opacity-50"
          style={{
            borderTop: `1px solid ${theme.colors.accent}40`,
            backgroundColor: showAssignments
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
              transform: showAssignments ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
        {showAssignments && (
          <div
            className="px-4 pb-3 space-y-2 text-sm"
            style={{ backgroundColor: theme.colors.background + "50" }}
          >
            <div>
              <div
                className="text-xs opacity-60 mb-1"
                style={{ color: theme.colors.primary }}
              >
                Manager
              </div>
              <div
                className="font-semibold"
                style={{ color: theme.colors.primary }}
              >
                {order.assignedManager?.name || "Not assigned"}
              </div>
            </div>
            <div>
              <div
                className="text-xs opacity-60 mb-1"
                style={{ color: theme.colors.primary }}
              >
                Employees
              </div>
              <div
                className="font-semibold"
                style={{ color: theme.colors.primary }}
              >
                {order.assignedEmployees && order.assignedEmployees.length > 0
                  ? order.assignedEmployees.map((emp) => emp.name).join(", ")
                  : "Not assigned"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
