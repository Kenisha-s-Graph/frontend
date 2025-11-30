export const useInfobox = () => {
  const config = useRuntimeConfig();

  const fetchInfobox = async (id: string) => {
    if (!id || id === 'undefined') {
      throw new Error('Invalid ID provided');
    }

    const encodedId = encodeURIComponent(id);
    const url = `${config.public.apiBase}/infobox/${encodedId}`;
    
    console.log('Fetching infobox from:', url);
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch infobox data: ${response.status}`);
    }

    return await response.json();
  };

  return {
    fetchInfobox
  };
};