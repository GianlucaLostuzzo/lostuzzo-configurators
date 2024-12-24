"use client";

import { useCallback, useState } from "react";
import { useMountQuery } from "@/hooks/useMountQuery";
import TextSelector from "@/components/TextSelector";
import PageTitle from "@/components/PageTitle";
import ActionsButtons from "@/components/ActionButtons";
import ResultsSection from "@/components/ResultsSection";

type FormData = {
  capacity: string;
  color: string;
  doubleOpening: string;
  fixingType: string;
};

export default function CarTrunksConfigurator() {
  const [form, setForm] = useState<FormData>({
    capacity: "",
    color: "",
    doubleOpening: "",
    fixingType: "",
  });

  const [capacityFilter, setCapacityFilter] = useState<
    Record<string, string> | undefined
  >(undefined);

  const { data: capacityOptions } = useMountQuery(
    "/api/car-trunks/get-capacities",
    capacityFilter
  );

  const [colorFilter, setColorFilter] = useState<
    Record<string, string> | undefined
  >(undefined);

  const { data: colorOptions } = useMountQuery(
    "/api/car-trunks/get-colors",
    colorFilter
  );

  const [doubleOpeningFilter, setDoubleOpeningFilter] = useState<
    Record<string, string> | undefined
  >(undefined);

  const { data: doubleOpeningOptions } = useMountQuery(
    "/api/car-trunks/get-double-openings",
    doubleOpeningFilter
  );

  const [fixingTypeOptionsFilter, setFixingTypeOptionsFilter] = useState<
    Record<string, string> | undefined
  >(undefined);

  const { data: fixingTypeOptions } = useMountQuery(
    "/api/car-trunks/get-fixing-types",
    fixingTypeOptionsFilter
  );

  const [results, setResults] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOptions = useCallback(
    async (field: keyof FormData, params: FormData) => {
      switch (field) {
        case "capacity":
          setCapacityFilter(params);
          break;
        case "color":
          setColorFilter(params);
          break;
        case "doubleOpening":
          setDoubleOpeningFilter(params);
          break;
        case "fixingType":
          setFixingTypeOptionsFilter(params);
          break;
      }
    },
    []
  );

  const resetAll = useCallback(() => {
    setForm({
      capacity: "",
      color: "",
      doubleOpening: "",
      fixingType: "",
    });
    setResults(null);
    setDoubleOpeningFilter(undefined);
    setCapacityFilter(undefined);
    setColorFilter(undefined);
    setFixingTypeOptionsFilter(undefined);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));

      if (value !== "all") {
        const params: FormData = { ...form, [name]: value };
        const fields = Object.entries(params)
          .filter(([key, value]) => value === "" && key !== name)
          .map(([key]) => key) as Array<keyof FormData>;
        fields.forEach((field) => fetchOptions(field, params));
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
          .filter(([, value]) => value)
          .map(([key, value]) => [key, value === "all" ? "" : value])
      ).toString();

      try {
        const response = await fetch(`/api/car-trunks/search?${queryParams}`);
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageTitle>Bauli per Auto</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextSelector
          id="capacity"
          label="Capacità"
          value={form.capacity}
          disabledOptionText="Seleziona una capacità"
          onChange={handleChange}
          options={capacityOptions}
        />

        <TextSelector
          id="color"
          label="Colore"
          value={form.color}
          disabledOptionText="Seleziona un colore"
          onChange={handleChange}
          options={colorOptions}
        />

        <TextSelector
          id="doubleOpening"
          label="Apertura Doppia"
          value={form.doubleOpening}
          disabledOptionText="Seleziona un tipo di apertura"
          onChange={handleChange}
          options={doubleOpeningOptions}
        />

        <TextSelector
          id="fixingType"
          label="Tipo di Fissaggio"
          value={form.fixingType}
          disabledOptionText="Seleziona un tipo di fissaggio"
          onChange={handleChange}
          options={fixingTypeOptions}
        />

        <ActionsButtons loading={loading} onReset={resetAll} />
      </form>

      <ResultsSection results={results} loading={loading} />
    </div>
  );
}