# Authentication

The HardWire API uses session-based authentication powered by Better Auth.

---

## Overview

All API endpoints (except `/api/liveness`) require authentication. The API uses HTTP-only cookies for session management.

---

## Authentication Flow

### 1. Sign Up

Register a new user account:

```bash
curl -X POST "http://localhost:3026/api/auth/sign-up/email" \
  -H "Content-Type: application/json" \
  --data '{
    "email": "user@example.com",
    "password": "your-secure-password",
    "name": "Your Name"
  }'
```

### 2. Sign In

Authenticate with existing credentials:

```bash
curl -X POST "http://localhost:3026/api/auth/sign-in/email" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  --data '{
    "email": "user@example.com",
    "password": "your-secure-password"
  }'
```

The response will set a session cookie that should be included in subsequent requests.

### 3. Using the Session

Include the session cookie in all authenticated requests:

```bash
curl "http://localhost:3026/api/models" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

---

## Session Management

### Get Current Session

```bash
curl "http://localhost:3026/api/auth/session" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Sign Out

```bash
curl -X POST "http://localhost:3026/api/auth/sign-out" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

---

## MCP Tools Server Authentication

The MCP Tools Server uses service-level authentication. Requests must include a valid `X-Service-Key` header:

```bash
curl -X POST "http://localhost:3027/mcp" \
  -H "Content-Type: application/json" \
  -H "X-Service-Key: your-service-key" \
  --data '{
    "method": "listTools",
    "params": {}
  }'
```

!!! note
    The service key is configured via the `MCP_SERVICE_KEY` environment variable.

---

## Error Responses

| Status Code | Description |
|-------------|-------------|
| `401` | Unauthorized - Invalid or missing session |
| `403` | Forbidden - Insufficient permissions |

```json
{
  "error": "Unauthorized",
  "message": "Valid session required"
}
```
