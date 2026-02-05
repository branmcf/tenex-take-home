# Frontend-Backend Integration Best Practices

This document outlines the standard approach for connecting frontend components to backend APIs in this codebase.

## Architecture Overview

```
Backend API
    ↓
Shared HTTP Client (axios)
    ↓
Endpoint-Specific API Functions (lib/api/*)
    ↓
React Hooks (hooks/*)
    ↓
Context Providers (contexts/*)
    ↓
Components
```

---

## 1. Never Use Raw `fetch` or String Literals

### ❌ Bad
```typescript
// DON'T: Hand-rolled fetch calls in components
const response = await fetch("http://localhost:3026/api/models", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
});
```

### ✅ Good
```typescript
// DO: Use the shared API client
import { getModels } from "@/lib/api";
const models = await getModels();
```

**Why:**
- No code duplication
- Centralized error handling
- Easier to add auth tokens, logging, retry logic
- Type safety
- Consistent configuration

---

## 2. HTTP Methods as Constants

### File: `frontend/src/lib/constants.ts`

```typescript
export const HttpMethod = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
} as const;

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3026";
```

**Why:**
- Type safety (autocomplete, compile-time checks)
- Single source of truth
- Easy to find all usages
- Prevents typos

---

## 3. Shared HTTP Client

### File: `frontend/src/lib/api-client.ts`

```typescript
import axios from "axios";
import { API_BASE_URL } from "./constants";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for auth
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth tokens, logging, etc.
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401, 403, 500 globally
        if (error.response?.status === 401) {
            // Redirect to login or refresh token
        }
        return Promise.reject(error);
    }
);
```

**Features:**
- Base URL configuration
- Automatic JSON parsing
- Request/response interceptors
- Cookie support for authentication
- Global error handling

**Why axios over fetch:**
- Automatic JSON parsing (`response.data` vs `await response.json()`)
- Better error handling (throws on non-2xx, fetch doesn't)
- Request/response interceptors (for auth, logging, retries)
- Request cancellation support
- Cleaner API for common patterns

---

## 4. Endpoint-Specific API Functions

### File: `frontend/src/lib/api/models.ts`

```typescript
import { apiClient } from "../api-client";
import type { Model } from "@/components/chat/types";

interface GetModelsResponse {
    models: Model[];
}

/**
 * Fetches all active models from the API.
 * @returns Array of available models
 */
export async function getModels(): Promise<Model[]> {
    const response = await apiClient.get<GetModelsResponse>("/api/models");
    return response.data.models;
}
```

### File: `frontend/src/lib/api/index.ts`

```typescript
// Barrel export for clean imports
export * from "./models";
export * from "./workflows"; // future
export * from "./chats";     // future
```

**Pattern:**
- One file per resource (models, workflows, chats, etc.)
- Each function handles one endpoint
- Type the request and response
- Extract and return the data
- Add JSDoc comments

**Why:**
- Single responsibility
- Easy to test
- Type-safe
- Reusable across hooks and components
- Clear API surface

---

## 5. React Hooks for Data Fetching

### File: `frontend/src/hooks/useModels.ts`

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Model } from "@/components/chat/types";
import { getModels } from "@/lib/api";

interface UseModelsReturn {
    models: Model[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useModels(): UseModelsReturn {
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchModels = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getModels();
            setModels(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch models"));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchModels();
    }, [fetchModels]);

    return {
        models,
        isLoading,
        error,
        refetch: fetchModels,
    };
}
```

**Pattern:**
- State for data, loading, error
- useCallback for fetch function
- useEffect for initial fetch
- Return data, loading, error, refetch

**Why:**
- Consistent pattern across all hooks
- Handles loading states
- Error handling
- Refetch capability
- React-friendly

---

## 6. Context Providers Expose Data

### File: `frontend/src/contexts/ChatContext.tsx`

```typescript
interface ChatContextValue {
  // Data from hooks
  models: Model[];
  workflows: Workflow[];

  // ... other state
}

export function ChatProvider({ children, models, workflows, ... }: ChatProviderProps) {
  const value = React.useMemo(
    () => ({
      models,
      workflows,
      // ... other values
    }),
    [models, workflows, ...]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
```

**Pattern:**
- Props receive data from hooks
- Context exposes data to children
- useMemo for performance

**Why:**
- Centralized state
- Prevents prop drilling
- Easy to add global state

---

## 7. Page Components Fetch Data

### File: `frontend/src/components/layout/ChatPageLayout.tsx`

```typescript
export function ChatPageLayout({ initialChatId }: ChatPageLayoutProps) {
  const { models } = useModels();

  return (
    <ChatProvider models={models} workflows={MOCK_WORKFLOWS} ...>
      <SidebarProvider className="h-svh">
        <AppSidebar />
        <ChatContent />
      </SidebarProvider>
    </ChatProvider>
  );
}
```

**Pattern:**
- Page/layout components use hooks to fetch data
- Pass data to context providers
- Let child components consume from context

**Why:**
- Data fetching at the boundary
- Components stay presentational
- Easy to mock in tests

---

## 8. Components Consume from Context

### File: `frontend/src/components/chat/ChatContainer.tsx`

```typescript
export function ChatContainer({ className }: ChatContainerProps) {
  const { models, workflows, ... } = useChatContext();

  return (
    <ChatInput
      models={models}
      workflows={workflows}
      ...
    />
  );
}
```

**Pattern:**
- Components get data from context
- Never import mock data
- Never make direct API calls

**Why:**
- Separation of concerns
- Testable (mock context)
- Reusable

---

## Complete Flow Example: Adding a New Resource

Let's say you want to add a `GET /api/workflows` endpoint.

### Step 1: Create API function
**File:** `frontend/src/lib/api/workflows.ts`
```typescript
import { apiClient } from "../api-client";

export interface Workflow {
    id: string;
    name: string;
    description: string;
}

interface GetWorkflowsResponse {
    workflows: Workflow[];
}

export async function getWorkflows(): Promise<Workflow[]> {
    const response = await apiClient.get<GetWorkflowsResponse>("/api/workflows");
    return response.data.workflows;
}
```

### Step 2: Export from barrel
**File:** `frontend/src/lib/api/index.ts`
```typescript
export * from "./models";
export * from "./workflows"; // Add this
```

### Step 3: Create React hook
**File:** `frontend/src/hooks/useWorkflows.ts`
```typescript
import { useState, useEffect, useCallback } from "react";
import { getWorkflows } from "@/lib/api";
import type { Workflow } from "@/lib/api/workflows";

interface UseWorkflowsReturn {
    workflows: Workflow[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useWorkflows(): UseWorkflowsReturn {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchWorkflows = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getWorkflows();
            setWorkflows(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch workflows"));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkflows();
    }, [fetchWorkflows]);

    return { workflows, isLoading, error, refetch: fetchWorkflows };
}
```

### Step 4: Update context
**File:** `frontend/src/contexts/ChatContext.tsx`
```typescript
// Add to ChatContextValue interface
interface ChatContextValue {
  workflows: Workflow[];
  // ...
}

// Add to ChatProvider props
interface ChatProviderProps {
  workflows: Workflow[];
  // ...
}

// Expose in useMemo
const value = React.useMemo(
  () => ({
    workflows,
    // ...
  }),
  [workflows, ...]
);
```

### Step 5: Use hook in page component
**File:** `frontend/src/components/layout/ChatPageLayout.tsx`
```typescript
export function ChatPageLayout({ initialChatId }: ChatPageLayoutProps) {
  const { models } = useModels();
  const { workflows } = useWorkflows(); // Add this

  return (
    <ChatProvider models={models} workflows={workflows} ...>
      {/* ... */}
    </ChatProvider>
  );
}
```

### Step 6: Consume in components
**File:** `frontend/src/components/chat/ChatContainer.tsx`
```typescript
export function ChatContainer() {
  const { workflows } = useChatContext(); // Already available

  // Use workflows...
}
```

---

## Common Patterns

### Mutation (POST/PUT/DELETE)

```typescript
// API function
export async function createWorkflow(data: CreateWorkflowInput): Promise<Workflow> {
    const response = await apiClient.post<Workflow>("/api/workflows", data);
    return response.data;
}

// Hook
export function useCreateWorkflow() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = useCallback(async (data: CreateWorkflowInput) => {
        setIsLoading(true);
        setError(null);
        try {
            const workflow = await createWorkflow(data);
            return workflow;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Failed to create workflow");
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { create, isLoading, error };
}
```

### With Parameters

```typescript
// API function
export async function getWorkflow(id: string): Promise<Workflow> {
    const response = await apiClient.get<Workflow>(`/api/workflows/${id}`);
    return response.data;
}

// Hook
export function useWorkflow(id: string | null) {
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) {
            setWorkflow(null);
            return;
        }

        let cancelled = false;

        const fetchWorkflow = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getWorkflow(id);
                if (!cancelled) {
                    setWorkflow(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err : new Error("Failed to fetch workflow"));
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchWorkflow();

        return () => {
            cancelled = true;
        };
    }, [id]);

    return { workflow, isLoading, error };
}
```

---

## Checklist for New API Integration

- [ ] Create API function in `lib/api/[resource].ts`
- [ ] Export from `lib/api/index.ts`
- [ ] Create React hook in `hooks/use[Resource].ts`
- [ ] Update context interface to include new data
- [ ] Update context provider to accept and expose data
- [ ] Use hook in page/layout component
- [ ] Pass data to context provider
- [ ] Remove any mock imports from components
- [ ] Verify TypeScript compilation
- [ ] Test error states
- [ ] Test loading states

---

## Anti-Patterns to Avoid

### ❌ Don't: Make API calls directly in components
```typescript
// BAD
function MyComponent() {
  useEffect(() => {
    fetch("/api/models").then(...);
  }, []);
}
```

### ❌ Don't: Import mock data in components
```typescript
// BAD
import { MOCK_MODELS } from "@/lib/mocks";

function MyComponent() {
  return <ModelSelector models={MOCK_MODELS} />;
}
```

### ❌ Don't: Use string literals for HTTP methods
```typescript
// BAD
await apiClient.request({ method: "GET", url: "/api/models" });

// GOOD
await apiClient.get("/api/models");
```

### ❌ Don't: Duplicate error handling logic
```typescript
// BAD - error handling in every component
try {
  await getModels();
} catch (err) {
  if (err.response?.status === 401) {
    router.push("/login");
  }
}

// GOOD - handle in interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      router.push("/login");
    }
    return Promise.reject(error);
  }
);
```

---

## Directory Structure

```
frontend/src/
├── lib/
│   ├── constants.ts          # HttpMethod, API_BASE_URL
│   ├── api-client.ts         # Shared axios instance
│   └── api/
│       ├── index.ts          # Barrel exports
│       ├── models.ts         # Model API functions
│       ├── workflows.ts      # Workflow API functions
│       └── chats.ts          # Chat API functions
├── hooks/
│   ├── useModels.ts          # Model data hook
│   ├── useWorkflows.ts       # Workflow data hook
│   └── useChats.ts           # Chat data hook
├── contexts/
│   ├── ChatContext.tsx       # Provides models, workflows to chat pages
│   └── WorkflowContext.tsx   # Provides workflow-specific data
└── components/
    ├── layout/
    │   ├── ChatPageLayout.tsx      # Fetches data with hooks
    │   └── WorkflowsPageLayout.tsx # Fetches data with hooks
    └── chat/
        └── ChatContainer.tsx       # Consumes from context
```

---

## Summary

**The Golden Rule:** Components consume, hooks fetch, API functions call, client handles.

1. **Components** consume data from context (never import mocks, never make API calls)
2. **Hooks** fetch data and manage loading/error state
3. **API functions** are thin wrappers around apiClient
4. **apiClient** is the single HTTP client with interceptors
5. **Page components** use hooks and pass data to providers
6. **Context providers** distribute data to children

This pattern ensures:
- Type safety
- Code reusability
- Consistent error handling
- Easy testing
- Clear separation of concerns
