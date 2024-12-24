import { useEffect, useState } from "react";

export const useMountQuery = (
  endpoint: string,
  query: Record<string, string> = {}
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<string[]>([]);

  const queryJson = JSON.stringify(query);

  useEffect(() => {
    const abort = new AbortController();

    const fetchFunction = async () => {
      const queryParams = new URLSearchParams(query).toString();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryJson, endpoint]);

  return { data, isLoading };
};
