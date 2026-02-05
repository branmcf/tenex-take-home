<h1 class="article-title">Get Workflow Messages <span class="badge-get">GET</span></h1>

---

## Overview

Returns all chat messages associated with a specific workflow. These are messages exchanged during workflow configuration and proposal discussions.

## Endpoint URL

```
GET /api/workflows/:workflowId/messages
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
    ```
    This endpoint has no request body.
    ```

## Example Request

```bash
curl -X GET "http://localhost:3026/api/workflows/550e8400-e29b-41d4-a716-446655440000/messages" \
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
    "messages": [
      {
        "id": "msg-uuid-1",
        "workflowId": "550e8400-e29b-41d4-a716-446655440000",
        "role": "user",
        "content": "I want to add a step that searches the web",
        "createdAt": "2024-02-04T12:00:00.000Z"
      },
      {
        "id": "msg-uuid-2",
        "workflowId": "550e8400-e29b-41d4-a716-446655440000",
        "role": "assistant",
        "content": "I'll add a web search step using the Exa tool...",
        "proposal": {
          "id": "proposal-uuid-1",
          "status": "pending",
          "changes": []
        },
        "createdAt": "2024-02-04T12:00:05.000Z"
      }
    ]
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `messages` | Array | List of message objects |
| `messages[].id` | String (UUID) | Message identifier |
| `messages[].workflowId` | String (UUID) | Parent workflow identifier |
| `messages[].role` | String | Message role (`user` or `assistant`) |
| `messages[].content` | String | Message content |
| `messages[].proposal` | Object | Optional workflow proposal |
| `messages[].proposal.id` | String (UUID) | Proposal identifier |
| `messages[].proposal.status` | String | Proposal status |
| `messages[].createdAt` | String | ISO 8601 creation timestamp |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid workflow ID format |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot access another user's workflow |
| `404` | Not Found | Workflow does not exist |
