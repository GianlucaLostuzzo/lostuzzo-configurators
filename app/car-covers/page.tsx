"use client";

import { useCallback, useState } from "react";
import { useMountQuery } from "@/hooks/useMountQuery";
import TextSelector from "@/components/TextSelector";
import PageTitle from "@/components/PageTitle";
import ActionsButtons from "@/components/ActionButtons";
import ResultsSection from "@/components/ResultsSection";

export default function CarCoversConfigurator() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
  });

  const { data: brandOptions } = useMountQuery("/api/car-covers/get-brands");
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [results, setResults] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchModels = useCallback(async (brand: string) => {
    if (!brand) return;

    const response = await fetch(`/api/car-covers/get-models?brand=${brand}`);
    const data = await response.json();
    setModelOptions(data);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));

      if (name === "brand") {
        fetchModels(value);
        setForm((prev) => ({ ...prev, model: "" }));
      }
    },
    [fetchModels]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const queryParams = new URLSearchParams(form).toString();

      try {
        const response = await fetch(`/api/car-covers/search?${queryParams}`);
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
    setForm({ brand: "", model: "" });
    setModelOptions([]);
    setResults(null);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageTitle>Teli Copri Auto Antigrandine</PageTitle>

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

        <ActionsButtons
          loading={loading}
          disabled={!form.brand || !form.model}
          onReset={resetAll}
        />
      </form>

      <ResultsSection
        results={results}
        loading={loading}
        imageBasePath="ep_car_covers"
      />
    </div>
  );
}
