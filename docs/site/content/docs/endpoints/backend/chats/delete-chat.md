<h1 class="article-title">Delete Chat <span class="badge-delete">DELETE</span></h1>

---

## Overview

Permanently deletes a chat and all associated messages.

## Endpoint URL

```
DELETE /api/chats/:chatId
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
curl -X DELETE "http://localhost:3026/api/chats/550e8400-e29b-41d4-a716-446655440000" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Example Response

```json
HTTP/1.1 204 No Content
```

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid chat ID format (not UUID) |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot delete another user's chat |
| `404` | Not Found | Chat does not exist |
