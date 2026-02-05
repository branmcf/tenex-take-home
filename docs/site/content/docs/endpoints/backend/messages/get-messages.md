<h1 class="article-title">Get Messages <span class="badge-get">GET</span></h1>

---

## Overview

Returns all messages in a specific chat conversation.

## Endpoint URL

```
GET /api/chats/:chatId/messages
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
curl -X GET "http://localhost:3026/api/chats/550e8400-e29b-41d4-a716-446655440000/messages" \
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
        "chatId": "550e8400-e29b-41d4-a716-446655440000",
        "role": "user",
        "content": "What is machine learning?",
        "createdAt": "2024-02-04T12:00:00.000Z"
      },
      {
        "id": "msg-uuid-2",
        "chatId": "550e8400-e29b-41d4-a716-446655440000",
        "role": "assistant",
        "content": "Machine learning is a subset of artificial intelligence...",
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
| `messages[].chatId` | String (UUID) | Parent chat identifier |
| `messages[].role` | String | Message role (`user` or `assistant`) |
| `messages[].content` | String | Message content |
| `messages[].createdAt` | String | ISO 8601 creation timestamp |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid chat ID format |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot access another user's chat |
| `404` | Not Found | Chat does not exist |
