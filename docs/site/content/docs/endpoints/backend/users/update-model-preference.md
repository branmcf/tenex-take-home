<h1 class="article-title">Update Model Preference <span class="badge-post">POST</span></h1>

---

## Overview

Updates the user's preferred AI model setting.

## Endpoint URL

```
POST /api/users/:userId/model-preference
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
    | Property | Description | Type | Required |
    |----------|-------------|------|----------|
    | `modelId` | The model identifier to set as preferred | String | Yes |

    ##### Example Body

    ```json
    {
      "modelId": "gpt-4"
    }
    ```

## Example Request

```bash
curl -X POST "http://localhost:3026/api/users/user-123/model-preference" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{
    "modelId": "gpt-4"
  }'
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
| `modelId` | String | Updated preferred model identifier |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid model ID |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot update another user's preferences |
