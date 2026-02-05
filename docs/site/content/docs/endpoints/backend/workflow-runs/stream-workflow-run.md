<h1 class="article-title">Stream Workflow Run <span class="badge-get">GET</span></h1>

---

## Overview

Streams real-time updates for a workflow run execution using Server-Sent Events (SSE).

## Endpoint URL

```
GET /api/chats/:chatId/workflow-runs/:workflowRunId/stream
```

## Endpoint Data

=== "URL Parameters"
    | Parameter | Description | Type | Required |
    |-----------|-------------|------|----------|
    | `chatId` | The chat's unique identifier (UUID) | String | Yes |
    | `workflowRunId` | The workflow run's unique identifier (UUID) | String | Yes |

=== "Query Parameters"
    ```
    This endpoint has no query parameters.
    ```

=== "Body"
    ```
    This endpoint has no request body.
    ```

## Example Request

```bash
curl -X GET "http://localhost:3026/api/chats/chat-uuid/workflow-runs/run-uuid/stream" \
  -H "Accept: text/event-stream" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Example Response

The response is a Server-Sent Events (SSE) stream:

```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"type":"run_started","runId":"run-uuid","workflowId":"workflow-uuid"}

data: {"type":"step_started","stepId":"step-1","toolId":"exa-web-search"}

data: {"type":"step_progress","stepId":"step-1","progress":50,"message":"Searching..."}

data: {"type":"step_completed","stepId":"step-1","result":{"items":[]}}

data: {"type":"step_started","stepId":"step-2","toolId":"summarize"}

data: {"type":"step_completed","stepId":"step-2","result":{"summary":"..."}}

data: {"type":"run_completed","runId":"run-uuid","status":"completed"}
```

## Event Types

| Type | Description | Fields |
|------|-------------|--------|
| `run_started` | Workflow run started | `runId`, `workflowId` |
| `step_started` | Step execution started | `stepId`, `toolId` |
| `step_progress` | Step progress update | `stepId`, `progress`, `message` |
| `step_completed` | Step execution completed | `stepId`, `result` |
| `step_failed` | Step execution failed | `stepId`, `error` |
| `run_completed` | Workflow run completed | `runId`, `status` |
| `run_failed` | Workflow run failed | `runId`, `error` |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid ID format |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot access another user's chat |
| `404` | Not Found | Chat or workflow run does not exist |

## Usage Notes

!!! tip
    Use this endpoint to display real-time workflow execution progress to users. Each event provides updates on the current step and overall run status.

!!! warning
    Ensure your client properly handles SSE streams and reconnection logic for long-running workflows.
