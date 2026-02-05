<h1 class="article-title">Get Tools <span class="badge-get">GET</span></h1>

---

## Overview

Returns a list of all available MCP tools that can be used in workflows.

## Endpoint URL

```
GET /api/tools
```

## Endpoint Data

=== "URL Parameters"
    ```
    This endpoint has no URL parameters.
    ```

=== "Query Parameters"
    | Parameter | Description | Type | Default |
    |-----------|-------------|------|---------|
    | `refresh` | Force refresh the tool cache | String | - |

=== "Body"
    ```
    This endpoint has no request body.
    ```

## Example Request

```bash
curl -X GET "http://localhost:3026/api/tools" \
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
            "query": {
              "type": "string",
              "description": "The search query"
            }
          },
          "required": ["query"]
        }
      },
      {
        "id": "summarize",
        "name": "Summarize Text",
        "description": "Summarize long text into key points",
        "category": "text",
        "inputSchema": {
          "type": "object",
          "properties": {
            "text": {
              "type": "string",
              "description": "The text to summarize"
            }
          },
          "required": ["text"]
        }
      }
    ]
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `tools` | Array | List of tool objects |
| `tools[].id` | String | Unique tool identifier |
| `tools[].name` | String | Display name |
| `tools[].description` | String | Tool description |
| `tools[].category` | String | Tool category |
| `tools[].inputSchema` | Object | JSON Schema for inputs |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `401` | Unauthorized | Invalid or missing session |
| `500` | Internal Server Error | Failed to fetch tools |
