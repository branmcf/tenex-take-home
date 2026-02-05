<h1 class="article-title">Get User Workflows <span class="badge-get">GET</span></h1>

---

## Overview

Returns a list of workflows belonging to a specific user.

## Endpoint URL

```
GET /api/users/:userId/workflows
```

## Endpoint Data

=== "URL Parameters"
    | Parameter | Description | Type | Required |
    |-----------|-------------|------|----------|
    | `userId` | The user's unique identifier | String | Yes |

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
curl -X GET "http://localhost:3026/api/users/user-123/workflows" \
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
    "workflows": [
      {
        "id": "workflow-uuid-1",
        "userId": "user-123",
        "name": "Research Workflow",
        "description": "Automated research and summarization",
        "createdAt": "2024-02-04T10:00:00.000Z",
        "updatedAt": "2024-02-04T12:00:00.000Z"
      }
    ]
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `workflows` | Array | List of workflow objects |
| `workflows[].id` | String (UUID) | Unique workflow identifier |
| `workflows[].userId` | String | Owner user ID |
| `workflows[].name` | String | Workflow name |
| `workflows[].description` | String | Workflow description |
| `workflows[].createdAt` | String | ISO 8601 creation timestamp |
| `workflows[].updatedAt` | String | ISO 8601 last update timestamp |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot access another user's workflows |
