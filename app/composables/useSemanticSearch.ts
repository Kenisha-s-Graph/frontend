import type { SemanticSearchRequest, SemanticSearchResponse } from '~/types/semantic-search';

export const useSemanticSearch = () => {
  const config = useRuntimeConfig();

  const fetchSemanticSearch = async (data: SemanticSearchRequest): Promise<SemanticSearchResponse> => {
    const url = `${config.public.apiBase}/vector/semantic-search`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const error = new Error(errorBody.detail || 'Failed to fetch semantic search results');
      (error as any).detail = errorBody.detail;
      throw error;
    }

    return await response.json();
  };

  return { fetchSemanticSearch };
};