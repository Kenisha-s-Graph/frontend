import type { SearchRequest } from '~/types/search';
import type { SearchApiResponse } from '~/types/search-response';

export const useSearch = () => {
  const config = useRuntimeConfig();

  // Fetch search results dengan filter
  const fetchSearchResults = async (data: SearchRequest): Promise<SearchApiResponse> => {
    const url = `${config.public.apiBase}/search`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const error = new Error(errorBody.detail || 'Failed to fetch search results');
      (error as any).detail = errorBody.detail;
      throw error;
    }

    return await response.json();
  };

  return {
    fetchSearchResults
  };
};