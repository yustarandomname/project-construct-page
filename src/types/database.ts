export interface Properties {
  name: string;
  index?: number;
  importance?: number;
  permissions?: string[];
  topFeatures?: string[];
}

export interface Content {
  title: string;
  description: string;
  image?: string;
  author?: string;
  url?: string;
  type: "link" | "text" | "image" | "none";
}

export interface Page {
  name: string;
  children: number;
  content?: Content[];
  properties?: Properties;
}
