import { useState, useEffect } from "react";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import { theme } from "../theme";
import { fetchUsersForTab } from "../api";
import type { UserRole, User } from "../types";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await fetchUsersForTab(activeTab);
        setUsers(data);
      } catch {
        setUsers([]);
      }
      setLoading(false);
    }
    if (activeTab && visibleTabs.length) loadUsers();
  }, [activeTab, visibleTabs.length]);

  if (!visibleTabs.length) return null; // Employees shouldn't see this page

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
          {role === "Administrator" && (
            <button
              className="px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
              }}
              onClick={() => navigate("/users/create")}
            >
              <FaUserPlus />
              <span>Create User</span>
            </button>
          )}
        </div>

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
                className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium sm:px-4 sm:text-sm transition"
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

        {/* Users list */}
        {!loading && users.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {users.map((u) => (
              <article
                key={u.id}
                className="flex items-center gap-3 rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.accent,
                }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold sm:h-12 sm:w-12 sm:text-lg"
                  style={{
                    background: theme.colors.accent,
                    color: theme.colors.primary,
                  }}
                >
                  {u.name?.[0]?.toUpperCase() ?? "U"}
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className="truncate text-sm font-semibold sm:text-base"
                    style={{ color: theme.colors.primary }}
                  >
                    {u.name}
                  </div>
                  <div className="truncate text-xs text-gray-600 sm:text-sm">
                    {u.email}
                  </div>

                  {/* Only show warehouse if present */}
                  {u.warehouseid && (
                    <div className="mt-1 text-[11px] text-gray-600 sm:text-xs">
                      Warehouse: {u.warehouseid}
                    </div>
                  )}

                  {/* Read-only badge */}
                  {u.role === "ReadOnlyManager" && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide sm:text-[11px]"
                      style={{
                        backgroundColor: "transparent",
                        color: theme.colors.secondary,
                        border: `1px dashed ${theme.colors.secondary}`,
                      }}
                    >
                      Read only permissions
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
