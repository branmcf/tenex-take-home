<h1 class="article-title">Get Models <span class="badge-get">GET</span></h1>

---

## Overview

Returns a list of available AI models that can be used for chat and workflow interactions.

## Endpoint URL

```
GET /api/models
```

## Endpoint Data

=== "URL Parameters"
    ```
    This endpoint has no URL parameters.
    ```

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
curl -X GET "http://localhost:3026/api/models" \
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
    "models": [
      {
        "id": "gpt-4",
        "name": "GPT-4",
        "provider": "openai"
      },
      {
        "id": "claude-3-opus",
        "name": "Claude 3 Opus",
        "provider": "anthropic"
      }
    ]
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `models` | Array | List of available models |
| `models[].id` | String | Unique model identifier |
| `models[].name` | String | Display name of the model |
| `models[].provider` | String | Model provider (e.g., openai, anthropic) |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `401` | Unauthorized | Invalid or missing session |
