export interface SearchSuggestion {
  id: string;
  name: string;
  type: 'person' | 'event';
}

export interface PersonResult {
  id: string;
  full_name: string;
  description: string;
  image_url: string;
  country: string;
  position: string;
}

export interface EventResult {
  id: string;
  name: string;
  description: string;
  image_url: string;
  country: string;
  impact: string;
}

export type SearchResult = PersonResult | EventResult;

export interface SearchResponse {
  status: string;
  results: {
    persons: PersonResult[];
    events: EventResult[];
  };
}