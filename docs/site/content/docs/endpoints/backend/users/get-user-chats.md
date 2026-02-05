<h1 class="article-title">Get User Chats <span class="badge-get">GET</span></h1>

---

## Overview

Returns a paginated list of chats belonging to a specific user.

## Endpoint URL

```
GET /api/users/:userId/chats
```

## Endpoint Data

=== "URL Parameters"
    | Parameter | Description | Type | Required |
    |-----------|-------------|------|----------|
    | `userId` | The user's unique identifier | String | Yes |

=== "Query Parameters"
    | Parameter | Description | Type | Default | Max |
    |-----------|-------------|------|---------|-----|
    | `limit` | Number of results to return | Integer | 25 | 100 |
    | `offset` | Number of results to skip | Integer | 0 | - |

=== "Body"
    ```
    This endpoint has no request body.
    ```

## Example Request

```bash
curl -X GET "http://localhost:3026/api/users/user-123/chats?limit=10&offset=0" \
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
    "chats": [
      {
        "id": "chat-uuid-1",
        "userId": "user-123",
        "createdAt": "2024-02-04T10:00:00.000Z",
        "updatedAt": "2024-02-04T12:00:00.000Z"
      },
      {
        "id": "chat-uuid-2",
        "userId": "user-123",
        "createdAt": "2024-02-03T15:00:00.000Z",
        "updatedAt": "2024-02-03T16:30:00.000Z"
      }
    ],
    "total": 25
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `chats` | Array | List of chat objects |
| `chats[].id` | String (UUID) | Unique chat identifier |
| `chats[].userId` | String | Owner user ID |
| `chats[].createdAt` | String | ISO 8601 creation timestamp |
| `chats[].updatedAt` | String | ISO 8601 last update timestamp |
| `total` | Integer | Total number of chats |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot access another user's chats |
