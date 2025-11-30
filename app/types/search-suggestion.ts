export interface SuggestionItem {
  element_id: string;
  text: string;
  type: 'person' | 'event';
}

export interface SuggestionResponse {
  suggestions: SuggestionItem[];
}

export interface SuggestionErrorDetail {
  type: string;
  loc: string[];
  msg: string;
  input: string;
  ctx?: Record<string, any>;
}

export interface SuggestionErrorResponse {
  detail: SuggestionErrorDetail[];
}