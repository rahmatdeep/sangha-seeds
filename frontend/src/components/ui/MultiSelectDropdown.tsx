import { useState, useRef, useEffect } from "react";
import { theme } from "../../theme";
import { IoChevronDown, IoSearch } from "react-icons/io5";

interface MultiSelectOption {
  id: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
}

export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  searchable = false,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, searchable]);

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const getDisplayText = () => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) {
      const option = options.find((o) => o.id === selected[0]);
      return option?.label || placeholder;
    }
    return `${selected.length} selected`;
  };

  // Filter options based on search query
  const filteredOptions = searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

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
            color:
              selected.length === 0
                ? theme.colors.primary + "80"
                : theme.colors.primary,
            paddingRight: "2.5rem",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            borderWidth: isHovered && !disabled ? "1.5px" : "1px",
          }}
        >
          <span className="truncate">{getDisplayText()}</span>
        </button>
        <div
          className="absolute right-3 inset-y-0 flex items-center pointer-events-none transition-transform duration-200"
          style={{
            color: theme.colors.primary,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <IoChevronDown className="w-4 h-4" />
        </div>

        {isOpen && !disabled && (
          <div
            className="absolute z-50 w-full mt-1 rounded border shadow-lg max-h-60 overflow-hidden flex flex-col"
            style={{
              background: theme.colors.surface,
              borderColor: theme.colors.accent,
              borderRadius: theme.borderRadius.md,
            }}
          >
            {/* Search Input */}
            {searchable && (
              <div
                className="p-2 border-b sticky top-0"
                style={{
                  background: theme.colors.surface,
                  borderColor: theme.colors.accent,
                }}
              >
                <div className="relative">
                  <IoSearch
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: theme.colors.primary, opacity: 0.5 }}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-8 pr-3 py-1.5 text-sm rounded border focus:outline-none focus:ring-1"
                    style={{
                      borderColor: theme.colors.accent,
                      background: theme.colors.background,
                      color: theme.colors.primary,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="overflow-y-auto flex-1">
              {filteredOptions.length === 0 ? (
                <div
                  className="px-3 py-2 text-sm opacity-60"
                  style={{ color: theme.colors.primary }}
                >
                  {searchQuery ? "No results found" : "No options available"}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-all duration-150"
                    style={{
                      backgroundColor: selected.includes(option.id)
                        ? theme.colors.accent + "60"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected.includes(option.id)) {
                        e.currentTarget.style.backgroundColor =
                          theme.colors.accent + "30";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected.includes(option.id)) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option.id)}
                      onChange={() => toggleOption(option.id)}
                      className="w-4 h-4 rounded cursor-pointer"
                      style={{
                        accentColor: theme.colors.secondary,
                      }}
                    />
                    <span
                      className="text-sm flex-1"
                      style={{
                        color: theme.colors.primary,
                        fontSize: "0.875rem",
                        lineHeight: "1.25rem",
                      }}
                    >
                      {option.label}
                    </span>
                  </label>
                ))
              )}
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
      {/* Hidden input for form validation */}
      {required && (
        <input
          type="text"
          value={selected.length > 0 ? "valid" : ""}
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
