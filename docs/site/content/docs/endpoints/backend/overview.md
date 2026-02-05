# Backend API Overview

The Backend API is the main API service for the HardWire platform. It provides endpoints for managing chats, messages, workflows, and more.

---

## Base URL

Local
```
https://localhost:3026/api
```

Production
```
https://api-hardwire.branmcf.com
```

---

## Authentication

All endpoints (except `/api/liveness`) require a valid session. See the [Authentication Guide](../../getting-started/authentication.md) for details.

---

## Endpoints Summary

### Liveness

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/liveness` | Health check endpoint |

### Models

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/models` | Get available AI models |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:userId/chats` | Get user's chats |
| GET | `/users/:userId/workflows` | Get user's workflows |
| GET | `/users/:userId/model-preference` | Get user's model preference |
| POST | `/users/:userId/model-preference` | Update user's model preference |

### Chats

| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | `/chats/:chatId` | Delete a chat |

### Messages (nested under Chats)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chats/:chatId/messages` | Get messages in a chat |
| POST | `/chats/:chatId/messages` | Create a new message |
| POST | `/chats/:chatId/messages/stream` | Create a message with streaming response |

### Workflows

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workflows/:workflowId` | Get a workflow by ID |
| POST | `/workflows` | Create a new workflow |
| PATCH | `/workflows/:workflowId` | Update a workflow |
| DELETE | `/workflows/:workflowId` | Delete a workflow |

### Workflow Chat Messages (nested under Workflows)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workflows/:workflowId/messages` | Get workflow chat messages |
| POST | `/workflows/:workflowId/messages` | Create a workflow chat message |
| POST | `/workflows/:workflowId/messages/apply` | Apply a workflow proposal |
| POST | `/workflows/:workflowId/messages/reject` | Reject a workflow proposal |

### Workflow Runs (nested under Chats)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chats/:chatId/workflow-runs` | Get workflow runs for a chat |
| GET | `/chats/:chatId/workflow-runs/:workflowRunId/stream` | Stream a workflow run |

### Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tools` | Get available tools |
| GET | `/tools/search` | Search for tools |
| GET | `/tools/:toolId` | Get a tool by ID |

---

## Common Response Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `204` | No Content (successful deletion) |
| `400` | Bad Request - Invalid parameters |
| `401` | Unauthorized - Invalid or missing session |
| `403` | Forbidden - Resource access denied |
| `404` | Not Found - Resource doesn't exist |
| `500` | Internal Server Error |
