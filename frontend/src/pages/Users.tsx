import { useState, useEffect } from "react";
import {
  FaUsers,
  FaFilter,
  FaEnvelope,
  FaPhone,
  FaWarehouse,
} from "react-icons/fa";
import { theme } from "../theme";
import { fetchUsersForTab, fetchWarehouses } from "../api";
import type { UserRole, User } from "../types";
import { useNavigate } from "react-router-dom";
import FilterModal from "../components/FilterModal";

type VisibleRoleTab = "Administrator" | "Managers" | "Employee";

const ROLE_TABS: VisibleRoleTab[] = ["Administrator", "Managers", "Employee"];

const ROLE_LABELS: Record<VisibleRoleTab, string> = {
  Administrator: "Administrators",
  Managers: "Managers",
  Employee: "Employees",
};

function getVisibleTabs(role: UserRole): VisibleRoleTab[] {
  switch (role) {
    case "Administrator":
      return ROLE_TABS;
    case "Manager":
    case "ReadOnlyManager":
      return ["Managers", "Employee"];
    default:
      return [];
  }
}

export default function Users() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role: UserRole = user.role;
  const navigate = useNavigate();

  const visibleTabs = getVisibleTabs(role);
  const [activeTab, setActiveTab] = useState<VisibleRoleTab>(
    visibleTabs[0] ?? "Managers"
  );
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    async function loadWarehouses() {
      try {
        const data = await fetchWarehouses();
        setWarehouses(data);
      } catch {
        setWarehouses([]);
      }
    }
    loadWarehouses();
  }, []);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await fetchUsersForTab(activeTab, filters);
        setUsers(data);
      } catch {
        setUsers([]);
      }
      setLoading(false);
    }
    if (activeTab && visibleTabs.length) loadUsers();
  }, [activeTab, visibleTabs.length, filters]);

  if (!visibleTabs.length) return null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaUsers
              className="text-2xl"
              style={{ color: theme.colors.secondary }}
            />
            <h2
              className="text-2xl font-bold"
              style={{ color: theme.colors.primary }}
            >
              Users
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="relative px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all hover:opacity-90"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.primary,
                borderRadius: theme.borderRadius.lg,
              }}
              onClick={() => setShowFilter(true)}
            >
              <FaFilter />
              <span className="hidden sm:inline">Filter</span>
              {Object.keys(filters).length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{
                    background: theme.colors.warning,
                    color: theme.colors.surface,
                  }}
                >
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
            {role === "Administrator" && (
              <button
                className="px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.surface,
                  borderRadius: theme.borderRadius.lg,
                }}
                onClick={() => navigate("/users/create")}
              >
                <span className="text-lg font-bold" style={{ lineHeight: 1 }}>
                  +
                </span>
                <span>Create User</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Modal */}
        {showFilter && (
          <FilterModal
            filters={filters}
            setFilters={setFilters}
            onClose={() => setShowFilter(false)}
            warehouses={warehouses}
            role={role}
            type="users"
          />
        )}

        {/* Tabs */}
        <div
          className="mb-4 flex gap-2 overflow-x-auto whitespace-nowrap pb-2 sm:mb-6"
          style={{ borderBottom: `1px solid ${theme.colors.accent}` }}
        >
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium sm:px-4 sm:text-sm transition-all"
                style={{
                  backgroundColor: isActive
                    ? theme.colors.secondary
                    : "transparent",
                  color: isActive ? theme.colors.surface : theme.colors.primary,
                  boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  border: isActive
                    ? "none"
                    : `1px solid ${theme.colors.accent}`,
                }}
                onClick={() => setActiveTab(tab)}
              >
                {ROLE_LABELS[tab]}
              </button>
            );
          })}
        </div>

        {/* State messages */}
        {loading && (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.primary,
            }}
          >
            Loading users…
          </div>
        )}

        {!loading && users.length === 0 && (
          <div
            className="rounded-lg px-4 py-6 text-center text-sm"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.primary,
            }}
          >
            No users found for this role.
          </div>
        )}

        {/* Users list - Enhanced Design */}
        {!loading && users.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {users.map((u) => (
              <article
                key={u.id}
                className="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-sm cursor-pointer"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.accent,
                }}
              >
                <div className="relative p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold transition-all duration-300  sm:h-16 sm:w-16 sm:text-xl"
                      style={{
                        background: theme.colors.secondary,
                        color: theme.colors.surface,
                        boxShadow: `0 4px 12px ${theme.colors.accent}40`,
                      }}
                    >
                      {u.name?.[0]?.toUpperCase() ?? "U"}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {/* Name and badge row */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3
                          className="truncate text-base font-bold sm:text-lg"
                          style={{ color: theme.colors.primary }}
                        >
                          {u.name}
                        </h3>

                        {/* Read-only badge */}
                        {u.role === "ReadOnlyManager" && (
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                            style={{
                              backgroundColor: `${theme.colors.secondary}15`,
                              color: theme.colors.secondary,
                              border: `1px solid ${theme.colors.secondary}40`,
                            }}
                          >
                            Read-only
                          </span>
                        )}
                      </div>

                      {/* Contact info with icons */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs sm:text-sm group/email">
                          <FaEnvelope
                            className="shrink-0 text-xs transition-colors"
                            style={{ color: theme.colors.accent }}
                          />
                          <span
                            className="truncate transition-colors"
                            style={{ color: theme.colors.primary }}
                          >
                            {u.email}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <FaPhone
                            className="shrink-0 text-xs transition-colors"
                            style={{ color: theme.colors.accent }}
                          />
                          <span
                            className="truncate"
                            style={{ color: theme.colors.primary }}
                          >
                            {u.mobile}
                          </span>
                        </div>

                        {/* Warehouse info */}
                        {u.warehouseid && (
                          <div
                            className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs"
                            style={{
                              backgroundColor: `${theme.colors.accent}60`,
                              color: theme.colors.primary,
                            }}
                          >
                            <FaWarehouse />
                            <span className="font-medium">
                              Warehouse: {u.warehouseid}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
