import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import {
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaUserShield,
  FaMapMarkerAlt,
  FaStickyNote,
  FaSignOutAlt,
} from "react-icons/fa";
import type { WarehouseResponse, User } from "../types";
import { useEffect, useState } from "react";
import { fetchWarehouses } from "../api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [warehouse, setWarehouse] = useState<WarehouseResponse | null>(null);

  useEffect(() => {
    if (user.warehouseid) {
      fetchWarehouses({ id: user.warehouseid }).then((ws) => {
        setWarehouse(ws[0]);
      });
    }
  }, [user.warehouseid]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="px-4 py-6 sm:py-12"
      style={{ background: theme.colors.background }}
    >
      <div className="max-w-md mx-auto">
        {/* Header Card with Avatar */}
        <div
          className="rounded-2xl shadow-lg p-6 mb-4 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          style={{ background: theme.colors.surface }}
        >
          <div className="flex flex-col items-center">
            {/* Animated Avatar */}
            <div className="relative group">
              <div
                className="absolute inset-0 rounded-full opacity-0"
                style={{ background: theme.colors.secondary }}
              />
              <FaUserCircle
                className="relative transform transition-all duration-300"
                style={{ fontSize: "5rem", color: theme.colors.secondary }}
              />
            </div>

            {/* User Name */}
            <h2
              className="text-2xl sm:text-3xl font-bold mt-4 mb-1 text-center animate-fade-in"
              style={{ color: theme.colors.primary }}
            >
              {user.name}
            </h2>

            {/* Role Badge */}
            <span
              className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mt-2 transform transition-all duration-200 hover:scale-105"
              style={{
                background: theme.colors.secondary,
                color: theme.colors.surface,
              }}
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* Contact Information Card */}
        <div
          className="rounded-2xl shadow-lg p-5 mb-4 transform transition-all duration-300 hover:shadow-xl"
          style={{ background: theme.colors.surface }}
        >
          <h3
            className="text-sm font-semibold uppercase tracking-wide mb-4 opacity-70"
            style={{ color: theme.colors.primary }}
          >
            Contact Information
          </h3>

          <div className="space-y-3">
            {/* Email */}
            <div
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:translate-x-1"
              style={{
                background: theme.colors.background,
                border: `1px solid ${theme.colors.accent}`,
              }}
            >
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ background: theme.colors.surface }}
              >
                <FaEnvelope
                  style={{ color: theme.colors.secondary, fontSize: "1rem" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-xs opacity-60 mb-0.5"
                  style={{ color: theme.colors.primary }}
                >
                  Email
                </p>
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: theme.colors.primary }}
                >
                  {user.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:translate-x-1"
              style={{
                background: theme.colors.background,
                border: `1px solid ${theme.colors.accent}`,
              }}
            >
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ background: theme.colors.surface }}
              >
                <FaPhone
                  style={{ color: theme.colors.info, fontSize: "1rem" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-xs opacity-60 mb-0.5"
                  style={{ color: theme.colors.primary }}
                >
                  Mobile
                </p>
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: theme.colors.primary }}
                >
                  {user.mobile}
                </p>
              </div>
            </div>

            {/* Role */}
            <div
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:translate-x-1"
              style={{
                background: theme.colors.background,
                border: `1px solid ${theme.colors.accent}`,
              }}
            >
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ background: theme.colors.surface }}
              >
                <FaUserShield
                  style={{ color: theme.colors.warning, fontSize: "1rem" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-xs opacity-60 mb-0.5"
                  style={{ color: theme.colors.primary }}
                >
                  Role
                </p>
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: theme.colors.primary }}
                >
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warehouse Info */}
        {warehouse && (
          <div
            className="rounded-2xl shadow-lg p-5 mb-4 transform transition-all duration-300 hover:shadow-xl"
            style={{ background: theme.colors.surface }}
          >
            <h3
              className="text-sm font-semibold uppercase tracking-wide mb-4 opacity-70"
              style={{ color: theme.colors.primary }}
            >
              Assigned Warehouse
            </h3>

            {/* Warehouse Name & Location */}
            <div
              className="flex items-center gap-3 p-3 rounded-lg mb-3"
              style={{
                background: theme.colors.background,
                border: `1px solid ${theme.colors.accent}`,
              }}
            >
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ background: theme.colors.surface }}
              >
                <FaMapMarkerAlt
                  style={{ color: theme.colors.info, fontSize: "1rem" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme.colors.primary }}
                >
                  {warehouse.name}
                </p>
                <p
                  className="text-xs opacity-70"
                  style={{ color: theme.colors.primary }}
                >
                  {warehouse.location}
                </p>
              </div>
            </div>

            {/* Manager */}
            {warehouse.assignedManager && (
              <div className="mb-3">
                <p
                  className="text-xs font-semibold uppercase opacity-60 mb-2"
                  style={{ color: theme.colors.primary }}
                >
                  Manager
                </p>
                <p
                  className="text-sm flex items-center gap-2"
                  style={{ color: theme.colors.primary }}
                >
                  <FaUserShield style={{ color: theme.colors.warning }} />
                  <span className="font-medium">
                    {warehouse.assignedManager.name}
                  </span>
                  <span className="text-xs opacity-70">
                    ({warehouse.assignedManager.mobile})
                  </span>
                </p>
              </div>
            )}

            {/* Employees */}
            {warehouse.assignedEmployees &&
              warehouse.assignedEmployees.filter(
                (emp: User) => emp.id !== user.id
              ).length > 0 && (
                <div>
                  <p
                    className="text-xs font-semibold uppercase opacity-60 mb-2"
                    style={{ color: theme.colors.primary }}
                  >
                    Other Employees
                  </p>
                  <ul className="space-y-1.5">
                    {warehouse.assignedEmployees
                      .filter((emp: User) => emp.id !== user.id)
                      .map((emp: User) => (
                        <li
                          key={emp.id}
                          className="text-sm flex items-center gap-2"
                          style={{ color: theme.colors.primary }}
                        >
                          <FaUserCircle
                            style={{
                              color: theme.colors.secondary,
                              fontSize: "0.9rem",
                            }}
                          />
                          <span className="font-medium">{emp.name}</span>
                          <span className="text-xs opacity-70">
                            ({emp.mobile})
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* Additional Details Card - Only show if exists */}
        {(user.areaOfResponsibility || user.remarks) && (
          <div
            className="rounded-2xl shadow-lg p-5 mb-4 transform transition-all duration-300 hover:shadow-xl"
            style={{ background: theme.colors.surface }}
          >
            <h3
              className="text-sm font-semibold uppercase tracking-wide mb-4 opacity-70"
              style={{ color: theme.colors.primary }}
            >
              Additional Details
            </h3>

            <div className="space-y-3">
              {user.areaOfResponsibility && (
                <div
                  className="flex items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:translate-x-1"
                  style={{
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.accent}`,
                  }}
                >
                  <div
                    className="p-2 rounded-lg shrink-0 mt-0.5"
                    style={{ background: theme.colors.surface }}
                  >
                    <FaMapMarkerAlt
                      style={{ color: theme.colors.success, fontSize: "1rem" }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-xs opacity-60 mb-0.5"
                      style={{ color: theme.colors.primary }}
                    >
                      Area of Responsibility
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.colors.primary }}
                    >
                      {user.areaOfResponsibility}
                    </p>
                  </div>
                </div>
              )}

              {user.remarks && (
                <div
                  className="flex items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:translate-x-1"
                  style={{
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.accent}`,
                  }}
                >
                  <div
                    className="p-2 rounded-lg shrink-0 mt-0.5"
                    style={{ background: theme.colors.surface }}
                  >
                    <FaStickyNote
                      style={{ color: theme.colors.warning, fontSize: "1rem" }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-xs opacity-60 mb-0.5"
                      style={{ color: theme.colors.primary }}
                    >
                      Remarks
                    </p>
                    <p
                      className="text-sm font-medium wrap-break-words"
                      style={{ color: theme.colors.primary }}
                    >
                      {user.remarks}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
          style={{
            background: theme.colors.error,
            borderRadius: theme.borderRadius.lg,
          }}
        >
          <FaSignOutAlt />
          <span>Log Out</span>
        </button>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6 opacity-50"
          style={{ color: theme.colors.primary }}
        >
          Member since{" "}
          {user.createdAt
            ? new Date(user.createdAt).getFullYear()
            : new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
