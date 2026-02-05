# Making API Calls

This guide covers the basics of making API calls to the Tenex platform.

---

## Request Format

All API requests should include the following headers:

```bash
Content-Type: application/json
Accept: application/json
```

For authenticated endpoints, include your session cookie.

---

## Response Format

All responses are returned as JSON:

```json
{
  "data": {
    // Response data
  }
}
```

Error responses follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

---

## Example: Creating a Chat and Sending a Message

### Step 1: Get Your User ID

First, get your user information from the session:

```bash
curl "http://localhost:3026/api/auth/session" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Step 2: Send a Message

Send a message to create a new chat (or use an existing chat ID):

```bash
curl -X POST "http://localhost:3026/api/chats/{chatId}/messages" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{
    "content": "Hello, how can I automate my workflow?",
    "modelId": "gpt-4",
    "userId": "your-user-id"
  }'
```

### Step 3: Stream the Response

For real-time responses, use the streaming endpoint:

```bash
curl -X POST "http://localhost:3026/api/chats/{chatId}/messages/stream" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{
    "content": "Tell me about available tools",
    "modelId": "gpt-4",
    "userId": "your-user-id"
  }'
```

---

## Example: Creating a Workflow

### Step 1: Create the Workflow

```bash
curl -X POST "http://localhost:3026/api/workflows" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{
    "userId": "your-user-id",
    "name": "Research Workflow",
    "description": "A workflow for researching topics"
  }'
```

### Step 2: Get the Workflow

```bash
curl "http://localhost:3026/api/workflows/{workflowId}" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

---

## Pagination

Endpoints that return lists support pagination with `limit` and `offset` query parameters:

```bash
curl "http://localhost:3026/api/users/{userId}/chats?limit=10&offset=0" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `limit` | Integer | 25 | 100 | Number of results to return |
| `offset` | Integer | 0 | - | Number of results to skip |

---

## Rate Limiting

The API implements rate limiting to ensure fair usage. If you exceed the rate limit, you'll receive a `429 Too Many Requests` response.

---

## Best Practices

1. **Use streaming for real-time responses** - The `/messages/stream` endpoint provides better UX for chat interfaces
2. **Handle errors gracefully** - Always check for error responses and handle them appropriately
3. **Use pagination** - For list endpoints, use pagination to avoid large response payloads
4. **Cache when appropriate** - Cache model lists and tool definitions that don't change frequently
