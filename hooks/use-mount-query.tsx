import { ApiFilterResult } from "@/lib/types";
import { useEffect, useState } from "react";

export const useMountQuery = (
  endpoint: string,
  query: Record<string, string> = {}
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ApiFilterResult>({ data: [] });

  const queryParams = new URLSearchParams(query).toString();

  useEffect(() => {
    const abort = new AbortController();

    const fetchFunction = async () => {
      try {
        const response = await fetch(
          `${endpoint}${queryParams && `?${queryParams}`}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            signal: abort.signal,
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") {
          return undefined; // Request was aborted
        } else {
          throw e;
        }
      }
    };

    fetchFunction()
      .then((data) => {
        setIsLoading(false);
        if (data) {
          setData(data);
        }
      })
      .catch((e) => {
        console.error("Error fetching data:", e);
        setIsLoading(false);
      });

    return () => {
      abort.abort();
    };
  }, [queryParams, endpoint]);

  return { data, isLoading };
};
