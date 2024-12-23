import { useEffect, useState } from "react";

export const useMountQuery = (
  endpoint: string,
  query: Record<string, string> = {}
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<string[]>([]);

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
        return response.json();
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") {
          return undefined;
        } else {
          throw e;
        }
      }
    };

    fetchFunction().then((data) => {
      setIsLoading(!data);
      if (data) {
        setData(data);
      }
    });

    return () => {
      abort.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading };
};
