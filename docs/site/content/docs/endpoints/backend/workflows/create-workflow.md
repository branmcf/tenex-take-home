<h1 class="article-title">Create Workflow <span class="badge-post">POST</span></h1>

---

## Overview

Creates a new workflow for the user. Workflows define automated processes that can be triggered during chat conversations.

## Endpoint URL

```
POST /api/workflows
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
    | Property | Description | Type | Required | Constraints |
    |----------|-------------|------|----------|-------------|
    | `userId` | The owner user ID | String | Yes | Min 1 character |
    | `name` | Workflow name | String | Yes | 1-255 characters |
    | `description` | Workflow description | String | No | Max 1000 characters |

    ##### Example Body

    ```json
    {
      "userId": "user-123",
      "name": "Research Workflow",
      "description": "Automated research and summarization workflow"
    }
    ```

## Example Request

```bash
curl -X POST "http://localhost:3026/api/workflows" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{
    "userId": "user-123",
    "name": "Research Workflow",
    "description": "Automated research and summarization workflow"
  }'
```

## Example Response

```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-123",
    "name": "Research Workflow",
    "description": "Automated research and summarization workflow",
    "steps": [],
    "createdAt": "2024-02-04T12:00:00.000Z",
    "updatedAt": "2024-02-04T12:00:00.000Z"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Newly created workflow identifier |
| `userId` | String | Owner user ID |
| `name` | String | Workflow name |
| `description` | String | Workflow description |
| `steps` | Array | Workflow steps (initially empty) |
| `createdAt` | String | ISO 8601 creation timestamp |
| `updatedAt` | String | ISO 8601 last update timestamp |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid request body or validation failed |
| `401` | Unauthorized | Invalid or missing session |
