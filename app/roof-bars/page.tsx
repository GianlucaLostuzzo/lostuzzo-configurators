"use client";

import { useCallback, useState } from "react";
import { useMountQuery } from "@/hooks/use-mount-query";
import TextSelector from "@/components/text-selector";
import PageTitle from "@/components/page-title";
import ActionsButtons from "@/components/action-button";
import ResultsSection from "@/components/results-section";
import { ApiFilterResult, ApiProductResult } from "@/lib/types";

export default function RoofBarsConfigurator() {
  const [form, setForm] = useState({
    manufacturer: "",
    brand: "",
    model: "",
    year: "",
    type: "",
  });

  const { data: manufacturerOptions } = useMountQuery(
    "/api/roof-bars/get-all-manufacturers"
  );
  const [brandOptions, setBrandOptions] = useState<ApiFilterResult>({
    data: [],
  });
  const [modelOptions, setModelOptions] = useState<ApiFilterResult>({
    data: [],
  });
  const [yearOptions, setYearOptions] = useState<ApiFilterResult>({ data: [] });
  const [typeOptions, setTypeOptions] = useState<ApiFilterResult>({ data: [] });
  const [results, setResults] = useState<ApiProductResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOptions = useCallback(
    async (
      endpoint: string,
      filters: Record<string, string>,
      setter: React.Dispatch<React.SetStateAction<ApiFilterResult>>
    ) => {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([, value]) => value)
      ).toString();
      const response = await fetch(`${endpoint}?${queryParams}`);
      const data = (await response.json()) as ApiFilterResult;
      setter({ data: [{ value: "all" }, ...data.data] });
    },
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));

      if (name === "manufacturer") {
        setBrandOptions({ data: [] });
        setModelOptions({ data: [] });
        setYearOptions({ data: [] });
        setTypeOptions({ data: [] });
        setForm((prev) => ({
          ...prev,
          brand: "",
          model: "",
          year: "",
          type: "",
        }));
        if (value !== "all") {
          fetchOptions(
            "/api/roof-bars/get-brands",
            { manufacturer: value },
            setBrandOptions
          );
        }
      } else if (name === "brand") {
        setModelOptions({ data: [] });
        setYearOptions({ data: [] });
        setTypeOptions({ data: [] });
        setForm((prev) => ({ ...prev, model: "", year: "", type: "" }));
        if (value !== "all") {
          fetchOptions(
            "/api/roof-bars/get-models",
            { manufacturer: form.manufacturer, brand: value },
            setModelOptions
          );
        }
      } else if (name === "model") {
        setYearOptions({ data: [] });
        setTypeOptions({ data: [] });
        setForm((prev) => ({ ...prev, year: "", type: "" }));
        if (value !== "all") {
          fetchOptions(
            "/api/roof-bars/get-years",
            {
              manufacturer: form.manufacturer,
              brand: form.brand,
              model: value,
            },
            setYearOptions
          );
        }
      } else if (name === "year") {
        setTypeOptions({ data: [] });
        setForm((prev) => ({ ...prev, type: "" }));
        if (value !== "all") {
          fetchOptions(
            "/api/roof-bars/get-types",
            {
              manufacturer: form.manufacturer,
              brand: form.brand,
              model: form.model,
              year: value,
            },
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
              manufacturer: "manufacturerCar",
              brand: "brandCar",
              model: "modelCar",
              year: "yearCar",
              type: "typeBar",
            };
            return [mappedKeys[key], value];
          })
      ).toString();

      try {
        const response = await fetch(`/api/roof-bars/search?${queryParams}`);
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
    setForm({ manufacturer: "", brand: "", model: "", year: "", type: "" });
    setBrandOptions({ data: [] });
    setModelOptions({ data: [] });
    setYearOptions({ data: [] });
    setTypeOptions({ data: [] });
    setResults(null);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageTitle>Configuratore Barre Tetto</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextSelector
          id="manufacturer"
          label="Produttore"
          value={form.manufacturer}
          disabledOptionText="Seleziona un produttore"
          onChange={handleChange}
          options={manufacturerOptions.data.map((x) => x.value)}
        />

        <TextSelector
          id="brand"
          label="Marca"
          value={form.brand}
          disabledOptionText="Seleziona una marca"
          onChange={handleChange}
          options={brandOptions.data.map((x) => x.value)}
          disabled={!form.manufacturer || form.manufacturer === "all"}
        />

        <TextSelector
          id="model"
          label="Modello"
          value={form.model}
          disabledOptionText="Seleziona un modello"
          onChange={handleChange}
          options={modelOptions.data.map((x) => x.value)}
          disabled={!form.brand || form.brand === "all"}
        />

        <TextSelector
          id="year"
          label="Anno"
          value={form.year}
          disabledOptionText="Seleziona un anno"
          onChange={handleChange}
          options={yearOptions.data.map((x) => x.value)}
          disabled={!form.model || form.model === "all"}
        />

        <TextSelector
          id="type"
          label="Tipo"
          value={form.type}
          disabledOptionText="Seleziona un tipo (opzionale)"
          onChange={handleChange}
          options={typeOptions.data.map((x) => x.value)}
          disabled={!form.year || form.year === "all"}
        />

        <ActionsButtons
          loading={loading}
          disabled={
            !form.manufacturer || !form.brand || !form.model || !form.year
          }
          onReset={resetAll}
        />
      </form>

      <ResultsSection results={results} loading={loading} />
    </div>
  );
}
