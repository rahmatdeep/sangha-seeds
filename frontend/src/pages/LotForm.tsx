import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { theme } from "../theme";
import Input from "../components/ui/Input";
import Dropdown from "../components/ui/Dropdown";
import Calendar from "../components/ui/Calendar";
import {
  PotatoSizesSchema,
  type Lot,
  type Variety,
  type Warehouse,
} from "../types";
import { createLot, fetchWarehouses, fetchVarieties, updateLot } from "../api";
import { useToast } from "../hooks/toastContext";

const SIZE_OPTIONS = PotatoSizesSchema.options.map((size) => ({
  value: size,
  label: size,
}));

export default function LotForm() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const location = useLocation();
  const editLot: Lot | undefined = location.state?.lot;
  const [form, setForm] = useState<Partial<Lot>>({
    lotNo: editLot?.lotNo || "",
    varietyId: editLot?.varietyId || "",
    quantity: editLot?.quantity || 0,
    size: editLot?.size || "Seed",
    storageDate: editLot?.storageDate ? new Date(editLot.storageDate) : null,
    expiryDate: editLot?.expiryDate ? new Date(editLot.expiryDate) : null,
    warehouseId: editLot?.warehouseId || "",
    remarks: editLot?.remarks || "",
  });
  const [warehouses, setWarehouses] = useState<Warehouse[]>(
    location.state?.warehouses || []
  );
  const [varieties, setVarieties] = useState<Variety[]>(
    location.state?.varieties || []
  );
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadWarehouses() {
      if (!warehouses.length) {
        try {
          const data = await fetchWarehouses();
          setWarehouses(data);
        } catch {
          setWarehouses([]);
        }
      }
    }
    async function loadVarieties() {
      if (!varieties.length) {
        try {
          const data = await fetchVarieties();
          setVarieties(data);
        } catch {
          setVarieties([]);
        }
      }
    }
    loadWarehouses();
    loadVarieties();
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.lotNo) errors.lotNo = "Lot number is required";
    if (!form.varietyId) errors.varietyId = "Variety is required";
    if (!form.quantity || form.quantity <= 0)
      errors.quantity = "Quantity must be positive";
    if (!form.size) errors.size = "Size is required";
    if (!form.warehouseId) errors.warehouseId = "Warehouse is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: unknown) => {
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
      lotNo: true,
      varietyId: true,
      quantity: true,
      size: true,
      warehouseId: true,
    });
    if (!validateForm()) {
      showError("Please fix the errors below");
      return;
    }
    setLoading(true);
    try {
      if (editLot) {
        // Update
        await updateLot(editLot.id, {
          ...form,
          storageDate: form.storageDate
            ? new Date(form.storageDate)
            : undefined,
          expiryDate: form.expiryDate ? new Date(form.expiryDate) : undefined,
        });
        showSuccess("Lot updated!");
      } else {
        await createLot({
          lotNo: form.lotNo as string,
          varietyId: form.varietyId as string,
          quantity: form.quantity as number,
          size: form.size as (typeof PotatoSizesSchema.options)[number],
          warehouseId: form.warehouseId ?? undefined,
          remarks: form.remarks,
          storageDate: form.storageDate
            ? new Date(form.storageDate)
            : undefined,
          expiryDate: form.expiryDate ? new Date(form.expiryDate) : undefined,
          quantityOnHold: 0,
        });
        showSuccess("Lot created!");
      }
      setTimeout(() => navigate("/lots"), 1200);
    } catch {
      showError(editLot ? "Failed to update lot." : "Failed to create lot.");
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
          {editLot ? "Edit Lot" : "Create Lot"}
        </h2>
        <Input
          label="Lot Number"
          required
          value={form.lotNo}
          onChange={(e) => handleChange("lotNo", e.target.value)}
          error={touched.lotNo ? formErrors.lotNo : undefined}
          placeholder="Enter lot number"
        />
        <Dropdown
          label="Variety"
          required
          value={form.varietyId || ""}
          onChange={(val) => handleChange("varietyId", val)}
          options={varieties.map((v) => ({ value: v.id, label: v.name }))}
          placeholder="Select variety"
          error={touched.varietyId ? formErrors.varietyId : undefined}
        />
        <Input
          label="Quantity"
          required
          type="number"
          value={form.quantity}
          onChange={(e) => handleChange("quantity", Number(e.target.value))}
          error={touched.quantity ? formErrors.quantity : undefined}
          placeholder="Enter quantity"
        />
        <Dropdown
          label="Size"
          required
          value={form.size || ""}
          onChange={(val) => handleChange("size", val)}
          options={SIZE_OPTIONS}
          placeholder="Select size"
          error={touched.size ? formErrors.size : undefined}
        />
        <Dropdown
          label="Warehouse"
          required
          value={form.warehouseId ?? ""}
          onChange={(val) => handleChange("warehouseId", val)}
          options={warehouses.map((wh) => ({ value: wh.id, label: wh.name }))}
          placeholder="Select warehouse"
          error={touched.warehouseId ? formErrors.warehouseId : undefined}
        />
        <Calendar
          label="Storage Date"
          value={typeof form.storageDate === "string" ? form.storageDate : ""}
          onChange={(val) => handleChange("storageDate", val)}
        />
        <Calendar
          label="Expiry Date"
          value={typeof form.expiryDate === "string" ? form.expiryDate : ""}
          onChange={(val) => handleChange("expiryDate", val)}
        />
        <Input
          label="Remarks"
          value={form.remarks ?? ""}
          onChange={(e) => handleChange("remarks", e.target.value)}
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
          {loading
            ? editLot
              ? "Updating..."
              : "Creating..."
            : editLot
            ? "Update Lot"
            : "Create Lot"}
        </button>
      </form>
    </div>
  );
}
