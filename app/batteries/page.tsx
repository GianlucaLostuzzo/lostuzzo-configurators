"use client";
import { useMountQuery } from "@/hooks/useMountQuery";
import { useState } from "react";

export default function Configurator() {
  const [form, setForm] = useState({
    typology: "",
    ahInterval: "",
    length: "",
    width: "",
    height: "",
    positivePolarity: "SX",
    lengthTolerance: "10",
    widthTolerance: "10",
    heightTolerance: "10",
  });
  const { data: typologies } = useMountQuery(
    "/api/batteries/get-all-typologies"
  );
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const queryParams = new URLSearchParams(form).toString();

    try {
      console.log(queryParams);
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Battery Configurator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Typology Select */}
        <div>
          <label htmlFor="typology" className="block font-medium text-gray-700">
            Typology
          </label>
          <select
            id="typology"
            name="typology"
            value={form.typology}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select typology
            </option>
            {typologies.map((typology) => (
              <option key={typology} value={typology}>
                {typology}
              </option>
            ))}
          </select>
        </div>

        {/* AH Interval */}
        <div>
          <label
            htmlFor="ahInterval"
            className="block font-medium text-gray-700"
          >
            AH Interval
          </label>
          <input
            type="number"
            id="ahInterval"
            name="ahInterval"
            value={form.ahInterval}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Length */}
        <div>
          <label htmlFor="length" className="block font-medium text-gray-700">
            Length
          </label>
          <input
            type="number"
            id="length"
            name="length"
            value={form.length}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Width */}
        <div>
          <label htmlFor="width" className="block font-medium text-gray-700">
            Width
          </label>
          <input
            type="number"
            id="width"
            name="width"
            value={form.width}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Height */}
        <div>
          <label htmlFor="height" className="block font-medium text-gray-700">
            Height
          </label>
          <input
            type="number"
            id="height"
            name="height"
            value={form.height}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Positive Polarity */}
        <div>
          <label
            htmlFor="positivePolarity"
            className="block font-medium text-gray-700"
          >
            Positive Polarity
          </label>
          <select
            id="positivePolarity"
            name="positivePolarity"
            value={form.positivePolarity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="SX">SX</option>
            <option value="DX">DX</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Results */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Results</h2>
        {results.length > 0 ? (
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {results.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        ) : (
          !loading && <p className="mt-2 text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
