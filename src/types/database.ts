export interface Properties {
  name: string;
  index?: number;
  permissions?: string[];
  topFeatures?: string[];
}

export interface Page {
  name: string;
  children: number;
  content?: Map<string, string>;
  properties?: Properties;
}
