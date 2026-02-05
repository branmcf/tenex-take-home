<h1 class="article-title">Health Check <span class="badge-get">GET</span></h1>

---

## Overview

Returns the health status of the API server. This endpoint does not require authentication.

## Endpoint URL

```
GET /api/liveness
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
    ```
    This endpoint has no request body.
    ```

## Example Request

```bash
curl -X GET "http://localhost:3026/api/liveness" \
  -H "Accept: application/json"
```

## Example Response

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "ok",
  "timestamp": "2024-02-04T12:00:00.000Z"
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | Health status (`ok`) |
| `timestamp` | String | ISO 8601 timestamp |
