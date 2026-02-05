# Langfuse Observability Implementation Plan

## Overview

Add LLM observability to the Tenex backend using **Langfuse Cloud**. The integration captures all LLM calls (OpenAI, Anthropic, Google) made through the Vercel AI SDK via OpenTelemetry.

## Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│   Your Backend      │         │   Langfuse Cloud     │
│                     │  HTTPS  │                      │
│  ┌───────────────┐  │ traces  │  Traces / Analytics  │
│  │ Langfuse SDK  │──┼────────►│  Cost Tracking       │
│  │ (OTel spans)  │  │         │  Evaluation UI       │
│  └───────────────┘  │         │                      │
│                     │         │  cloud.langfuse.com  │
│  Existing LLM code  │         │                      │
└─────────────────────┘         └──────────────────────┘
```

The SDK runs inside your backend process and sends trace data to Langfuse Cloud over HTTPS. No additional infrastructure required.

## LLM Integration Points

| Function | File | Purpose |
|----------|------|---------|
| `generateLLMText()` | `backend/lib/llm/llm.ts` | Chat text generation with RAG |
| `streamLLMText()` | `backend/lib/llm/llm.ts` | Streaming chat responses |
| `generateWorkflowIntent()` | `backend/lib/llm/llmWithTools.ts` | Classify workflow user intent |
| `generateWorkflowToolCalls()` | `backend/lib/llm/llmWithTools.ts` | Generate tool calls for workflows |
| `generateWorkflowStepToolUsage()` | `backend/lib/llm/llmWithTools.ts` | Classify tool usage per step |
| `generateWorkflowStepPlan()` | `backend/lib/llm/llmWithTools.ts` | Generate step plans |

---

## Phase 1: Langfuse Cloud Setup

1. Sign up at https://cloud.langfuse.com
2. Create a new project (e.g., "Tenex")
3. Go to **Settings → API Keys → Create new API keys**
4. Copy the **Public Key** (`pk-lf-...`) and **Secret Key** (`sk-lf-...`)
5. Note the **Base URL** (either `https://cloud.langfuse.com` for EU or `https://us.cloud.langfuse.com` for US)

---

## Phase 2: Backend SDK Integration

### 2.1 Install Dependencies

```bash
cd backend
npm install @langfuse/tracing @langfuse/otel @opentelemetry/sdk-node
```

### 2.2 Add Environment Variables

Add to `backend/.env`:

```bash
# Langfuse
LANGFUSE_SECRET_KEY=sk-lf-your-secret-key
LANGFUSE_PUBLIC_KEY=pk-lf-your-public-key
LANGFUSE_BASE_URL=https://us.cloud.langfuse.com
```

### 2.3 Create Instrumentation File

Create `backend/lib/langfuse/instrumentation.ts`:

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

const spanProcessor = new LangfuseSpanProcessor();

const sdk = new NodeSDK( {
    spanProcessors: [ spanProcessor ]
} );

sdk.start();

export { spanProcessor };
```

### 2.4 Update Entry Point

Update `backend/index.ts` to import instrumentation **first**:

```typescript
// MUST be first import
import './lib/langfuse/instrumentation';

import { app } from './server';
import { Log } from './utils';
import { closePostGraphile } from './lib/postGraphile';
import { spanProcessor } from './lib/langfuse/instrumentation';

// ... existing server.listen() code ...

process.on( 'SIGINT', async () => {
    await spanProcessor.forceFlush();
    await closePostGraphile();
    server.close( () => process.exit( 128 + 2 ) );
} );

process.on( 'SIGTERM', async () => {
    await spanProcessor.forceFlush();
    await closePostGraphile();
    server.close( () => process.exit( 128 + 15 ) );
} );
```

### 2.5 Enable Telemetry on LLM Calls

Add `experimental_telemetry` to every `generateText` and `streamText` call:

**`backend/lib/llm/llm.ts`** — `generateLLMText()`:
```typescript
const result = await generateText( {
    model
    , prompt: augmentedPrompt
    , maxOutputTokens: params.maxTokens ?? 2000
    , temperature: params.temperature ?? 0.7
    , experimental_telemetry: {
        isEnabled: true
        , functionId: 'generateLLMText'
        , metadata: {
            modelId: params.modelId
            , useRAG: String( useRAG )
            , sourcesCount: String( sources.length )
        }
    }
} );
```

**`backend/lib/llm/llm.ts`** — `streamLLMText()`:
```typescript
const result = streamText( {
    model
    , prompt: augmentedPrompt
    , maxOutputTokens: params.maxTokens ?? 2000
    , temperature: params.temperature ?? 0.7
    , experimental_telemetry: {
        isEnabled: true
        , functionId: 'streamLLMText'
        , metadata: {
            modelId: params.modelId
            , useRAG: String( useRAG )
            , sourcesCount: String( sources.length )
        }
    }
} );
```

**`backend/lib/llm/llmWithTools.ts`** — all 4 functions get the same pattern:
```typescript
// generateWorkflowIntent
experimental_telemetry: {
    isEnabled: true
    , functionId: 'generateWorkflowIntent'
    , metadata: { workflowName: params.workflowName, modelId: params.modelId }
}

// generateWorkflowToolCalls
experimental_telemetry: {
    isEnabled: true
    , functionId: 'generateWorkflowToolCalls'
    , metadata: { workflowName: params.workflowName, modelId: params.modelId }
}

// generateWorkflowStepToolUsage
experimental_telemetry: {
    isEnabled: true
    , functionId: 'generateWorkflowStepToolUsage'
    , metadata: { workflowName: params.workflowName, modelId: params.modelId, stepsCount: String( params.steps.length ) }
}

// generateWorkflowStepPlan
experimental_telemetry: {
    isEnabled: true
    , functionId: 'generateWorkflowStepPlan'
    , metadata: { workflowName: params.workflowName, modelId: params.modelId }
}
```

---

## Phase 3: User/Session Context (Optional Enhancement)

### 3.1 Create Tracing Helper

Create `backend/lib/langfuse/tracing.ts`:

```typescript
import { observe, updateActiveTrace } from '@langfuse/tracing';

export interface TraceContext {
    userId?: string;
    sessionId?: string;
    chatId?: string;
    workflowId?: string;
}

/**
 * update the active Langfuse trace with user/session context
 */
export const setTraceContext = ( context: TraceContext ) => {
    updateActiveTrace( {
        userId: context.userId
        , sessionId: context.sessionId ?? context.chatId
        , metadata: {
            chatId: context.chatId
            , workflowId: context.workflowId
        }
    } );
};

/**
 * wrap a handler with Langfuse tracing
 */
export const withTracing = <T>( name: string, fn: () => Promise<T> ): Promise<T> => {
    return observe( fn, { name } )();
};
```

### 3.2 Use in Message Handler

In `backend/app/messages/messages.helper.ts`, before calling `generateLLMText`:

```typescript
import { setTraceContext } from '../../lib/langfuse/tracing';

setTraceContext( {
    userId: context.userId
    , chatId: context.chatId
} );
```

---

## Phase 4: Verify

1. Start backend: `npm run dev`
2. Make a chat request through the API or frontend
3. Open Langfuse Cloud dashboard
4. Navigate to **Traces** — you should see your LLM calls with:
   - Input/output for each generation
   - Token usage and estimated costs
   - Latency breakdown
   - Model used for each call
   - Custom metadata (functionId, modelId, etc.)

---

## Summary of Changes

| File | Change |
|------|--------|
| `backend/package.json` | Add `@langfuse/tracing`, `@langfuse/otel`, `@opentelemetry/sdk-node` |
| `backend/.env` | Add `LANGFUSE_SECRET_KEY`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_BASE_URL` |
| `backend/lib/langfuse/instrumentation.ts` | **New** — OpenTelemetry + Langfuse span processor init |
| `backend/lib/langfuse/tracing.ts` | **New** — Optional user/session context helper |
| `backend/index.ts` | Import instrumentation first, add `forceFlush` to shutdown |
| `backend/lib/llm/llm.ts` | Add `experimental_telemetry` to 2 functions |
| `backend/lib/llm/llmWithTools.ts` | Add `experimental_telemetry` to 4 functions |

---

## Future: Self-Hosted Option

If you want to self-host later for the reviewer, the only change is:
- Deploy Langfuse via Docker Compose or on AWS (ECS + RDS + ElastiCache + S3)
- Update `LANGFUSE_BASE_URL` to point at your self-hosted instance
- All SDK code stays identical

## Resources

- [Langfuse + Vercel AI SDK Integration](https://langfuse.com/integrations/frameworks/vercel-ai-sdk)
- [Langfuse Observability Docs](https://langfuse.com/docs/observability/get-started)
- [Langfuse Cloud](https://cloud.langfuse.com)
