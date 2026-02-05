<h1 class="article-title">Reject Proposal <span class="badge-post">POST</span></h1>

---

## Overview

Rejects a pending workflow proposal, discarding the proposed changes.

## Endpoint URL

```
POST /api/workflows/:workflowId/messages/reject
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
    | Property | Description | Type | Required |
    |----------|-------------|------|----------|
    | `proposalId` | The proposal's unique identifier | String (UUID) | Yes |

    ##### Example Body

    ```json
    {
      "proposalId": "550e8400-e29b-41d4-a716-446655440001"
    }
    ```

## Example Request

```bash
curl -X POST "http://localhost:3026/api/workflows/550e8400-e29b-41d4-a716-446655440000/messages/reject" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{
    "proposalId": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

## Example Response

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "proposal": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "status": "rejected",
      "rejectedAt": "2024-02-04T12:05:00.000Z"
    }
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `proposal` | Object | The rejected proposal |
| `proposal.id` | String (UUID) | Proposal identifier |
| `proposal.status` | String | Now `rejected` |
| `proposal.rejectedAt` | String | ISO 8601 timestamp |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid proposal ID or proposal not pending |
| `401` | Unauthorized | Invalid or missing session |
| `403` | Forbidden | Cannot access another user's workflow |
| `404` | Not Found | Workflow or proposal does not exist |
