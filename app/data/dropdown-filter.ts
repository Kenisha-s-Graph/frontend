import type { DropdownFilterResponse } from '~/types/dropdown-filter';

export const useDropdownFilter = () => {
  const config = useRuntimeConfig();

  const fetchDropdownFilter = async (): Promise<DropdownFilterResponse> => {
    const url = `${config.public.apiBase}/search/filters`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch dropdown filter data');
    }

    return await response.json();
  };

  return { fetchDropdownFilter };
};