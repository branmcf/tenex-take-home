export interface Source {
  url: string;
  title: string;
  description?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  sources?: Source[];
}

export interface SearchResultItemData {
  id: string;
  title: string | null;
  snippet?: string;
  updatedAt: Date;
}
