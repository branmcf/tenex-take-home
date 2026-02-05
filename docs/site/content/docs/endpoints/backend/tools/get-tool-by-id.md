<h1 class="article-title">Get Tool by ID <span class="badge-get">GET</span></h1>

---

## Overview

Returns detailed information about a specific tool.

## Endpoint URL

```
GET /api/tools/:toolId
```

## Endpoint Data

=== "URL Parameters"
    | Parameter | Description | Type | Required |
    |-----------|-------------|------|----------|
    | `toolId` | The tool's unique identifier | String | Yes |

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
curl -X GET "http://localhost:3026/api/tools/exa-web-search" \
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
    "id": "exa-web-search",
    "name": "Web Search",
    "description": "Search the web using Exa AI-powered search engine. Returns relevant web pages, articles, and documents based on your query.",
    "category": "search",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "The search query"
        },
        "numResults": {
          "type": "integer",
          "description": "Number of results to return",
          "default": 10
        },
        "type": {
          "type": "string",
          "enum": ["neural", "keyword"],
          "description": "Search type",
          "default": "neural"
        }
      },
      "required": ["query"]
    },
    "outputSchema": {
      "type": "object",
      "properties": {
        "results": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": {"type": "string"},
              "url": {"type": "string"},
              "snippet": {"type": "string"}
            }
          }
        }
      }
    }
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Tool identifier |
| `name` | String | Display name |
| `description` | String | Detailed description |
| `category` | String | Tool category |
| `inputSchema` | Object | JSON Schema for inputs |
| `outputSchema` | Object | JSON Schema for outputs |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `401` | Unauthorized | Invalid or missing session |
| `404` | Not Found | Tool does not exist |
