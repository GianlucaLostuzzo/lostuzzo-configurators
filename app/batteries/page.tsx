"use client";
import ActionButtons from "@/components/ActionButtons";
import NumericSelector from "@/components/NumericSelector";
import PageTitle from "@/components/PageTitle";
import { useMountQuery } from "@/hooks/useMountQuery";
import { useState } from "react";

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
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetFilters = () => {
    setForm(defaultState);
    setResults([]);
  };

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
      <PageTitle>Configuratore Batterie</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <label
              htmlFor="typology"
              className="block text-lg font-medium  mb-2"
            >
              Tipologia
            </label>
            <select
              id="typology"
              name="typology"
              value={form.typology}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            >
              <option value="" disabled>
                Seleziona tipologia
              </option>
              {typologies.map((typology) => (
                <option key={typology} value={typology}>
                  {typology}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <NumericSelector
            id={"length"}
            key={"length"}
            label="Lunghezza (mm)"
            value={form["length"] as number}
            onChange={handleChange}
          />

          <NumericSelector
            id={"width"}
            key={"width"}
            label="Larghezza (mm)"
            value={form["width"] as number}
            onChange={handleChange}
          />

          <NumericSelector
            id={"height"}
            key={"height"}
            label="Altezza (mm)"
            value={form["height"] as number}
            onChange={handleChange}
          />

          <NumericSelector
            id={"lengthTolerance"}
            key={"lengthTolerance"}
            label={`Tolleranza ± Lungh. (mm)`}
            value={form["lengthTolerance"] as number}
            onChange={handleChange}
          />

          <NumericSelector
            id={"widthTolerance"}
            key={"widthTolerance"}
            label={`Tolleranza ± Larg. (mm)`}
            value={form["widthTolerance"] as number}
            onChange={handleChange}
          />

          <NumericSelector
            id={"heightTolerance"}
            key={"heightTolerance"}
            label={`Tolleranza ± Alt. (mm)`}
            value={form["heightTolerance"] as number}
            onChange={handleChange}
          />
        </div>

        {/* Positive Polarity */}
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
        <div className="flex flex-col">
          <label
            htmlFor="ahInterval"
            className="block text-lg font-medium  mb-2"
          >
            Ampere
          </label>
          <select
            id="ahInterval"
            name="ahInterval"
            value={form.ahInterval}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
          >
            <option value="" disabled>
              Seleziona intervallo
            </option>
            {amperesOptions.map((interval) => (
              <option key={interval} value={interval}>
                {interval}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <ActionButtons loading={loading} onReset={resetFilters} />
      </form>

      {/* Results */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Risultati
        </h2>
        {results.length > 0 ? (
          <ul className="mt-4 list-disc pl-10 space-y-2 ">
            {results.map((code) => (
              <li key={code} className="text-lg">
                {code}
              </li>
            ))}
          </ul>
        ) : (
          !loading && (
            <p className="mt-4 text-gray-500 text-center text-lg">
              Nessun risultato trovato.
            </p>
          )
        )}
      </div>
    </div>
  );
}
