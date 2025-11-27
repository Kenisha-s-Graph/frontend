export interface SearchRequest {
  query: string;
  current_person_count: number;
  current_event_count: number;
  search_type: 'all' | 'person' | 'event';
  filter_country?: string[];
  filter_continent?: string[];
}