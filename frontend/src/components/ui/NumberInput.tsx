import React from "react";
import { theme } from "../../theme";

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function NumberInput({
  label,
  error,
  helperText,
  className = "",
  required,
  ...props
}: NumberInputProps) {
  return (
    <label className="flex flex-col gap-1">
      {label && (
        <span
          className="text-sm font-semibold"
          style={{ color: theme.colors.primary }}
        >
          {label}
          {required && <span style={{ color: theme.colors.error }}> *</span>}
        </span>
      )}
      <input
        type="number"
        required={required}
        className={`w-full px-3 py-2 text-sm rounded border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed hover:border-opacity-80 ${className}`}
        style={{
          borderColor: error ? theme.colors.error : theme.colors.accent,
          borderRadius: theme.borderRadius.md,
          background: theme.colors.surface,
          color: theme.colors.primary,
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        }}
        {...props}
      />
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
