"use client";

import { useCallback, useState } from "react";
import { useMountQuery } from "@/hooks/use-mount-query";
import TextSelector from "@/components/text-selector";
import PageTitle from "@/components/page-title";
import ActionsButtons from "@/components/action-button";
import ResultsSection from "@/components/results-section";
import { ApiFilterResult, ApiProductResult } from "@/lib/types";

export default function TowbarsConfigurator() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
  });

  const { data: brandOptions } = useMountQuery("/api/towbars/get-all-brands");
  const [modelOptions, setModelOptions] = useState<ApiFilterResult>({
    data: [],
  });
  const [yearOptions, setYearOptions] = useState<ApiFilterResult>({ data: [] });
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
        setForm((prev) => ({ ...prev, model: "", year: "" }));
        if (value !== "all") {
          fetchOptions(
            "/api/towbars/get-models",
            { brand: value },
            setModelOptions
          );
        }
      } else if (name === "model") {
        setYearOptions({ data: [] });
        setForm((prev) => ({ ...prev, year: "" }));
        if (value !== "all") {
          fetchOptions(
            "/api/towbars/get-years",
            { brand: form.brand, model: value },
            setYearOptions
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
            };
            return [mappedKeys[key], value];
          })
      ).toString();

      try {
        const response = await fetch(`/api/towbars/search?${queryParams}`);
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
    setForm({ brand: "", model: "", year: "" });
    setModelOptions({ data: [] });
    setYearOptions({ data: [] });
    setResults(null);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageTitle>Configuratore Ganci Traino</PageTitle>

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

        <ActionsButtons
          loading={loading}
          disabled={!form.brand}
          onReset={resetAll}
        />
      </form>

      <ResultsSection
        results={results}
        loading={loading}
        imageBasePath="ep_towbars"
      />
    </div>
  );
}
