export interface PersonSearchResult {
  type: 'person';
  element_id: string;
  name: string;
  description: string;
  image: string;
  context: {
    positions: string[];
    primary_position: string;
    country: string;
  };
}

export interface EventSearchResult {
  type: 'event';
  element_id: string;
  name: string;
  description: string;
  image: string;
  context: {
    country: string;
    impact: string;
  };
}

export interface SearchApiResponse {
  query: string;
  persons: {
    data: PersonSearchResult[];
    total_found: number;
  };
  events: {
    data: EventSearchResult[];
    total_found: number;
  };
}