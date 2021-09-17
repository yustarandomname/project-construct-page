export interface Properties {
  name: string;
  index?: number;
  permissions?: string[];
  topFeatures?: string[];
}

export interface Content {
  title: string;
  description: string;
  image?: string;
  author?: string;
  url?: string;
}

export interface Page {
  name: string;
  children: number;
  content?: Content[];
  properties?: Properties;
}
