<h1 class="article-title">Get Workflow Runs <span class="badge-get">GET</span></h1>

---

## Overview

Returns all workflow runs associated with a specific chat.

## Endpoint URL

```
GET /api/chats/:chatId/workflow-runs
```

## Endpoint Data

=== "URL Parameters"
    | Parameter | Description | Type | Required |
    |-----------|-------------|------|----------|
    | `chatId` | The chat's unique identifier (UUID) | String | Yes |

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
curl -X GET "http://localhost:3026/api/chats/550e8400-e29b-41d4-a716-446655440000/workflow-runs" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Example Response

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "workflowRuns": [
      {
        "id": "run-uuid-1",
        "chatId": "550e8400-e29b-41d4-a716-446655440000",
        "workflowId": "workflow-uuid-1",
        "status": "completed",
        "startedAt": "2024-02-04T12:00:00.000Z",
        "completedAt": "2024-02-04T12:01:30.000Z",
        "steps": [
          {
            "id": "step-1",
            "status": "completed",
            "startedAt": "2024-02-04T12:00:00.000Z",
            "completedAt": "2024-02-04T12:00:45.000Z"
          }
        ]
      }
    ]
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `workflowRuns` | Array | List of workflow run objects |
| `workflowRuns[].id` | String (UUID) | Run identifier |
| `workflowRuns[].chatId` | String (UUID) | Associated chat ID |
| `workflowRuns[].workflowId` | String (UUID) | Associated workflow ID |
| `workflowRuns[].status` | String | Run status |
| `workflowRuns[].startedAt` | String | ISO 8601 start timestamp |
| `workflowRuns[].completedAt` | String | ISO 8601 completion timestamp |
| `workflowRuns[].steps` | Array | Step execution details |

## Workflow Run Statuses

| Status | Description |
|--------|-------------|
| `pending` | Run is queued |
| `running` | Run is in progress |
| `completed` | Run completed successfully |
| `failed` | Run encountered an error |
| `cancelled` | Run was cancelled |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid chat ID format |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot access another user's chat |
| `404` | Not Found | Chat does not exist |
