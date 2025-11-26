export interface CypherQueryRequest {
  query: string;
}

export interface CypherQueryResult {
  [key: string]: any;
}

export interface CypherQueryResponse {
  status: string;
  results: CypherQueryResult[];
}