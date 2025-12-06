// GlobalSearch.tsx
import { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaTimes,
  FaUser,
  FaWarehouse,
  FaBox,
  FaClipboardList,
  FaSeedling,
} from "react-icons/fa";
import { theme } from "../theme";
import { globalSearch } from "../api";
import type {
  GlobalSearchQuery,
  Lot,
  Order,
  User,
  Variety,
  Warehouse,
} from "../types";

interface SearchResults {
  users?: User[];
  warehouses?: Warehouse[];
  lots?: Lot[];
  orders?: Order[];
  varieties?: Variety[];
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const filterOptions = [
  { key: "all", label: "All", icon: FaSearch },
  { key: "users", label: "Users", icon: FaUser },
  { key: "warehouses", label: "Warehouses", icon: FaWarehouse },
  { key: "lots", label: "Lots", icon: FaBox },
  { key: "orders", label: "Orders", icon: FaClipboardList },
  { key: "varieties", label: "Varieties", icon: FaSeedling },
];

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [results, setResults] = useState<SearchResults>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({});
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const query: GlobalSearchQuery = {
        q: searchQuery,
        type: activeFilter as GlobalSearchQuery["type"],
        limit: "5",
      };
      await globalSearch(query);
      try {
        const results = await globalSearch(query);
        setResults(results || {});
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter]);

  // Focus input when modal opens and clear search
  useEffect(() => {
    if (isOpen) {
      clearSearch();
    }
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getSectionStartIndex = (section: keyof SearchResults) => {
    const order: (keyof SearchResults)[] = [
      "users",
      "warehouses",
      "lots",
      "orders",
      "varieties",
    ];
    let idx = 0;
    for (const key of order) {
      if (key === section) break;
      idx += results[key]?.length || 0;
    }
    return idx;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          // This would be triggered from parent component
        }
      }

      if (!isOpen) return;

      // Escape to close
      if (e.key === "Escape") {
        onClose();
      }

      // Arrow navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, getTotalResults() - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }

      // Enter to navigate
      if (e.key === "Enter") {
        e.preventDefault();
        handleSelectResult();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex]);

  const getTotalResults = () => {
    return Object.values(results).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0
    );
  };

  const handleSelectResult = () => {
    // Implement navigation logic based on selected result
    // You'll need to track which item is at selectedIndex
    console.log("Navigate to result at index:", selectedIndex);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults({});
    setSelectedIndex(0);
    setActiveFilter("all");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      style={{ background: `${theme.colors.primary}66` }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-scale-in"
        style={{ background: theme.colors.surface }}
      >
        {/* Search Input Section */}
        <div
          className="p-4 border-b"
          style={{ borderColor: theme.colors.accent }}
        >
          <div className="flex items-center gap-3">
            <FaSearch style={{ color: theme.colors.primary }} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, warehouses, lots, orders, varieties..."
              className="flex-1 outline-none text-base"
              style={{
                background: "transparent",
                color: theme.colors.primary,
              }}
            />
            {searchQuery && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full transition-all hover:scale-110"
                style={{ background: theme.colors.accent }}
              >
                <FaTimes
                  style={{ color: theme.colors.primary }}
                  className="text-sm"
                />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 hover:scale-105"
                  style={{
                    background: isActive
                      ? theme.colors.secondary
                      : theme.colors.accent,
                    color: isActive
                      ? theme.colors.surface
                      : theme.colors.primary,
                  }}
                >
                  <Icon className="text-xs" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Section */}
        <div
          className="max-h-96 overflow-y-auto"
          style={{ background: theme.colors.background }}
        >
          {isLoading && (
            <div
              className="p-8 text-center"
              style={{ color: theme.colors.primary }}
            >
              Searching...
            </div>
          )}

          {!isLoading && searchQuery && getTotalResults() === 0 && (
            <div
              className="p-8 text-center"
              style={{ color: theme.colors.primary }}
            >
              No results found for "{searchQuery}"
            </div>
          )}

          {!isLoading && !searchQuery && (
            <div
              className="p-8 text-center"
              style={{ color: theme.colors.primary }}
            >
              <p className="text-sm">Type to search across your data</p>
              <p
                className="text-xs mt-2"
                style={{ color: `${theme.colors.primary}80` }}
              >
                Press{" "}
                <kbd
                  className="px-2 py-1 rounded"
                  style={{ background: theme.colors.accent }}
                >
                  Esc
                </kbd>{" "}
                to close
              </p>
            </div>
          )}

          {/* Users Results */}
          {results.users && results.users.length > 0 && (
            <ResultSection<User>
              title="Users"
              icon={FaUser}
              items={results.users}
              renderItem={(user) => (
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div
                    className="text-sm"
                    style={{ color: `${theme.colors.primary}80` }}
                  >
                    {user.email} • {user.role}
                  </div>
                </div>
              )}
              selectedIndex={selectedIndex}
              startIndex={getSectionStartIndex("users")}
            />
          )}

          {/* Warehouses Results */}
          {results.warehouses && results.warehouses.length > 0 && (
            <ResultSection<Warehouse>
              title="Warehouses"
              icon={FaWarehouse}
              items={results.warehouses}
              renderItem={(warehouse) => (
                <div>
                  <div className="font-medium">{warehouse.name}</div>
                  <div
                    className="text-sm"
                    style={{ color: `${theme.colors.primary}80` }}
                  >
                    {warehouse.location}
                  </div>
                </div>
              )}
              selectedIndex={selectedIndex}
              startIndex={getSectionStartIndex("warehouses")}
            />
          )}

          {/* Lots Results */}
          {results.lots && results.lots.length > 0 && (
            <ResultSection<Lot>
              title="Lots"
              icon={FaBox}
              items={results.lots}
              renderItem={(lot) => (
                <div>
                  <div className="font-medium">#{lot.lotNo}</div>
                  <div
                    className="text-sm"
                    style={{ color: `${theme.colors.primary}80` }}
                  >
                    Quantity: {lot.quantity} • Size: {lot.size}
                  </div>
                </div>
              )}
              selectedIndex={selectedIndex}
              startIndex={getSectionStartIndex("lots")}
            />
          )}

          {/* Orders Results */}
          {results.orders && results.orders.length > 0 && (
            <ResultSection<Order>
              title="Orders"
              icon={FaClipboardList}
              items={results.orders}
              renderItem={(order) => (
                <div>
                  <div className="font-medium">
                    Order #{order.id.slice(0, 8)}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: `${theme.colors.primary}80` }}
                  >
                    {order.destination || "No destination"} • {order.status}
                  </div>
                </div>
              )}
              selectedIndex={selectedIndex}
              startIndex={getSectionStartIndex("orders")}
            />
          )}

          {/* Varieties Results */}
          {results.varieties && results.varieties.length > 0 && (
            <ResultSection<Variety>
              title="Varieties"
              icon={FaSeedling}
              items={results.varieties}
              renderItem={(variety) => (
                <div>
                  <div className="font-medium">{variety.name}</div>
                </div>
              )}
              selectedIndex={selectedIndex}
              startIndex={getSectionStartIndex("varieties")}
            />
          )}
        </div>
      </div>
      <style>
        {`@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}
`}
      </style>
    </div>
  );
}

// Helper component for result sections
interface ResultSectionProps<T> {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  selectedIndex: number;
  startIndex: number;
}

function ResultSection<T>({
  title,
  icon: Icon,
  items,
  renderItem,
  selectedIndex,
  startIndex,
}: ResultSectionProps<T>) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const localIndex = selectedIndex - startIndex;
    if (
      localIndex >= 0 &&
      localIndex < items.length &&
      itemRefs.current[localIndex]
    ) {
      itemRefs.current[localIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex, startIndex, items.length]);
  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-2 px-2">
        <Icon className="text-sm" style={{ color: theme.colors.secondary }} />
        <h3
          className="text-sm font-semibold"
          style={{ color: theme.colors.primary }}
        >
          {title}
        </h3>
        <span
          className="text-xs"
          style={{ color: `${theme.colors.primary}60` }}
        >
          ({items.length})
        </span>
      </div>
      <div className="space-y-1">
        {items.map((item, idx) => {
          const globalIdx = startIndex + idx;
          const isSelected = selectedIndex === globalIdx;
          return (
            <div
              key={(item as { id?: string | number }).id ?? idx}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                isSelected ? "ring-2 ring-secondary" : ""
              }`}
              style={{
                background: isSelected
                  ? theme.colors.accent
                  : theme.colors.surface,
                border: `1px solid ${theme.colors.accent}`,
                color: isSelected ? theme.colors.surface : theme.colors.primary,
              }}
              onClick={() => console.log("Navigate to:", item)}
            >
              {renderItem(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
