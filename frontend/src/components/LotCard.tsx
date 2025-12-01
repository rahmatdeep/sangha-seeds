import type { Lot, Variety, Warehouse } from "../types";
import { theme } from "../theme";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function LotCard({
  lot,
  variety,
  warehouse,
}: {
  lot: Lot;
  variety?: Variety;
  warehouse?: Warehouse;
}) {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
                Lot #{lot.lotNo}
              </span>
            </div>
            <span
              className="text-xs font-mono opacity-50 block"
              style={{ color: theme.colors.primary }}
            >
              ID: {lot.id}
            </span>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize flex items-center gap-1.5 shrink-0"
            style={{
              background: theme.colors.accent + "20",
              color: theme.colors.secondary,
              border: `1px solid ${theme.colors.accent}40`,
            }}
          >
            {variety?.name || variety?.id || lot.varietyId}
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
              {lot.quantity}
            </div>
          </div>
          <div>
            <div
              className="text-xs opacity-60 mb-0.5"
              style={{ color: theme.colors.primary }}
            >
              Quantity on Hold
            </div>
            <div
              className="font-semibold text-sm"
              style={{ color: theme.colors.primary }}
            >
              {lot.quantityOnHold}
            </div>
          </div>
          <div>
            <div
              className="text-xs opacity-60 mb-0.5"
              style={{ color: theme.colors.primary }}
            >
              Size
            </div>
            <div
              className="font-semibold text-sm truncate"
              style={{ color: theme.colors.primary }}
            >
              {lot?.size}
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
              {warehouse?.name || lot.warehouseId}
            </div>
          </div>
          <div>
            <div
              className="text-xs opacity-60 mb-0.5"
              style={{ color: theme.colors.primary }}
            >
              Storage Date
            </div>
            <div
              className="font-semibold text-sm"
              style={{ color: theme.colors.primary }}
            >
              {formatDate(lot.storageDate)}
            </div>
          </div>
          <div>
            <div
              className="text-xs opacity-60 mb-0.5"
              style={{ color: theme.colors.primary }}
            >
              Expiry Date
            </div>
            <div
              className="font-semibold text-sm"
              style={{ color: theme.colors.primary }}
            >
              {formatDate(lot.expiryDate)}
            </div>
          </div>
        </div>

        {/* Remarks - If exists */}
        {lot.remarks && (
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
                  {lot.remarks}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
