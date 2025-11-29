import { useState, useRef, useEffect } from "react";
import {
  IoChevronBack,
  IoChevronForward,
  IoCalendarOutline,
  IoClose,
} from "react-icons/io5";
import { theme } from "../../theme";

interface CalendarProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  error?: string;
  helperText?: string;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function isDateDisabled(
  year: number,
  month: number,
  day: number,
  min?: string,
  max?: string
): boolean {
  const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
  const date = new Date(dateStr);

  if (min) {
    const minDate = new Date(min);
    if (date < minDate) return true;
  }

  if (max) {
    const maxDate = new Date(max);
    if (date > maxDate) return true;
  }

  return false;
}

export default function Calendar({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  min,
  max,
  error,
  helperText,
}: CalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const d = new Date(value);
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();
  const today = new Date();
  const selected = selectedDate ? new Date(selectedDate) : null;

  const handleSelect = (day: number) => {
    if (isDateDisabled(viewDate.year, viewDate.month, day, min, max)) {
      return;
    }
    const dateStr = `${viewDate.year}-${pad(viewDate.month + 1)}-${pad(day)}`;
    setSelectedDate(dateStr);
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!required && !disabled) {
      setSelectedDate("");
      onChange("");
    }
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <label className="flex flex-col gap-1 relative">
      {label && (
        <span
          className="text-sm font-semibold"
          style={{ color: theme.colors.primary }}
        >
          {label}
          {required && <span style={{ color: theme.colors.error }}> *</span>}
        </span>
      )}
      <div ref={ref}>
        <button
          type="button"
          className={`w-full px-3 py-2 text-base rounded-lg border flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed group ${
            error ? "border-red-500" : ""
          }`}
          style={{
            borderColor: error ? theme.colors.error : theme.colors.accent,
            borderRadius: theme.borderRadius.lg,
            background: theme.colors.surface,
            color: selectedDate
              ? theme.colors.primary
              : theme.colors.primary + "80",
            fontWeight: 500,
          }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className="flex-1 text-left">
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : "Select date"}
          </span>
          <div className="flex items-center gap-1">
            {selectedDate && !required && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
                style={{
                  background: theme.colors.accent + "40",
                  color: theme.colors.primary,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    theme.colors.accent + "80";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    theme.colors.accent + "40";
                }}
                aria-label="Clear date"
              >
                <IoClose size={16} />
              </button>
            )}
            <IoCalendarOutline
              style={{ fontSize: "1.3em", color: theme.colors.primary }}
            />
          </div>
        </button>
        {isOpen && !disabled && (
          <div
            className="absolute left-0 right-0 mx-auto z-50 mt-2 w-full max-w-xs rounded-xl border shadow-lg p-4"
            style={{
              background: theme.colors.surface,
              borderColor: theme.colors.accent,
              borderRadius: theme.borderRadius.lg,
              minWidth: "260px",
              maxWidth: "320px",
            }}
          >
            {/* Month/Year Selector */}
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100"
                style={{
                  background: theme.colors.background,
                  color: theme.colors.primary,
                  fontWeight: 600,
                }}
                onClick={() =>
                  setViewDate((d) =>
                    d.month === 0
                      ? { year: d.year - 1, month: 11 }
                      : { year: d.year, month: d.month - 1 }
                  )
                }
              >
                <IoChevronBack />
              </button>
              <span
                className="font-semibold text-base"
                style={{ color: theme.colors.primary }}
              >
                {monthNames[viewDate.month]} {viewDate.year}
              </span>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100"
                style={{
                  background: theme.colors.background,
                  color: theme.colors.primary,
                  fontWeight: 600,
                }}
                onClick={() =>
                  setViewDate((d) =>
                    d.month === 11
                      ? { year: d.year + 1, month: 0 }
                      : { year: d.year, month: d.month + 1 }
                  )
                }
              >
                <IoChevronForward />
              </button>
            </div>
            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <span
                  key={d}
                  className="text-xs font-semibold text-center"
                  style={{ color: theme.colors.primary, opacity: 0.7 }}
                >
                  {d}
                </span>
              ))}
            </div>
            {/* Dates */}
            <div className="grid grid-cols-7 gap-1">
              {Array(firstDay)
                .fill(null)
                .map((_, i) => (
                  <span key={`empty-${i}`} />
                ))}
              {Array(daysInMonth)
                .fill(null)
                .map((_, i) => {
                  const day = i + 1;
                  const isToday =
                    today.getFullYear() === viewDate.year &&
                    today.getMonth() === viewDate.month &&
                    today.getDate() === day;
                  const isSelected =
                    selected &&
                    selected.getFullYear() === viewDate.year &&
                    selected.getMonth() === viewDate.month &&
                    selected.getDate() === day;
                  const isDisabled = isDateDisabled(
                    viewDate.year,
                    viewDate.month,
                    day,
                    min,
                    max
                  );

                  return (
                    <button
                      key={day}
                      type="button"
                      className="w-full aspect-square rounded-full text-sm font-medium transition-colors"
                      style={{
                        background: isSelected
                          ? theme.colors.secondary
                          : isToday
                          ? theme.colors.accent + "40"
                          : "transparent",
                        color: isDisabled
                          ? theme.colors.primary + "30"
                          : isSelected
                          ? theme.colors.surface
                          : theme.colors.primary,
                        border:
                          isToday && !isDisabled
                            ? `1px solid ${theme.colors.accent}`
                            : "none",
                        fontWeight: isSelected ? 700 : 500,
                        minWidth: "32px",
                        minHeight: "32px",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        opacity: isDisabled ? 0.4 : 1,
                      }}
                      onClick={() => handleSelect(day)}
                      onMouseEnter={(e) => {
                        if (!isSelected && !isDisabled) {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = theme.colors.accent + "20";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected && !isDisabled) {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "transparent";
                        }
                      }}
                      disabled={isDisabled}
                    >
                      {day}
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs" style={{ color: theme.colors.error }}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span
          className="text-xs opacity-70"
          style={{ color: theme.colors.primary }}
        >
          {helperText}
        </span>
      )}
    </label>
  );
}
