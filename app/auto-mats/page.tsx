"use client";

import { useCallback, useState } from "react";
import { useMountQuery } from "@/hooks/useMountQuery";
import TextSelector from "@/components/TextSelector";
import PageTitle from "@/components/PageTitle";
import ActionsButtons from "@/components/ActionButtons";
import ResultsSection from "@/components/ResultsSection";

export default function AutoMatsConfigurator() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    type: "",
  });

  const { data: brandOptions } = useMountQuery("/api/auto-mats/get-all-brands");
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [results, setResults] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOptions = useCallback(
    async (
      endpoint: string,
      filters: Record<string, string>,
      setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([, value]) => value)
      ).toString();
      const response = await fetch(`${endpoint}?${queryParams}`);
      const data = await response.json();
      setter(["all", ...data]);
    },
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));

      if (name === "brand") {
        setModelOptions([]);
        setYearOptions([]);
        setTypeOptions([]);
        setForm((prev) => ({ ...prev, model: "", year: "", type: "" }));
        if (value !== "all") {
          fetchOptions(
            "/api/auto-mats/get-models",
            { brand: value },
            setModelOptions
          );
        }
      } else if (name === "model") {
        setYearOptions([]);
        setTypeOptions([]);
        setForm((prev) => ({ ...prev, year: "", type: "" }));
        if (value !== "all") {
          fetchOptions(
            "/api/auto-mats/get-years",
            { brand: form.brand, model: value },
            setYearOptions
          );
        }
      } else if (name === "year") {
        setTypeOptions([]);
        setForm((prev) => ({ ...prev, type: "" }));
        if (value !== "all") {
          fetchOptions(
            "/api/auto-mats/get-types",
            { brand: form.brand, model: form.model, year: value },
            setTypeOptions
          );
        }
      }
    },
    [fetchOptions, form]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const queryParams = new URLSearchParams(
        Object.entries(form)
          .filter(([, value]) => value && value !== "all")
          .map(([key, value]) => {
            const mappedKeys: Record<string, string> = {
              brand: "brandCar",
              model: "modelCar",
              year: "yearCar",
              type: "typeMat",
            };
            return [mappedKeys[key], value];
          })
      ).toString();

      try {
        const response = await fetch(`/api/auto-mats/search?${queryParams}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  const resetAll = useCallback(() => {
    setForm({ brand: "", model: "", year: "", type: "" });
    setModelOptions([]);
    setYearOptions([]);
    setTypeOptions([]);
    setResults(null);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageTitle>Configuratore Tappetini Auto</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextSelector
          id="brand"
          label="Marca"
          value={form.brand}
          disabledOptionText="Seleziona una marca"
          onChange={handleChange}
          options={brandOptions}
        />

        <TextSelector
          id="model"
          label="Modello"
          value={form.model}
          disabledOptionText="Seleziona un modello"
          onChange={handleChange}
          options={modelOptions}
          disabled={!form.brand || form.brand === "all"}
        />

        <TextSelector
          id="year"
          label="Anno"
          value={form.year}
          disabledOptionText="Seleziona un anno"
          onChange={handleChange}
          options={yearOptions}
          disabled={!form.model || form.model === "all"}
        />

        <TextSelector
          id="type"
          label="Tipo"
          value={form.type}
          disabledOptionText="Seleziona un tipo (opzionale)"
          onChange={handleChange}
          options={typeOptions}
          disabled={!form.year || form.year === "all"}
        />

        <ActionsButtons
          loading={loading}
          disabled={!form.brand}
          onReset={resetAll}
        />
      </form>

      <ResultsSection results={results} loading={loading} />
    </div>
  );
}
