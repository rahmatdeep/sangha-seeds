import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { theme } from "../theme";
import Input from "../components/ui/Input";
import { createVariety, updateVariety } from "../api";
import { useToast } from "../hooks/toastContext";

export default function VarietyForm() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const location = useLocation();
  const editVariety = location.state?.variety;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const [form, setForm] = useState({ name: editVariety?.name || "" });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  if (role !== "Administrator") {
    navigate("/varieties");
    return null;
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name) errors.name = "Variety name is required";
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
    setTouched({ name: true });
    if (!validateForm()) {
      showError("Please fix the errors below");
      return;
    }
    setLoading(true);
    try {
      if (editVariety) {
        await updateVariety(editVariety.id, { name: form.name });
        showSuccess("Variety updated!");
      } else {
        await createVariety(form);
        showSuccess("Variety created!");
      }
      setTimeout(() => navigate("/varieties"), 1200);
    } catch {
      showError(
        editVariety ? "Failed to update variety." : "Failed to create variety."
      );
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
          {editVariety ? "Edit Variety" : "Create Variety"}
        </h2>
        <Input
          label="Variety Name"
          required
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={touched.name ? formErrors.name : undefined}
          placeholder="Enter variety name"
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
          {loading
            ? editVariety
              ? "Updating..."
              : "Creating..."
            : editVariety
            ? "Update Variety"
            : "Create Variety"}
        </button>
      </form>
    </div>
  );
}
