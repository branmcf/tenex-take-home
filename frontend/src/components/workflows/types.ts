export interface WorkflowTool {
  id: string;
  name: string;
  description?: string;
  version?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  prompt: string;
  tools: WorkflowTool[];
  order: number;
}

export interface WorkflowVersion {
  id: string;
  version: number;
  steps: WorkflowStep[];
  createdAt: Date;
}

export interface WorkflowDetail {
  id: string;
  name: string;
  description: string;
  version: number;
  steps: WorkflowStep[];
  lastEditedAt: Date;
  createdAt: Date;
}

export interface WorkflowListItemData {
  id: string;
  name: string;
  description: string;
  version: number;
  lastEditedAt: Date;
}
