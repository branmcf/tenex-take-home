<h1 class="article-title">MCP Request <span class="badge-post">POST</span></h1>

---

## Overview

Handles Model Context Protocol (MCP) requests for tool operations. This is the main endpoint for interacting with the MCP Tools Server.

## Endpoint URL

```
POST /mcp
```

## Authentication

Requires a valid `X-Service-Key` header.

## Endpoint Data

=== "Headers"
    | Header | Description | Required |
    |--------|-------------|----------|
    | `X-Service-Key` | Service authentication key | Yes |
    | `Content-Type` | Must be `application/json` | Yes |

=== "Body"
    | Property | Description | Type | Required |
    |----------|-------------|------|----------|
    | `method` | The MCP method to call | String | Yes |
    | `params` | Method-specific parameters | Object | Yes |

    ##### Available Methods

    - `listTools` - List all available tools
    - `searchTools` - Search tools by query
    - `getTool` - Get a specific tool
    - `runTool` - Execute a tool

---

## Methods

### listTools

Lists all available MCP tools.

#### Request

```json
{
  "method": "listTools",
  "params": {}
}
```

#### Response

```json
{
  "data": {
    "tools": [
      {
        "id": "exa-web-search",
        "name": "Web Search",
        "description": "Search the web using Exa"
      }
    ]
  }
}
```

---

### searchTools

Searches for tools matching a query.

#### Request

```json
{
  "method": "searchTools",
  "params": {
    "query": "search"
  }
}
```

#### Response

```json
{
  "data": {
    "tools": [
      {
        "id": "exa-web-search",
        "name": "Web Search",
        "description": "Search the web using Exa"
      }
    ]
  }
}
```

---

### getTool

Gets detailed information about a specific tool.

#### Request

```json
{
  "method": "getTool",
  "params": {
    "toolId": "exa-web-search"
  }
}
```

#### Response

```json
{
  "data": {
    "id": "exa-web-search",
    "name": "Web Search",
    "description": "Search the web using Exa AI-powered search",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {"type": "string"}
      },
      "required": ["query"]
    }
  }
}
```

---

### runTool

Executes a tool with the specified parameters.

#### Request

```json
{
  "method": "runTool",
  "params": {
    "toolId": "exa-web-search",
    "input": {
      "query": "machine learning tutorials"
    }
  }
}
```

#### Response

```json
{
  "data": {
    "result": {
      "results": [
        {
          "title": "Machine Learning Crash Course",
          "url": "https://example.com/ml-course",
          "snippet": "A comprehensive introduction to machine learning..."
        }
      ]
    },
    "executionTime": 1250
  }
}
```

---

## Example Request

```bash
curl -X POST "http://localhost:3027/mcp" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Service-Key: your-service-key" \
  --data '{
    "method": "listTools",
    "params": {}
  }'
```

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid method or parameters |
| `401` | Unauthorized | Invalid or missing service key |
| `404` | Not Found | Tool not found (for getTool/runTool) |
| `500` | Internal Server Error | Tool execution failed |

### Error Response Format

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "code": "ERROR_CODE"
}
```
