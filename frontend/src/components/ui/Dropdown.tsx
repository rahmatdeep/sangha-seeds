import { useState, useRef, useEffect } from "react";
import { theme } from "../../theme";
import { IoChevronDown } from "react-icons/io5";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: DropdownOption[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function Dropdown({
  label,
  error,
  helperText,
  options,
  placeholder = "Select an option",
  value,
  onChange,
  required = false,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  return (
    <div className="flex flex-col gap-1" ref={dropdownRef}>
      {label && (
        <span
          className="text-sm font-semibold"
          style={{ color: theme.colors.primary }}
        >
          {label}
          {required && <span style={{ color: theme.colors.error }}> *</span>}
        </span>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm rounded border text-left flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: error ? theme.colors.error : theme.colors.accent,
            borderRadius: theme.borderRadius.md,
            background: theme.colors.surface,
            color: value ? theme.colors.primary : theme.colors.primary + "80",
            paddingRight: "2.5rem",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            borderWidth: isHovered && !disabled ? "1.5px" : "1px",
          }}
        >
          <span className="truncate">{displayText}</span>
        </button>
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200"
          style={{
            color: theme.colors.primary,
            transform: `translateY(-50%) ${
              isOpen ? "rotate(180deg)" : "rotate(0deg)"
            }`,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <IoChevronDown className="w-4 h-4" />
        </div>

        {isOpen && !disabled && (
          <div
            className="absolute z-50 w-full mt-1 rounded border shadow-lg max-h-60 overflow-y-auto"
            style={{
              background: theme.colors.surface,
              borderColor: theme.colors.accent,
              borderRadius: theme.borderRadius.md,
            }}
          >
            {options.length === 0 ? (
              <div
                className="px-3 py-2 text-sm opacity-60"
                style={{ color: theme.colors.primary }}
              >
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="w-full text-left px-3 py-2 text-sm cursor-pointer transition-all duration-150"
                  style={{
                    backgroundColor:
                      value === option.value
                        ? theme.colors.accent + "60"
                        : "transparent",
                    color: theme.colors.primary,
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                  }}
                  onMouseEnter={(e) => {
                    if (value !== option.value) {
                      e.currentTarget.style.backgroundColor =
                        theme.colors.accent + "30";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option.value) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {option.label}
                </button>
              ))
            )}
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
      {/* Hidden input for form validation */}
      {required && (
        <input
          type="text"
          value={value}
          required
          onChange={() => {}}
          style={{
            position: "absolute",
            opacity: 0,
            height: 0,
            width: 0,
            pointerEvents: "none",
          }}
          tabIndex={-1}
        />
      )}
    </div>
  );
}
