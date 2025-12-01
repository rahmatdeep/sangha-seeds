import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import Input from "../components/ui/Input";
import Dropdown from "../components/ui/Dropdown";
import TextArea from "../components/ui/TextArea";
import { useToast } from "../hooks/toastContext";
import { UserRolesSchema, type UserCreate } from "../types";
import { createUser, fetchWarehouses } from "../api";
import axios from "axios";

const ROLE_OPTIONS = UserRolesSchema.options.map((role) => ({
  value: role,
  label: role,
}));

export default function CreateUser() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const [form, setForm] = useState<UserCreate>({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "Employee",
    areaOfResponsibility: "",
    warehouseid: "",
    remarks: "",
  });
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  if (role !== "Administrator") {
    navigate("/users");
    return null;
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form?.name) errors.name = "Name is required";
    if (!form?.email) errors.email = "Email is required";
    if (!form?.password || form.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (!form?.mobile || form.mobile.length < 10 || form.mobile.length > 10)
      errors.mobile = "Mobile number must be exactly 10 digits";
    if (!form?.role) errors.role = "Role is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (value) {
      const errors = { ...formErrors };
      delete errors[field];
      setFormErrors(errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      mobile: true,
      role: true,
      warehouseid: true,
    });
    if (!validateForm()) {
      showError("Please fix the errors below");
      return;
    }
    setLoading(true);
    try {
      await createUser(form);
      showSuccess("User created!");
      setTimeout(() => navigate("/users"), 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        showError(err.response?.data?.message || "Failed to create user.");
      } else {
        showError("Failed to create user.");
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
          Create User
        </h2>

        <Input
          label="Name"
          required
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={touched.name ? formErrors.name : undefined}
          placeholder="Enter name"
        />

        <Input
          label="Email"
          required
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={touched.email ? formErrors.email : undefined}
          placeholder="Enter email"
        />

        <Input
          label="Password"
          required
          type="password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={touched.password ? formErrors.password : undefined}
          placeholder="Enter password"
        />

        <Input
          label="Mobile"
          required
          type="tel"
          value={form.mobile}
          onChange={(e) => handleChange("mobile", e.target.value)}
          error={touched.mobile ? formErrors.mobile : undefined}
          placeholder="Enter mobile number"
        />

        <Dropdown
          label="Role"
          required
          value={form.role}
          onChange={(val) => handleChange("role", val)}
          options={ROLE_OPTIONS}
          placeholder="Select role"
          error={touched.role ? formErrors.role : undefined}
        />

        <Dropdown
          label="Warehouse"
          value={form.warehouseid ?? ""}
          onChange={(val) => handleChange("warehouseid", val)}
          options={warehouses.map((wh) => ({
            value: wh.id,
            label: wh.name,
          }))}
          placeholder="Select warehouse (optional)"
        />

        <Input
          label="Area of Responsibility"
          value={form.areaOfResponsibility ?? ""}
          onChange={(e) => handleChange("areaOfResponsibility", e.target.value)}
          placeholder="Optional"
        />

        <TextArea
          label="Remarks"
          value={form.remarks ?? ""}
          onChange={(e) => handleChange("remarks", e.target.value)}
          rows={2}
          placeholder="Optional"
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
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
