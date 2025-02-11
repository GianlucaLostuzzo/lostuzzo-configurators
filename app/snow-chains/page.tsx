"use client";

import { useCallback, useEffect, useState } from "react";
import { useMountQuery } from "@/hooks/use-mount-query";
import ActionButtons from "@/components/action-button";
import PageTitle from "@/components/page-title";
import ResultsSection from "@/components/results-section";
import TextSelector from "@/components/text-selector";
import { ApiProductResult } from "@/lib/types";

export default function SnowChainsConfigurator() {
  const [form, setForm] = useState({
    width: "",
    ratio: "",
    diameter: "",
    typology: "",
  });

  const { data: widthOptions } = useMountQuery(
    "/api/snow-chains/get-all-widths"
  );

  const [ratioOptions, setRatioOptions] = useState<string[]>([]);
  const [diameterOptions, setDiameterOptions] = useState<string[]>([]);
  const [typologyOptions, setTypologyOptions] = useState<string[]>([]);

  const [results, setResults] = useState<Array<ApiProductResult> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (form.width) {
      fetch(`/api/snow-chains/get-ratios?width=${form.width}`)
        .then((res) => res.json())
        .then((data) => {
          setRatioOptions(data);
          setForm((prev) => ({
            ...prev,
            ratio: "",
            diameter: "",
            typology: "",
          }));
          setDiameterOptions([]);
          setTypologyOptions([]);
        });
    }
  }, [form.width]);

  useEffect(() => {
    if (form.width && form.ratio) {
      fetch(
        `/api/snow-chains/get-diameters?width=${form.width}&ratio=${form.ratio}`
      )
        .then((res) => res.json())
        .then((data) => {
          setDiameterOptions(data);
          setForm((prev) => ({
            ...prev,
            diameter: "",
            typology: "",
          }));
          setTypologyOptions([]);
        });
    }
  }, [form.width, form.ratio]);

  useEffect(() => {
    if (form.width && form.ratio && form.diameter) {
      fetch(
        `/api/snow-chains/get-typology?width=${form.width}&ratio=${form.ratio}&diameter=${form.diameter}`
      )
        .then((res) => res.json())
        .then((data) => {
          setTypologyOptions(data);
          setForm((prev) => ({ ...prev, typology: "" }));
        });
    }
  }, [form.width, form.ratio, form.diameter]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const queryParams = new URLSearchParams(
        Object.entries(form)
          .filter(([, value]) => value)
          .map(([key, value]) => [key, value])
      ).toString();

      try {
        const response = await fetch(`/api/snow-chains/search?${queryParams}`);

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
    setForm({
      width: "",
      ratio: "",
      diameter: "",
      typology: "",
    });
    setDiameterOptions([]);
    setRatioOptions([]);
    setTypologyOptions([]);
    setResults(null);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageTitle>Catene da Neve</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextSelector
          id="width"
          label="Larghezza"
          value={form.width}
          disabledOptionText="Seleziona larghezza"
          onChange={handleChange}
          options={widthOptions}
        />

        <TextSelector
          id="ratio"
          label="Spalla"
          value={form.ratio}
          disabledOptionText="Seleziona spalla"
          onChange={handleChange}
          options={ratioOptions}
          disabled={!form.width}
        />

        <TextSelector
          id="diameter"
          label="Diametro"
          value={form.diameter}
          disabledOptionText="Seleziona diametro"
          onChange={handleChange}
          options={diameterOptions}
          disabled={!form.ratio}
        />

        <TextSelector
          id="typology"
          label="Tipologia"
          value={form.typology}
          disabledOptionText="Seleziona tipologia"
          onChange={handleChange}
          options={typologyOptions}
          disabled={!form.diameter}
        />

        <ActionButtons
          loading={loading}
          disabled={!form.width}
          onReset={resetAll}
        />
      </form>

      <ResultsSection
        results={results}
        loading={loading}
        imageBasePath="ep_snow_chains"
      />
    </div>
  );
}
