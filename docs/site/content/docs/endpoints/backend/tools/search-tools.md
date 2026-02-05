<h1 class="article-title">Search Tools <span class="badge-get">GET</span></h1>

---

## Overview

Searches for tools by name or description.

## Endpoint URL

```
GET /api/tools/search
```

## Endpoint Data

=== "URL Parameters"
    ```
    This endpoint has no URL parameters.
    ```

=== "Query Parameters"
    | Parameter | Description | Type | Required |
    |-----------|-------------|------|----------|
    | `q` | Search query | String | Yes |

=== "Body"
    ```
    This endpoint has no request body.
    ```

## Example Request

```bash
curl -X GET "http://localhost:3026/api/tools/search?q=search" \
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
    "tools": [
      {
        "id": "exa-web-search",
        "name": "Web Search",
        "description": "Search the web using Exa AI-powered search",
        "category": "search",
        "inputSchema": {
          "type": "object",
          "properties": {
            "query": {"type": "string"}
          },
          "required": ["query"]
        }
      }
    ],
    "total": 1
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `tools` | Array | List of matching tool objects |
| `total` | Integer | Total number of matches |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Missing search query |
| `401` | Unauthorized | Invalid or missing session |
