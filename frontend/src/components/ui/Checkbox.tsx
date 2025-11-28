import { theme } from "../../theme";
import { IoCheckmark } from "react-icons/io5";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  id?: string;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  helperText,
  id,
}: CheckboxProps) {
  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={checkboxId}
        className="flex items-center gap-2 cursor-pointer group"
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {/* Custom Checkbox */}
        <div className="relative">
          <input
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={(e) => !disabled && onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
            style={{
              borderColor: error
                ? theme.colors.error
                : checked
                ? theme.colors.secondary
                : theme.colors.accent,
              background: checked
                ? theme.colors.secondary
                : theme.colors.surface,
              transform: checked ? "scale(1)" : "scale(1)",
            }}
          >
            {checked && (
              <IoCheckmark
                className="w-4 h-4 transition-all duration-200"
                style={{
                  color: theme.colors.surface,
                  animation: "checkmarkPop 0.3s ease-out",
                }}
              />
            )}
          </div>
        </div>

        {/* Label */}
        {label && (
          <span
            className="text-sm font-semibold select-none transition-colors duration-200"
            style={{
              color: checked ? theme.colors.primary : theme.colors.primary,
              opacity: checked ? 1 : 0.8,
            }}
          >
            {label}
          </span>
        )}
      </label>

      {/* Error Message */}
      {error && (
        <span className="text-xs ml-7" style={{ color: theme.colors.error }}>
          {error}
        </span>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <span
          className="text-xs opacity-70 ml-7"
          style={{ color: theme.colors.primary }}
        >
          {helperText}
        </span>
      )}

      {/* Checkmark Animation */}
      <style>{`
        @keyframes checkmarkPop {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
