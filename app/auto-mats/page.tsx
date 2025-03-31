"use client";

import { useCallback, useState } from "react";
import { useMountQuery } from "@/hooks/use-mount-query";
import TextSelector from "@/components/text-selector";
import PageTitle from "@/components/page-title";
import ActionsButtons from "@/components/action-button";
import ResultsSection from "@/components/results-section";
import { ApiFilterResult, ApiProductResult } from "@/lib/types";

export default function AutoMatsConfigurator() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    type: "",
  });

  const { data: brandOptions } = useMountQuery("/api/auto-mats/get-all-brands");
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

      if (name === "brand") {
        setModelOptions({ data: [] });
        setYearOptions({ data: [] });
        setTypeOptions({ data: [] });
        setForm((prev) => ({ ...prev, model: "", year: "", type: "" }));
        if (value !== "all") {
          fetchOptions(
            "/api/auto-mats/get-models",
            { brand: value },
            setModelOptions
          );
        }
      } else if (name === "model") {
        setYearOptions({ data: [] });
        setTypeOptions({ data: [] });
        setForm((prev) => ({ ...prev, year: "", type: "" }));
        if (value !== "all") {
          fetchOptions(
            "/api/auto-mats/get-years",
            { brand: form.brand, model: value },
            setYearOptions
          );
        }
      } else if (name === "year") {
        setTypeOptions({ data: [] });
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
    setModelOptions({ data: [] });
    setYearOptions({ data: [] });
    setTypeOptions({ data: [] });
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
          options={brandOptions.data.map((x) => x.value)}
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
          disabled={!form.brand}
          onReset={resetAll}
        />
      </form>

      <ResultsSection
        results={results}
        loading={loading}
        imageBasePath="ep_auto_mats"
      />
    </div>
  );
}
