"use client";
import ActionButtons from "@/components/action-button";
import NumericSelector from "@/components/numeric-selector";
import PageTitle from "@/components/page-title";
import ResultsSection from "@/components/results-section";
import TextSelector from "@/components/text-selector";
import { ApiProductResult } from "@/lib/types";
import { useCallback, useEffect, useMemo, useState } from "react";

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

const ALL_BRANDS_LABEL = "Tutte le marche";
const ALL_TECHS_LABEL = "Tutte le tecnologie";

type FormState = {
  typology: string;
  brand: string;
  technology: string;
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
  brand: "",
  technology: "",
  ahInterval: "",
  length: 0,
  width: 0,
  height: 0,
  lengthTolerance: 20,
  widthTolerance: 20,
  heightTolerance: 20,
  positivePolarity: "",
};

type SimpleOption = { value: string };

export default function Configurator() {
  const [form, setForm] = useState<FormState>(defaultState);

  // Tipologie (già esistenti)
  const [typologies, setTypologies] = useState<SimpleOption[]>([]);
  // Opzioni dipendenti
  const [brands, setBrands] = useState<SimpleOption[]>([]);
  const [technologies, setTechnologies] = useState<SimpleOption[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingTechnologies, setLoadingTechnologies] = useState(false);

  const [results, setResults] = useState<ApiProductResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Carica le tipologie all'avvio
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/batteries/get-all-typologies");
        const json = await res.json();
        setTypologies(json.data ?? []);
      } catch (e) {
        console.error("Failed to load typologies", e);
      }
    })();
  }, []);

  // Carica BRAND quando cambia TIPOLOGIA
  useEffect(() => {
    // reset campi dipendenti quando cambi tipologia
    setForm((prev) => ({ ...prev, brand: "", technology: "" }));

    if (!form.typology) {
      setBrands([]);
      setTechnologies([]);
      return;
    }

    const controller = new AbortController();
    (async () => {
      try {
        setLoadingBrands(true);
        const res = await fetch(
          `/api/batteries/get-all-brands?typology=${encodeURIComponent(form.typology)}`,
          { signal: controller.signal }
        );
        const json = await res.json();
        setBrands(json.data ?? []);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") {
          console.error("Failed to load brands", e);
        }
      } finally {
        setLoadingBrands(false);
      }
    })();

    return () => controller.abort();
  }, [form.typology]);

  // Carica TECHNOLOGY quando cambia TIPOLOGIA o BRAND
  useEffect(() => {
    // reset tecnologia al variare di tipologia/brand
    setForm((prev) => ({ ...prev, technology: "" }));

    if (!form.typology) {
      setTechnologies([]);
      return;
    }

    const controller = new AbortController();
    (async () => {
      try {
        setLoadingTechnologies(true);
        const qs = new URLSearchParams({
          typology: form.typology,
          ...(form.brand ? { brand: form.brand } : {}),
        }).toString();

        const res = await fetch(`/api/batteries/get-all-technologies?${qs}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        setTechnologies(json.data ?? []);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") {
          console.error("Failed to load technologies", e);
        }
      } finally {
        setLoadingTechnologies(false);
      }
    })();

    return () => controller.abort();
  }, [form.typology, form.brand]);

  // Handle form changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      // normalizzo numerici
      if (
        name === "length" ||
        name === "width" ||
        name === "height" ||
        name === "lengthTolerance" ||
        name === "widthTolerance" ||
        name === "heightTolerance"
      ) {
        const parsedValue = value.replace(/\D/g, "");
        setForm((prev) => ({ ...prev, [name]: parsedValue }));
        return;
      }

      // mapping per "Tutte le marche/tecnologie" -> ""
      if (name === "brand") {
        const nextBrand = value === ALL_BRANDS_LABEL ? "" : value;
        setForm((prev) => ({
          ...prev,
          brand: nextBrand,
          technology: "", // reset tecnologia quando cambia brand
        }));
        return;
      }

      if (name === "technology") {
        const nextTech = value === ALL_TECHS_LABEL ? "" : value;
        setForm((prev) => ({ ...prev, technology: nextTech }));
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
    setBrands([]);
    setTechnologies([]);
  };

  const searchDisabled = useMemo(() => !form.typology, [form.typology]);

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
        {/* Tipologia + Brand + Technology */}
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
          <TextSelector
            id="typology"
            label="Tipologia *"
            onChange={handleChange}
            value={form.typology}
            options={(typologies ?? []).map((x) => x.value)}
            disabledOptionText="Seleziona tipologia"
          />

          <TextSelector
            id="brand"
            label="Marca"
            onChange={handleChange}
            value={form.brand || ALL_BRANDS_LABEL} // mostra label quando è ""
            options={[ALL_BRANDS_LABEL, ...(brands ?? []).map((x) => x.value)]}
            disabledOptionText="Seleziona marchio"
            disabled={!form.typology || loadingBrands}
          />

          <TextSelector
            id="technology"
            label="Tecnologia"
            onChange={handleChange}
            value={form.technology || ALL_TECHS_LABEL} // mostra label quando è ""
            options={[ALL_TECHS_LABEL, ...(technologies ?? []).map((x) => x.value)]}
            disabledOptionText="Seleziona tecnologia"
            disabled={!form.typology || loadingTechnologies}
          />
        </div>

        {/* Dimension Inputs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <NumericSelector id="length" label="Lunghezza (mm)" value={form.length} onChange={handleChange} />
          <NumericSelector id="width" label="Larghezza (mm)" value={form.width} onChange={handleChange} />
          <NumericSelector id="height" label="Altezza (mm)" value={form.height} onChange={handleChange} />

          <NumericSelector id="lengthTolerance" label="Tolleranza ± Lungh. (mm)" value={form.lengthTolerance} onChange={handleChange} />
          <NumericSelector id="widthTolerance" label="Tolleranza ± Larg. (mm)" value={form.widthTolerance} onChange={handleChange} />
          <NumericSelector id="heightTolerance" label="Tolleranza ± Alt. (mm)" value={form.heightTolerance} onChange={handleChange} />
        </div>

        {/* Polarità */}
        <div className="flex flex-col">
          <label htmlFor="positivePolarity" className="block text-lg font-medium  mb-4 text-center">
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

        {/* Ampere Interval */}
        <TextSelector
          id="ahInterval"
          label="Ampere"
          value={form.ahInterval}
          onChange={handleChange}
          options={amperesOptions}
          disabledOptionText="Seleziona intervallo"
        />

        {/* Action Buttons */}
        <ActionButtons loading={loading} onReset={resetFilters} disabled={searchDisabled} />
      </form>

      {/* Results */}
      <ResultsSection results={results} loading={loading} />
      <div className="text-sm text-black mt-2">* campo obbligatorio</div>
    </div>
  );
}
