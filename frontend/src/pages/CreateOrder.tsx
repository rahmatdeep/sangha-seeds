import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { theme } from "../theme";
import axios from "axios";
import { assignEmployee, assignManager, createOrder } from "../api";
import type { Lot, Warehouse, User } from "../types";
import Input from "../components/ui/Input";
import NumberInput from "../components/ui/NumberInput";
import Dropdown from "../components/ui/Dropdown";
import MultiSelectDropdown from "../components/ui/MultiSelectDropdown";
import TextArea from "../components/ui/TextArea";
import { useToast } from "../hooks/toastContext";

interface FormErrors {
  lotId?: string;
  warehouseId?: string;
  quantity?: string;
  destination?: string;
  assignedEmployees?: string;
  assignedManager?: string;
  remarks?: string;
}

export default function CreateOrder() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const token = localStorage.getItem("token") || "";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  useEffect(() => {
    if (role !== "Administrator") navigate("/orders");
  }, [role, navigate]);

  const location = useLocation();
  const lots = location.state?.lots || [];
  const warehouses = location.state?.warehouses || [];
  const employees = location.state?.employees || [];
  const managers = location.state?.managers || [];
  const [lotId, setLotId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [destination, setDestination] = useState("");
  const [remarks, setRemarks] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState<string[]>([]);
  const [assignedManager, setAssignedManager] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!lotId) {
      errors.lotId = "Please select a lot";
    }

    if (!warehouseId) {
      errors.warehouseId = "Please select a warehouse";
    }

    if (!quantity) {
      errors.quantity = "Quantity is required";
    } else if (Number(quantity) < 1) {
      errors.quantity = "Quantity must be at least 1";
    }

    if (!assignedManager) {
      errors.assignedManager = "Please assign a manager";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      lotId: true,
      warehouseId: true,
      quantity: true,
      assignedManager: true,
    });

    if (!validateForm()) {
      showError("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      // Create order
      const res = await createOrder(
        {
          lotId,
          warehouseId,
          quantity: Number(quantity),
          destination,
          remarks,
          createdById: user.id,
          status: "placed",
          isComplete: false,
          isAcknowledged: false,
        },
        token
      );
      const orderId = res.message;

      // Assign managers
      if (assignedManager) {
        await assignManager(orderId, assignedManager, token);
      }

      // Assign employees
      for (const employeeId of assignedEmployees) {
        await assignEmployee(orderId, employeeId, token);
      }

      showSuccess("Order created and assignments done!");
      setTimeout(() => navigate("/orders"), 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        showError(err.response?.data?.message || "Failed to create order.");
      } else {
        showError("Failed to create order.");
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8"
      style={{ background: theme.colors.background }}
    >
      <form
        className="w-full max-w-sm rounded-2xl shadow-lg p-6 flex flex-col gap-4"
        style={{ background: theme.colors.surface }}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: theme.colors.primary }}
        >
          Create Order
        </h2>

        <Dropdown
          label="Lot"
          required
          value={lotId}
          onChange={(val) => {
            setLotId(val);
            setTouched((prev) => ({ ...prev, lotId: true }));
            // Clear error immediately when valid
            if (val) {
              const errors = { ...formErrors };
              delete errors.lotId;
              setFormErrors(errors);
            }
          }}
          options={lots.map((lot: Lot) => ({
            value: lot.id,
            label: lot.lotNo,
          }))}
          placeholder="Select Lot"
          error={touched.lotId ? formErrors.lotId : undefined}
        />

        <Dropdown
          label="Warehouse"
          required
          value={warehouseId}
          onChange={(val) => {
            setWarehouseId(val);
            setTouched((prev) => ({ ...prev, warehouseId: true }));
            if (val) {
              const errors = { ...formErrors };
              delete errors.warehouseId;
              setFormErrors(errors);
            }
          }}
          options={warehouses.map((wh: Warehouse) => ({
            value: wh.id,
            label: wh.name,
          }))}
          placeholder="Select Warehouse"
          error={touched.warehouseId ? formErrors.warehouseId : undefined}
        />

        <NumberInput
          label="Quantity"
          required
          min={1}
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            setTouched((prev) => ({ ...prev, quantity: true }));
            if (e.target.value && Number(e.target.value) >= 1) {
              const errors = { ...formErrors };
              delete errors.quantity;
              setFormErrors(errors);
            }
          }}
          error={touched.quantity ? formErrors.quantity : undefined}
        />

        <Input
          label="Destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination (optional)"
        />

        <MultiSelectDropdown
          label="Assign Employees"
          options={employees.map((emp: User) => ({
            id: emp.id,
            label: `${emp.name} (${emp.email})`,
          }))}
          selected={assignedEmployees}
          onChange={setAssignedEmployees}
          placeholder="Select employees (optional)"
        />

        <Dropdown
          label="Assign Manager"
          required
          value={assignedManager}
          onChange={(val) => {
            setAssignedManager(val);
            setTouched((prev) => ({ ...prev, assignedManager: true }));
            // Clear error immediately when valid
            if (val) {
              const errors = { ...formErrors };
              delete errors.assignedManager;
              setFormErrors(errors);
            }
          }}
          options={managers.map((mgr: User) => ({
            value: mgr.id,
            label: `${mgr.name} (${mgr.email})`,
          }))}
          placeholder="Select manager"
          error={
            touched.assignedManager ? formErrors.assignedManager : undefined
          }
        />

        <TextArea
          label="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3}
          placeholder="Add any remarks (optional)"
        />

        {/* {error && (
          <div
            className="text-sm font-medium px-3 py-2 rounded"
            style={{
              color: theme.colors.error,
              backgroundColor: theme.colors.error + "15",
              border: `1px solid ${theme.colors.error}40`,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="text-sm font-medium px-3 py-2 rounded"
            style={{
              color: theme.colors.success,
              backgroundColor: theme.colors.success + "15",
              border: `1px solid ${theme.colors.success}40`,
            }}
          >
            {success}
          </div>
        )} */}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg font-semibold text-white transition-all duration-200"
          style={{
            background: loading
              ? theme.colors.secondary + "80"
              : theme.colors.secondary,
            borderRadius: theme.borderRadius.lg,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating..." : "Create Order"}
        </button>
      </form>
    </div>
  );
}
