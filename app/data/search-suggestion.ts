import type { SuggestionResponse, SuggestionErrorResponse } from '~/types/search-suggestion';

export const useSearchSuggestion = () => {
  const config = useRuntimeConfig();

  const fetchSuggestions = async (q: string): Promise<SuggestionResponse> => {
    const url = `${config.public.apiBase}/search/suggestions?q=${encodeURIComponent(q)}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody: SuggestionErrorResponse = await response.json();
      const error = new Error(errorBody.detail?.[0]?.msg || 'Failed to fetch suggestions');
      (error as any).detail = errorBody.detail;
      throw error;
    }

    return await response.json();
  };

  return { fetchSuggestions };
};