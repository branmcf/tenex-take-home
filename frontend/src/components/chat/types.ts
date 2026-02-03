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

export interface Model {
  id: string;
  name: string;
  provider: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  version: number | null;
  updatedAt: string;
}

export interface ChatContainerProps {
  className?: string;
}
