<h1 class="article-title">Get Workflow <span class="badge-get">GET</span></h1>

---

## Overview

Returns a specific workflow by its ID, including its steps and configuration.

## Endpoint URL

```
GET /api/workflows/:workflowId
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
    ```
    This endpoint has no request body.
    ```

## Example Request

```bash
curl -X GET "http://localhost:3026/api/workflows/550e8400-e29b-41d4-a716-446655440000" \
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
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-123",
    "name": "Research Workflow",
    "description": "Automated research and summarization workflow",
    "steps": [
      {
        "id": "step-1",
        "toolId": "exa-web-search",
        "inputs": {},
        "outputs": ["searchResults"]
      }
    ],
    "createdAt": "2024-02-04T10:00:00.000Z",
    "updatedAt": "2024-02-04T12:00:00.000Z"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Workflow identifier |
| `userId` | String | Owner user ID |
| `name` | String | Workflow name |
| `description` | String | Workflow description |
| `steps` | Array | Workflow step definitions |
| `steps[].id` | String | Step identifier |
| `steps[].toolId` | String | Tool to execute |
| `steps[].inputs` | Object | Step input configuration |
| `steps[].outputs` | Array | Output variable names |
| `createdAt` | String | ISO 8601 creation timestamp |
| `updatedAt` | String | ISO 8601 last update timestamp |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid workflow ID format |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot access another user's workflow |
| `404` | Not Found | Workflow does not exist |
