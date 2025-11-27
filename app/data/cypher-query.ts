import type { CypherQueryRequest, CypherQueryResponse } from "@/types/cypher";

export const useCypherQuery = () => {
  const config = useRuntimeConfig();

  const fetchCypherQuery = async (data: CypherQueryRequest): Promise<CypherQueryResponse> => {
    const fullUrl = `${config.public.apiBase}/explore/cypher`;
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    let result: any = null;
    try {
      result = await response.json();
    } catch {}

    if (!response.ok) {
      const err = new Error(result?.detail || "Failed to fetch cypher query");
      (err as any).detail = result?.detail;
      throw err;
    }

    return result as CypherQueryResponse;
  };

  return { fetchCypherQuery };
};