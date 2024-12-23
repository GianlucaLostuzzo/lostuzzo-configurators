"use client";

import { useState, useEffect } from "react";
import { useMountQuery } from "@/hooks/useMountQuery";
import TextSelector from "@/components/TextSelector";
import PageTitle from "@/components/PageTitle";
import ActionsButtons from "@/components/ActionButtons";

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

  const fetchOptions = async (
    field: string,
    params: Record<string, string>
  ) => {
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
  };

  const resetAll = () => {
    setForm((prev) => ({
      ...prev,
      gradation: "",
      format: "",
      brand: "",
      specs: "",
      oemBrand: "",
      oemCertify: "",
    }));
    setGradationOptions([]);
    setFormatOptions([]);
    setBrandOptions([]);
    setSpecsOptions([]);
    setOemBrandOptions([]);
    setOemCertifyOptions([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const resetFields: Record<string, string[]> = {
      type: ["gradation", "format", "brand", "specs", "oemBrand", "oemCertify"],
      gradation: ["format", "brand", "specs", "oemBrand", "oemCertify"],
      format: ["brand", "specs", "oemBrand", "oemCertify"],
      brand: ["specs", "oemBrand", "oemCertify"],
      specs: ["oemBrand", "oemCertify"],
      oemBrand: ["oemCertify"],
      oemCertify: [],
    };

    resetFields[name].forEach((field) => {
      setForm((prev) => ({ ...prev, [field]: "" }));
      if (field === "gradation") setGradationOptions([]);
      if (field === "format") setFormatOptions([]);
      if (field === "brand") setBrandOptions([]);
      if (field === "specs") setSpecsOptions([]);
      if (field === "oemBrand") setOemBrandOptions([]);
      if (field === "oemCertify") setOemCertifyOptions([]);
    });

    if (value !== "all") {
      const params: Record<string, string> = { ...form, [name]: value };
      const nextField = resetFields[name][0];
      if (nextField) fetchOptions(nextField, params);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const queryParams = new URLSearchParams(
      Object.entries(form)
        .filter(([_, value]) => value)
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
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageTitle>Configuratore Oli Lubrificanti</PageTitle>

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
          disabled={!form.gradation && !form.type}
        />

        <TextSelector
          id="brand"
          label="Marca"
          value={form.brand}
          onChange={handleChange}
          options={brandOptions}
          disabledOptionText="Seleziona una marca"
          disabled={!form.gradation && !form.type && !form.format}
        />

        <TextSelector
          id="specs"
          label="Specifiche"
          value={form.specs}
          onChange={handleChange}
          options={specsOptions}
          disabledOptionText="Seleziona specifiche"
          disabled={
            !form.gradation && !form.type && !form.format && !form.brand
          }
        />

        <TextSelector
          id="oemBrand"
          label="Marca OEM"
          value={form.oemBrand}
          disabledOptionText="Seleziona una marca OEM"
          onChange={handleChange}
          options={oemBrandOptions}
          disabled={
            !form.gradation &&
            !form.type &&
            !form.format &&
            !form.brand &&
            !form.specs
          }
        />

        <TextSelector
          id="oemCertify"
          label="Certificazione OEM"
          disabledOptionText="Seleziona una certificazione OEM"
          value={form.oemCertify}
          onChange={handleChange}
          options={oemCertifyOptions}
          disabled={
            !form.gradation &&
            !form.type &&
            !form.format &&
            !form.brand &&
            !form.specs &&
            !form.oemBrand
          }
        />

        {/* Action Buttons */}
        <ActionsButtons
          loading={loading}
          disabled={!form.type}
          onReset={resetAll}
        />
      </form>

      {/* Results */}
      {results && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center text-primary mb-6">
            Risultati
          </h2>
          {results.length > 0 ? (
            <ul className="mt-4 list-disc pl-10 space-y-2 text-gray-700">
              {results.map((code, i) => (
                <li key={`result_${code}_${i}`} className="text-lg">
                  {code}
                </li>
              ))}
            </ul>
          ) : (
            !loading && (
              <p className="mt-4 text-gray-500 text-center text-lg">
                No results found.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
