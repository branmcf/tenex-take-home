# MCP Tools Server Overview

The MCP Tools Server is a dedicated service for executing Model Context Protocol (MCP) tools. It provides a standardized interface for tool discovery and execution.

---

## Base URL

```
http://localhost:3027
```

---

## Authentication

All requests require a valid `X-Service-Key` header:

```bash
curl -X POST "http://localhost:3027/mcp" \
  -H "Content-Type: application/json" \
  -H "X-Service-Key: your-service-key"
```

---

## MCP Protocol

The MCP Tools Server implements a simplified version of the Model Context Protocol. All requests are sent to the `/mcp` endpoint with a `method` parameter specifying the operation.

### Available Methods

| Method | Description |
|--------|-------------|
| `listTools` | List all available tools |
| `searchTools` | Search tools by query |
| `getTool` | Get a specific tool by ID |
| `runTool` | Execute a tool with parameters |

---

## Request Format

All requests follow this format:

```json
{
  "method": "methodName",
  "params": {
    // Method-specific parameters
  }
}
```

---

## Response Format

Successful responses:

```json
{
  "data": {
    // Method-specific response data
  }
}
```

Error responses:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

---

## Example: List Tools

```bash
curl -X POST "http://localhost:3027/mcp" \
  -H "Content-Type: application/json" \
  -H "X-Service-Key: your-service-key" \
  --data '{
    "method": "listTools",
    "params": {}
  }'
```

Response:

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

## Common Response Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request - Invalid method or parameters |
| `401` | Unauthorized - Invalid or missing service key |
| `404` | Not Found - Tool not found |
| `500` | Internal Server Error |
