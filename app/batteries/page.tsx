"use client";
import ActionButtons from "@/components/ActionButtons";
import NumericSelector from "@/components/NumericSelector";
import PageTitle from "@/components/PageTitle";
import ResultsSection from "@/components/ResultsSection";
import TextSelector from "@/components/TextSelector";
import { useMountQuery } from "@/hooks/useMountQuery";
import { useCallback, useMemo, useState } from "react";

const amperesOptions = [
  "0-9",
  "10-25",
  "26-40",
  "41-55",
  "56-69",
  "70-79",
  "80-89",
  "90-99",
  "100-120",
  "121-150",
  "151-199",
  "200+",
];

type FormState = {
  typology: string;
  ahInterval: string;
  length: number;
  width: number;
  height: number;
  lengthTolerance: number;
  widthTolerance: number;
  heightTolerance: number;
  positivePolarity: string;
};

const defaultState: FormState = {
  typology: "",
  ahInterval: "",
  length: 0,
  width: 0,
  height: 0,
  lengthTolerance: 15,
  widthTolerance: 15,
  heightTolerance: 15,
  positivePolarity: "",
};

export default function Configurator() {
  const [form, setForm] = useState<FormState>(defaultState);

  const { data: typologies } = useMountQuery(
    "/api/batteries/get-all-typologies"
  );
  const [results, setResults] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle form changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (
        name === "length" ||
        name === "width" ||
        name === "height" ||
        name === "lengthTolerance" ||
        name === "widthTolerance" ||
        name === "heightTolerance"
      ) {
        // Remove non-numeric characters
        const parsedValue = value.replace(/\D/g, "");
        setForm((prev) => ({ ...prev, [name]: parsedValue }));
        return;
      }
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Reset form
  const resetFilters = () => {
    setForm(defaultState);
    setResults(null);
  };

  const searchDisabled = useMemo(() => {
    return (
      !form.length ||
      !form.width ||
      !form.height ||
      !form.ahInterval ||
      !form.typology
    );
  }, [form]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const queryParams = new URLSearchParams(
      Object.entries(form).map(([key, value]) => [key, String(value)])
    ).toString();

    try {
      const response = await fetch(`/api/batteries/search?${queryParams}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageTitle>Batterie</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextSelector
            id="typology"
            label="Tipologia"
            onChange={handleChange}
            value={form.typology}
            options={typologies}
            disabledOptionText="Seleziona tipologia"
          />
        </div>

        {/* Dimension Inputs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <NumericSelector
            id={"length"}
            key={"length"}
            label="Lunghezza (mm)"
            value={form.length}
            onChange={handleChange}
          />

          <NumericSelector
            id={"width"}
            key={"width"}
            label="Larghezza (mm)"
            value={form.width}
            onChange={handleChange}
          />

          <NumericSelector
            id={"height"}
            key={"height"}
            label="Altezza (mm)"
            value={form.height}
            onChange={handleChange}
          />

          <NumericSelector
            id={"lengthTolerance"}
            key={"lengthTolerance"}
            label={`Tolleranza ± Lungh. (mm)`}
            value={form.lengthTolerance}
            onChange={handleChange}
          />

          <NumericSelector
            id={"widthTolerance"}
            key={"widthTolerance"}
            label={`Tolleranza ± Larg. (mm)`}
            value={form.widthTolerance}
            onChange={handleChange}
          />

          <NumericSelector
            id={"heightTolerance"}
            key={"heightTolerance"}
            label={`Tolleranza ± Alt. (mm)`}
            value={form.heightTolerance}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="positivePolarity"
            className="block text-lg font-medium  mb-4 text-center"
          >
            Polarità positiva
          </label>
          <div className="flex justify-center space-x-4">
            {[
              { label: "Indifferente", value: "" },
              { label: "SX", value: "SX" },
              { label: "DX", value: "DX" },
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="positivePolarity"
                  value={option.value}
                  checked={form.positivePolarity === option.value}
                  onChange={handleChange}
                  className="form-radio focus:ring-indigo-500"
                />
                <span className="text-lg font-medium ">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amperes Interval */}
        <TextSelector
          id="ahInterval"
          label="Ampere"
          value={form.ahInterval}
          onChange={handleChange}
          options={amperesOptions}
          disabledOptionText="Seleziona intervallo"
        />

        {/* Action Buttons */}
        <ActionButtons
          loading={loading}
          onReset={resetFilters}
          disabled={searchDisabled}
        />
      </form>

      {/* Results */}
      <ResultsSection results={results} loading={loading} />
    </div>
  );
}
