<h1 class="article-title">Update Workflow <span class="badge-patch">PATCH</span></h1>

---

## Overview

Updates an existing workflow's name and/or description.

## Endpoint URL

```
PATCH /api/workflows/:workflowId
```

## Endpoint Data

=== "URL Parameters"
    | Parameter | Description | Type | Required |
    |-----------|-------------|------|----------|
    | `workflowId` | The workflow's unique identifier (UUID) | String | Yes |

=== "Query Parameters"
    ```
    This endpoint has no query parameters.
    ```

=== "Body"
    | Property | Description | Type | Required | Constraints |
    |----------|-------------|------|----------|-------------|
    | `name` | Workflow name | String | No* | 1-255 characters |
    | `description` | Workflow description | String | No* | Max 1000 characters |

    *At least one of `name` or `description` must be provided.

    ##### Example Body

    ```json
    {
      "name": "Updated Research Workflow",
      "description": "Enhanced research and summarization workflow"
    }
    ```

## Example Request

```bash
curl -X PATCH "http://localhost:3026/api/workflows/550e8400-e29b-41d4-a716-446655440000" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{
    "name": "Updated Research Workflow"
  }'
```

## Example Response

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-123",
    "name": "Updated Research Workflow",
    "description": "Automated research and summarization workflow",
    "steps": [],
    "createdAt": "2024-02-04T10:00:00.000Z",
    "updatedAt": "2024-02-04T14:00:00.000Z"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Workflow identifier |
| `userId` | String | Owner user ID |
| `name` | String | Updated workflow name |
| `description` | String | Updated workflow description |
| `steps` | Array | Workflow steps |
| `createdAt` | String | ISO 8601 creation timestamp |
| `updatedAt` | String | ISO 8601 last update timestamp |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid request body or no fields provided |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot update another user's workflow |
| `404` | Not Found | Workflow does not exist |
