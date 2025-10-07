"use client";

import { useCallback, useState, useRef } from "react";
import { useMountQuery } from "@/hooks/use-mount-query";
import TextSelector from "@/components/text-selector";
import PageTitle from "@/components/page-title";
import ActionsButtons from "@/components/action-button";
import ResultsSection from "@/components/results-special";
import { ApiFilterResult, ApiProductResult } from "@/lib/types";
import Image from "next/image";

type FormState = {
  brand: string;
  model: string;
  year: string;
};

const isAbortError = (e: unknown): boolean => {
  if (e instanceof DOMException) return e.name === "AbortError";
  if (typeof e === "object" && e && "name" in e) {
    const name = (e as { name?: string }).name;
    return name === "AbortError";
  }
  return false;
};

export default function ProfessionalBarsConfigurator() {
  const [form, setForm] = useState<FormState>({
    brand: "",
    model: "",
    year: "",
  });

  // Marca: lista iniziale
  const { data: brandOptions = { data: [] } } = useMountQuery(
    "/api/professional-bars/get-all-brands"
  );

  // Opzioni dipendenti
  const [modelOptions, setModelOptions] = useState<ApiFilterResult>({ data: [] });
  const [yearOptions, setYearOptions] = useState<ApiFilterResult>({ data: [] });

  const [results, setResults] = useState<ApiProductResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Cache e controller per endpoint (abort + cache)
  const cacheRef = useRef<Map<string, ApiFilterResult>>(new Map());
  const controllersRef = useRef<Record<string, AbortController>>({});

  const makeCacheKey = (endpoint: string, filters: Record<string, string>) => {
    const entries = Object.entries(filters)
      .filter(([, v]) => v != null && v !== "" && v !== "all")
      .sort(([a], [b]) => a.localeCompare(b));
    const qs = new URLSearchParams(entries as [string, string][]).toString();
    return `${endpoint}?${qs}`;
  };

  // Helper per fetch generica delle opzioni
  const fetchOptions = useCallback(
    async (
      endpoint: string,
      filters: Record<string, string>,
      setter: React.Dispatch<React.SetStateAction<ApiFilterResult>>
    ) => {
      // normalizza e genera chiave cache
      const clean = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v && v !== "all")
      ) as Record<string, string>;
      const key = makeCacheKey(endpoint, clean);

      // Cache hit
      const cached = cacheRef.current.get(key);
      if (cached) {
        setter(cached);
        return;
      }

      // Abort eventuale richiesta precedente per lo stesso endpoint
      try {
        controllersRef.current[endpoint]?.abort();
      } catch {}
      const controller = new AbortController();
      controllersRef.current[endpoint] = controller;

      try {
        const qs = new URLSearchParams(clean).toString();
        const url = qs ? `${endpoint}?${qs}` : endpoint;

        const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = (await response.json()) as ApiFilterResult;
        const normalized = { data: [{ value: "all" }, ...(data?.data ?? [])] };

        cacheRef.current.set(key, normalized);
        setter(normalized);
      } catch (e: unknown) {
        if (!isAbortError(e)) console.error("Failed to fetch options", e);
        setter({ data: [{ value: "all" }] }); // fallback minimo
      } finally {
        // pulizia controller
        if (controllersRef.current[endpoint] === controller) {
          delete controllersRef.current[endpoint];
        }
      }
    },
    []
  );

  // onChange dei select (usa l'id del campo)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const field = e.target.id as keyof FormState;
      const raw = e.target.value;
      const value = raw === "all" ? "" : raw;

      if (field === "brand") {
        // reset a cascata
        setModelOptions({ data: [] });
        setYearOptions({ data: [] });

        setForm((prev) => ({
          ...prev,
          brand: value,
          model: "",
          year: "",
        }));

        if (value) {
          fetchOptions("/api/professional-bars/get-models", { brand: value }, setModelOptions);
        }
        return;
      }

      if (field === "model") {
        setYearOptions({ data: [] });

        setForm((prev) => ({
          ...prev,
          model: value,
          year: "",
          type: "",
          manufacturer: "",
        }));

        if (value) {
          fetchOptions(
            "/api/professional-bars/get-years",
            { brand: form.brand, model: value },
            setYearOptions
          );
        }
        return;
      }

      if (field === "year") {
        setForm((prev) => ({
          ...prev,
          year: value,
        }));
        return;
      }
    },
    [form, fetchOptions]
  );

    const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const mappedKeys: Record<keyof FormState, string> = {
        brand: "brandCar",
        model: "modelCar",
        year: "yearCar",
      };

      const qs = new URLSearchParams(
        (Object.entries(form) as [keyof FormState, string][])
          .filter(([, v]) => v && v.length > 0)
          .map(([k, v]) => [mappedKeys[k], v])
      ).toString();

      try {
        const response = await fetch(`/api/professional-bars/search?${qs}`);
        const data = (await response.json()) as ApiProductResult;
        setResults(data);
      } catch (e: unknown) {
        console.error("Search failed:", e);
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  // Reset totale
  const resetAll = useCallback(() => {
    setForm({ brand: "", model: "", year: ""});
    setModelOptions({ data: [] });
    setYearOptions({ data: [] });
    setResults(null);
  }, []);

  // Opzioni marca con "all" in testa
  const brandOpts = [{ value: "all" }, ...(brandOptions?.data ?? [])];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageTitle>Configuratore barre veicoli commerciali</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextSelector
          id="brand"
          label="Marca"
          value={form.brand || "all"}
          disabledOptionText="Seleziona una marca"
          onChange={handleChange}
          options={brandOpts.map((x) => x.value)}
        />

        <TextSelector
          id="model"
          label="Modello"
          value={form.model || "all"}
          disabledOptionText="Seleziona un modello"
          onChange={handleChange}
          options={modelOptions.data.map((x) => x.value)}
          disabled={!form.brand}
        />

        <TextSelector
          id="year"
          label="Anno"
          value={form.year || "all"}
          disabledOptionText="Seleziona l'anno di produzione"
          onChange={handleChange}
          options={yearOptions.data.map((x) => x.value)}
          disabled={!form.model}
        />

        <ActionsButtons
          loading={loading}
          disabled={!form.brand || !form.model || !form.year }
          onReset={resetAll}
        />
      </form>
      <div className="flex justify-center">
        <Image src={"/fixing_points.png"} alt="Barre veicoli commerciali" width={400} height={400} className="m-10" />
      </div>
      <div className="flex justify-center">
        <p className="text-sm text-gray-600 italic mb-4">
        * I kit di fissaggio applicabili vengono indicati in base alle possibili posizioni di montaggio sul veicolo selezionato, come da immagine.
        </p>
      </div>

      <ResultsSection results={results} loading={loading} />
    </div>
  );
}
