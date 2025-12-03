export interface SemanticSearchRequest {
  query: string;
  limit?: number;
}

export interface SemanticPersonResult {
  type: 'person';
  element_id: string;
  name: string;
  description: string;
  image: string | null;
  similarity_score: number;
  context: {
    positions: string[];
    country: string;
    birth_date: string | null;
    death_date: string | null;
  };
}

export interface SemanticEventResult {
  type: 'event';
  element_id: string;
  name: string;
  description: string;
  image: string | null;
  similarity_score: number;
  context: {
    country: string;
    impact: string;
    date: string | null;
  };
}

export interface SemanticSearchResponse {
  query: string;
  search_type: string;
  persons: SemanticPersonResult[];
  events: SemanticEventResult[];
}