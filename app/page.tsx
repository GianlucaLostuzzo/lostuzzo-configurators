"use client";

import { useEffect, useState } from "react";

const fetchData = async (
  controller: AbortController,
  onSuccess: (d: string[]) => void
) => {
  const response = await fetch("/api/auto-mats/get-all-brands", {
    method: "GET",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = (await response.json()) as string[];
  onSuccess(data);
};

export default function Home() {
  const [apiData, setApiData] = useState<string[] | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    fetchData(abortController, (data) => setApiData(data));

    return () => {
      abortController.abort();
    };
  }, []);

  if (!apiData) {
    return <h1>Nothing to show</h1>;
  }

  return (
    <div>
      <div className="d-flex flex flex-row flex-wrap gap-5">
        {apiData.map((e, i) => (
          <div key={i} className="text-3xl text-slate-800 font-bold">
            {e}
          </div>
        ))}
      </div>
    </div>
  );
}
