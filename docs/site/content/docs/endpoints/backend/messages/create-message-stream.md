<h1 class="article-title">Create Message Stream <span class="badge-post">POST</span></h1>

---

## Overview

Creates a new message in a chat conversation with streaming response. The AI assistant will process the message and stream the response in real-time using Server-Sent Events (SSE).

## Endpoint URL

```
POST /api/chats/:chatId/messages/stream
```

## Endpoint Data

=== "URL Parameters"
    | Parameter | Description | Type | Required |
    |-----------|-------------|------|----------|
    | `chatId` | The chat's unique identifier (UUID) | String | Yes |

=== "Query Parameters"
    ```
    This endpoint has no query parameters.
    ```

=== "Body"
    | Property | Description | Type | Required |
    |----------|-------------|------|----------|
    | `content` | The message content | String | Yes |
    | `modelId` | The AI model to use for response | String | Yes |
    | `userId` | The user sending the message | String | Yes |
    | `workflowId` | Optional workflow to execute | String (UUID) | No |

    ##### Example Body

    ```json
    {
      "content": "Explain quantum computing",
      "modelId": "gpt-4",
      "userId": "user-123"
    }
    ```

## Example Request

```bash
curl -X POST "http://localhost:3026/api/chats/550e8400-e29b-41d4-a716-446655440000/messages/stream" \
  -H "Accept: text/event-stream" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{
    "content": "Explain quantum computing",
    "modelId": "gpt-4",
    "userId": "user-123"
  }'
```

## Example Response

The response is a Server-Sent Events (SSE) stream:

```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"type":"start","messageId":"msg-uuid-1"}

data: {"type":"content","delta":"Quantum"}

data: {"type":"content","delta":" computing"}

data: {"type":"content","delta":" is a type of computation"}

data: {"type":"end","messageId":"msg-uuid-1"}
```

## Event Types

| Type | Description | Fields |
|------|-------------|--------|
| `start` | Stream started | `messageId` |
| `content` | Content chunk | `delta` |
| `tool_call` | Tool being called | `toolName`, `toolArgs` |
| `tool_result` | Tool execution result | `toolName`, `result` |
| `end` | Stream completed | `messageId` |
| `error` | Error occurred | `error`, `message` |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid request body or parameters |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot post to another user's chat |
| `404` | Not Found | Chat does not exist |

## Usage Notes

!!! tip
    Use this endpoint for real-time chat interfaces where immediate feedback is important. The streaming response provides a better user experience than waiting for the complete response.

!!! warning
    Ensure your client properly handles SSE streams. Most HTTP clients require special configuration to process streaming responses.
