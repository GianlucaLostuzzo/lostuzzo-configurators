"use client";

import { useCallback, useState } from "react";
import { useMountQuery } from "@/hooks/useMountQuery";
import TextSelector from "@/components/TextSelector";
import PageTitle from "@/components/PageTitle";
import ActionsButtons from "@/components/ActionButtons";
import ResultsSection from "@/components/ResultsSection";

export default function LubricatingOilsConfigurator() {
  const [form, setForm] = useState({
    type: "",
    gradation: "",
    format: "",
    brand: "",
    specs: "",
    oemBrand: "",
    oemCertify: "",
  });

  const { data: typeOptions } = useMountQuery(
    "/api/lubricating-oils/get-all-types"
  );

  const [gradationOptions, setGradationOptions] = useState<string[]>([]);
  const [formatOptions, setFormatOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [specsOptions, setSpecsOptions] = useState<string[]>([]);
  const [oemBrandOptions, setOemBrandOptions] = useState<string[]>([]);
  const [oemCertifyOptions, setOemCertifyOptions] = useState<string[]>([]);

  const [results, setResults] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOptions = useCallback(
    async (field: string, params: Record<string, string>) => {
      const queryParams = new URLSearchParams(params).toString();

      const endpoints: Record<string, string> = {
        gradation: `/api/lubricating-oils/get-gradations?${queryParams}`,
        format: `/api/lubricating-oils/get-formats?${queryParams}`,
        brand: `/api/lubricating-oils/get-brands?${queryParams}`,
        specs: `/api/lubricating-oils/get-specs?${queryParams}`,
        oemBrand: `/api/lubricating-oils/get-oem-brands?${queryParams}`,
        oemCertify: `/api/lubricating-oils/get-oem-certifies?${queryParams}`,
      };

      const response = await fetch(endpoints[field]);
      const data = await response.json();

      const setters: Record<
        string,
        React.Dispatch<React.SetStateAction<string[]>>
      > = {
        gradation: setGradationOptions,
        format: setFormatOptions,
        brand: setBrandOptions,
        specs: setSpecsOptions,
        oemBrand: setOemBrandOptions,
        oemCertify: setOemCertifyOptions,
      };

      setters[field](["all", ...data]);
    },
    []
  );

  const resetAll = useCallback(() => {
    setForm({
      type: "",
      gradation: "",
      format: "",
      brand: "",
      specs: "",
      oemBrand: "",
      oemCertify: "",
    });
    setGradationOptions([]);
    setFormatOptions([]);
    setBrandOptions([]);
    setSpecsOptions([]);
    setOemBrandOptions([]);
    setOemCertifyOptions([]);
    setResults(null);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));

      const resetFields =
        name === "type"
          ? Object.keys(form).filter((x) => x !== "type")
          : Object.entries(form)
              .filter(
                ([key, value]) => value === "" && key !== "type" && key !== name
              )
              .map(([key]) => key);

      if (value !== "all") {
        const params: Record<string, string> = { ...form, [name]: value };
        resetFields.forEach((x) => {
          setForm((prev) => ({ ...prev, [x]: "" }));
          fetchOptions(x, params);
        });
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
        const response = await fetch(
          `/api/lubricating-oils/search?${queryParams}`
        );
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
      <PageTitle>Oli Lubrificanti</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Select */}
        <TextSelector
          id="type"
          label="Tipo"
          value={form.type}
          disabledOptionText="Seleziona un tipo"
          onChange={handleChange}
          options={typeOptions}
        />

        <TextSelector
          id="gradation"
          label="Gradazione"
          value={form.gradation}
          onChange={handleChange}
          options={gradationOptions}
          disabledOptionText="Seleziona un tipo"
          disabled={!form.type}
        />

        <TextSelector
          id="format"
          label="Formato"
          value={form.format}
          onChange={handleChange}
          options={formatOptions}
          disabledOptionText="Seleziona un formato"
          disabled={!form.type}
        />

        <TextSelector
          id="brand"
          label="Marca"
          value={form.brand}
          onChange={handleChange}
          options={brandOptions}
          disabledOptionText="Seleziona una marca"
          disabled={!form.type}
        />

        <TextSelector
          id="specs"
          label="Specifiche"
          value={form.specs}
          onChange={handleChange}
          options={specsOptions}
          disabledOptionText="Seleziona specifiche"
          disabled={!form.type}
        />

        <TextSelector
          id="oemBrand"
          label="Marca OEM"
          value={form.oemBrand}
          disabledOptionText="Seleziona una marca OEM"
          onChange={handleChange}
          options={oemBrandOptions}
          disabled={!form.type}
        />

        <TextSelector
          id="oemCertify"
          label="Certificazione OEM"
          disabledOptionText="Seleziona una certificazione OEM"
          value={form.oemCertify}
          onChange={handleChange}
          options={oemCertifyOptions}
          disabled={!form.type}
        />

        {/* Action Buttons */}
        <ActionsButtons
          loading={loading}
          disabled={!form.type}
          onReset={resetAll}
        />
      </form>

      {/* Results */}
      <ResultsSection results={results} loading={loading} />
    </div>
  );
}
