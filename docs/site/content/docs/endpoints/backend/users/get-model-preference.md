<h1 class="article-title">Get Model Preference <span class="badge-get">GET</span></h1>

---

## Overview

Returns the user's preferred AI model setting.

## Endpoint URL

```
GET /api/users/:userId/model-preference
```

## Endpoint Data

=== "URL Parameters"
    | Parameter | Description | Type | Required |
    |-----------|-------------|------|----------|
    | `userId` | The user's unique identifier | String | Yes |

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
curl -X GET "http://localhost:3026/api/users/user-123/model-preference" \
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
    "userId": "user-123",
    "modelId": "gpt-4"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `userId` | String | User identifier |
| `modelId` | String | Preferred model identifier |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot access another user's preferences |
| `404` | Not Found | No preference set for user |
