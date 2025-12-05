export interface CypherQueryRequest {
  query: string;
}

export interface CypherQueryResult {
  [key: string]: any;
}

export interface CypherSummary {
  query: string;
  recordCount: number;
  columns: string[];
}

export interface GraphNode {
  id: string | number;
  labels: string[];
  properties: Record<string, any>;
}

export interface GraphRelationship {
  id: string | number;
  type: string;
  startNode: string | number;
  endNode: string | number;
  properties: Record<string, any>;
}

export interface Stats {
  nodeCount: number;
  relationshipCount: number;
  nodeLabels: Record<string, number>;
  relationshipTypes: Record<string, number>;
}

export interface CypherGraphData {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
  stats: Stats;
}

export interface CypherTableRow {
  [key: string]: any;
}

export interface CypherTextRow {
  [key: string]: string;
}

export interface CypherQueryResponse {
  status: string;
  summary: CypherSummary;
  graph: CypherGraphData;
  table: CypherTableRow[];
  text: CypherTextRow[];
}

export type ViewMode = 'table' | 'graph' | 'raw';