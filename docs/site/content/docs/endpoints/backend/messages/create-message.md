<h1 class="article-title">Create Message <span class="badge-post">POST</span></h1>

---

## Overview

Creates a new message in a chat conversation. The AI assistant will process the message and generate a response.

## Endpoint URL

```
POST /api/chats/:chatId/messages
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
    | Property | Description | Type | Required |
    |----------|-------------|------|----------|
    | `content` | The message content | String | Yes |
    | `modelId` | The AI model to use for response | String | Yes |
    | `userId` | The user sending the message | String | Yes |
    | `workflowId` | Optional workflow to execute | String (UUID) | No |

    ##### Example Body

    ```json
    {
      "content": "How can I automate my research workflow?",
      "modelId": "gpt-4",
      "userId": "user-123",
      "workflowId": null
    }
    ```

## Example Request

```bash
curl -X POST "http://localhost:3026/api/chats/550e8400-e29b-41d4-a716-446655440000/messages" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{
    "content": "How can I automate my research workflow?",
    "modelId": "gpt-4",
    "userId": "user-123"
  }'
```

## Example Response

```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "id": "msg-uuid-1",
    "chatId": "550e8400-e29b-41d4-a716-446655440000",
    "role": "user",
    "content": "How can I automate my research workflow?",
    "createdAt": "2024-02-04T12:00:00.000Z",
    "response": {
      "id": "msg-uuid-2",
      "chatId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "assistant",
      "content": "I can help you automate your research workflow...",
      "createdAt": "2024-02-04T12:00:05.000Z"
    }
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Message identifier |
| `chatId` | String (UUID) | Parent chat identifier |
| `role` | String | Message role (`user` or `assistant`) |
| `content` | String | Message content |
| `createdAt` | String | ISO 8601 creation timestamp |
| `response` | Object | Assistant's response message |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid request body or parameters |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot post to another user's chat |
| `404` | Not Found | Chat does not exist |
