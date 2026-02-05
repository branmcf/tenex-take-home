# MCP Tools Reference

HardWire provides a set of built-in MCP (Model Context Protocol) tools that can be used in workflows. These tools enable AI agents to interact with the web, process text, and make HTTP requests.

---

## Available Tools

### web_search

Search the web for information using DuckDuckGo.

**ID:** `tool_web_search`
**Version:** `1.0.0`
**Tags:** `search`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | The search query |
| `limit` | number | No | Maximum number of results (1-10, default: 5) |

#### Response

```json
{
  "results": [
    {
      "title": "Result Title",
      "url": "https://example.com/page",
      "snippet": "A brief description of the result..."
    }
  ]
}
```

#### Example

```json
{
  "method": "runTool",
  "params": {
    "id": "tool_web_search",
    "input": {
      "query": "latest AI news",
      "limit": 5
    }
  }
}
```

---

### read_url

Fetch a URL and extract readable text content. Useful for reading web pages and extracting their main content.

**ID:** `tool_read_url`
**Version:** `1.0.0`
**Tags:** `fetch`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | The URL to fetch |
| `maxChars` | number | No | Maximum characters to return (500-20000, default: 8000) |

#### Response

```json
{
  "title": "Page Title",
  "text": "The extracted text content from the page..."
}
```

#### Example

```json
{
  "method": "runTool",
  "params": {
    "id": "tool_read_url",
    "input": {
      "url": "https://example.com/article",
      "maxChars": 5000
    }
  }
}
```

#### Security Notes

- Only HTTP and HTTPS protocols are allowed
- Private IP addresses and localhost are blocked by default
- An allowlist can be configured via the `MCP_HTTP_REQUEST_ALLOWLIST` environment variable

---

### http_request

Make an HTTP API request. Supports all standard HTTP methods and custom headers.

**ID:** `tool_http_request`
**Version:** `1.0.0`
**Tags:** `http`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | The URL to request |
| `method` | string | Yes | HTTP method (GET, POST, PUT, DELETE, etc.) |
| `headers` | object | No | Custom request headers |
| `body` | any | No | Request body (ignored for GET/HEAD) |
| `timeoutMs` | number | No | Request timeout in milliseconds (1000-20000, default: 8000) |

#### Response

```json
{
  "status": 200,
  "headers": {
    "content-type": "application/json"
  },
  "body": "Response body content..."
}
```

#### Example

```json
{
  "method": "runTool",
  "params": {
    "id": "tool_http_request",
    "input": {
      "url": "https://api.example.com/data",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer token123"
      },
      "body": {
        "key": "value"
      }
    }
  }
}
```

#### Security Notes

- Only HTTP and HTTPS protocols are allowed
- Private IP addresses and localhost are blocked by default
- Response body is limited to 20KB
- Content-Type is automatically set to `application/json` for object bodies

---

### summarize

Summarize a block of text into a shorter form. Extracts the first few sentences and truncates to a maximum word count.

**ID:** `tool_summarize`
**Version:** `1.0.0`
**Tags:** `text`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | The text to summarize |
| `maxWords` | number | No | Maximum words in summary (30-300, default: 120) |

#### Response

```json
{
  "summary": "A condensed version of the input text..."
}
```

#### Example

```json
{
  "method": "runTool",
  "params": {
    "id": "tool_summarize",
    "input": {
      "text": "Long article text goes here...",
      "maxWords": 100
    }
  }
}
```

---

### extract_json

Extract a JSON object or array from text. Useful for parsing structured data from unstructured responses.

**ID:** `tool_extract_json`
**Version:** `1.0.0`
**Tags:** `json`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | The text containing JSON |
| `fields` | string[] | No | Specific fields to extract (returns all if not specified) |

#### Response

```json
{
  "data": {
    "extracted": "json",
    "content": "here"
  }
}
```

#### Example

```json
{
  "method": "runTool",
  "params": {
    "id": "tool_extract_json",
    "input": {
      "text": "The API returned: {\"status\": \"success\", \"count\": 42}",
      "fields": ["status", "count"]
    }
  }
}
```

---

## Using Tools in Workflows

Tools are automatically available to AI agents during workflow execution. The agent can decide which tools to use based on the task at hand.

### Tool Execution Flow

1. The AI agent analyzes the user's request
2. The agent selects appropriate tools to accomplish the task
3. Each tool is executed via the MCP Tools Server
4. Results are returned to the agent for further processing
5. The agent synthesizes results into a final response

### Listing Available Tools

You can retrieve the list of available tools using the [Get Tools](../endpoints/backend/tools/get-tools.md) endpoint:

```bash
curl -X GET "https://api.hardwire.dev/api/tools" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## MCP Protocol

The MCP Tools Server implements the Model Context Protocol for standardized tool execution. The protocol supports four methods:

| Method | Description |
|--------|-------------|
| `listTools` | List all available tools with pagination |
| `searchTools` | Search tools by name, description, or tags |
| `getTool` | Get details of a specific tool |
| `runTool` | Execute a tool with given input |

For more details on the MCP protocol, see the [MCP Tools Server Overview](../endpoints/mcp-tools-server/overview.md).
