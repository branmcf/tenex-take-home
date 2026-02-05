<h1 class="article-title">Create Workflow Message <span class="badge-post">POST</span></h1>

---

## Overview

Creates a new message in the workflow chat. The AI assistant will analyze the request and potentially propose changes to the workflow.

## Endpoint URL

```
POST /api/workflows/:workflowId/messages
```

## Endpoint Data

=== "URL Parameters"
    | Parameter | Description | Type | Required |
    |-----------|-------------|------|----------|
    | `workflowId` | The workflow's unique identifier (UUID) | String | Yes |

=== "Query Parameters"
    ```
    This endpoint has no query parameters.
    ```

=== "Body"
    | Property | Description | Type | Required |
    |----------|-------------|------|----------|
    | `content` | The message content | String | Yes |
    | `modelId` | The AI model to use | String | Yes |

    ##### Example Body

    ```json
    {
      "content": "Add a step to summarize the search results",
      "modelId": "gpt-4"
    }
    ```

## Example Request

```bash
curl -X POST "http://localhost:3026/api/workflows/550e8400-e29b-41d4-a716-446655440000/messages" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{
    "content": "Add a step to summarize the search results",
    "modelId": "gpt-4"
  }'
```

## Example Response

```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "userMessage": {
      "id": "msg-uuid-1",
      "workflowId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "user",
      "content": "Add a step to summarize the search results",
      "createdAt": "2024-02-04T12:00:00.000Z"
    },
    "assistantMessage": {
      "id": "msg-uuid-2",
      "workflowId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "assistant",
      "content": "I'll add a summarization step after the web search...",
      "proposal": {
        "id": "proposal-uuid-1",
        "status": "pending",
        "changes": [
          {
            "type": "add_step",
            "step": {
              "id": "step-2",
              "toolId": "summarize",
              "inputs": {"text": "{{step-1.results}}"}
            }
          }
        ]
      },
      "createdAt": "2024-02-04T12:00:10.000Z"
    }
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `userMessage` | Object | The user's message |
| `assistantMessage` | Object | The assistant's response |
| `assistantMessage.proposal` | Object | Optional workflow change proposal |
| `assistantMessage.proposal.id` | String (UUID) | Proposal identifier |
| `assistantMessage.proposal.status` | String | `pending`, `applied`, or `rejected` |
| `assistantMessage.proposal.changes` | Array | Proposed workflow changes |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid request body |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot access another user's workflow |
| `404` | Not Found | Workflow does not exist |
