import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import axios from "axios";
import { fetchUsersByRole } from "../api";
import Input from "../components/ui/Input";
import NumberInput from "../components/ui/NumberInput";
import Dropdown from "../components/ui/Dropdown";
import TextArea from "../components/ui/TextArea";
import { useToast } from "../hooks/toastContext";
import type { User, WarehouseCreate } from "../types";
import api from "../api/interceptor";

interface FormErrors {
  name?: string;
  location?: string;
  maxStorageCapacity?: string;
  maxDryingCapacity?: string;
  assignedManagerId?: string;
}

export default function CreateWarehouse() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  useEffect(() => {
    if (role !== "Administrator") navigate("/warehouses");
  }, [role, navigate]);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [maxStorageCapacity, setMaxStorageCapacity] = useState("");
  const [maxDryingCapacity, setMaxDryingCapacity] = useState("");
  const [assignedManagerId, setAssignedManagerId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadManagers() {
      try {
        const mgrs = await fetchUsersByRole("Manager");
        setManagers(mgrs);
      } catch {
        setManagers([]);
      }
    }
    loadManagers();
  }, []);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!name) errors.name = "Warehouse name is required";
    if (!location) errors.location = "Location is required";
    if (!assignedManagerId)
      errors.assignedManagerId = "Please assign a manager";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      location: true,
      assignedManagerId: true,
    });
    if (!validateForm()) {
      showError("Please fix the errors below");
      return;
    }
    setLoading(true);
    try {
      const payload: WarehouseCreate = {
        name,
        location,
        maxStorageCapacity: maxStorageCapacity || null,
        maxDryingCapacity: maxDryingCapacity || null,
        assignedManagerId,
        remarks: remarks || null,
      };
      await api.post("/warehouse/create-warehouse", payload);
      showSuccess("Warehouse created!");
      setTimeout(() => navigate("/warehouses"), 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        showError(err.response?.data?.message || "Failed to create warehouse.");
      } else {
        showError("Failed to create warehouse.");
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
          Create Warehouse
        </h2>

        <Input
          label="Warehouse Name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setTouched((prev) => ({ ...prev, name: true }));
            if (e.target.value) {
              const errors = { ...formErrors };
              delete errors.name;
              setFormErrors(errors);
            }
          }}
          error={touched.name ? formErrors.name : undefined}
          placeholder="Enter warehouse name"
        />

        <Input
          label="Location"
          required
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setTouched((prev) => ({ ...prev, location: true }));
            if (e.target.value) {
              const errors = { ...formErrors };
              delete errors.location;
              setFormErrors(errors);
            }
          }}
          error={touched.location ? formErrors.location : undefined}
          placeholder="Enter location"
        />

        <NumberInput
          label="Max Storage Capacity"
          value={maxStorageCapacity}
          onChange={(e) => setMaxStorageCapacity(e.target.value)}
          placeholder="Optional"
        />

        <NumberInput
          label="Max Drying Capacity"
          value={maxDryingCapacity}
          onChange={(e) => setMaxDryingCapacity(e.target.value)}
          placeholder="Optional"
        />

        <Dropdown
          label="Assign Manager"
          required
          value={assignedManagerId}
          onChange={(val) => {
            setAssignedManagerId(val);
            setTouched((prev) => ({ ...prev, assignedManagerId: true }));
            if (val) {
              const errors = { ...formErrors };
              delete errors.assignedManagerId;
              setFormErrors(errors);
            }
          }}
          options={managers.map((mgr) => ({
            value: mgr.id,
            label: `${mgr.name} (${mgr.email})`,
          }))}
          placeholder="Select manager"
          error={
            touched.assignedManagerId ? formErrors.assignedManagerId : undefined
          }
          searchable
        />

        <TextArea
          label="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3}
          placeholder="Add any remarks (optional)"
        />

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
          {loading ? "Creating..." : "Create Warehouse"}
        </button>
      </form>
    </div>
  );
}
