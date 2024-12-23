"use client";

import { useEffect, useState } from "react";
import { useMountQuery } from "@/hooks/useMountQuery";
import ActionButtons from "@/components/ActionButtons";
import PageTitle from "@/components/PageTitle";

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

  const [results, setResults] = useState<string[] | null>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PageTitle>Configuratore Catene da Neve</PageTitle>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Larghezza Select */}
        <div className="flex flex-col">
          <label
            htmlFor="width"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Larghezza
          </label>
          <select
            id="width"
            name="width"
            value={form.width}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
          >
            <option value="" disabled>
              Scegli larghezza
            </option>
            {widthOptions.map((option, i) => (
              <option key={`width_${option}_${i}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Ratio Select */}
        <div className="flex flex-col">
          <label
            htmlFor="ratio"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Spalla
          </label>
          <select
            id="ratio"
            name="ratio"
            value={form.ratio}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            disabled={!form.width}
          >
            <option value="" disabled>
              Seleziona spalla
            </option>
            {ratioOptions.map((option, i) => (
              <option key={`ratio_${option}_${i}}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Diametro Select */}
        <div className="flex flex-col">
          <label
            htmlFor="diameter"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Diametro
          </label>
          <select
            id="diameter"
            name="diameter"
            value={form.diameter}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            disabled={!form.ratio}
          >
            <option value="" disabled>
              Seleziona diametro
            </option>
            {diameterOptions.map((option, i) => (
              <option key={`diameter_${option}_${i}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Tipologia Select */}
        <div className="flex flex-col">
          <label
            htmlFor="typology"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Tipologia
          </label>
          <select
            id="typology"
            name="typology"
            value={form.typology}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            disabled={!form.diameter}
          >
            <option value="" disabled>
              Seleziona tipologia
            </option>
            {typologyOptions.map((option, i) => (
              <option key={`typology_${option}_${i}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <ActionButtons loading={loading} disabled={!form.width} />
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
