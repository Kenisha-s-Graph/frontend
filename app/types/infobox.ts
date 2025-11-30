export interface InfoboxProperty {
  [key: string]: any;
}

export interface RelatedNode {
  element_id: string;
  relationship: string;
  labels: string[];
  properties: InfoboxProperty;
}

export interface InfoboxResponse {
  status: string;
  element_id: string;
  labels: string[];
  properties: InfoboxProperty;
  related_nodes: RelatedNode[];
}

export interface FormattedFact {
  label: string;
  value: string;
}

export interface FormattedRelation {
  element_id: string;
  name: string;
  type: string;
  relation: string;
  image: string;
  properties: InfoboxProperty;
}