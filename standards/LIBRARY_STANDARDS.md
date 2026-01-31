# Library Standards

This document describes the coding standards and patterns used in the `/lib` directory for service wrapper libraries.

## Overview

The `/lib` directory contains microservice client wrappers that provide typed interfaces to external and internal services. Each library follows a consistent architecture pattern for HTTP requests, error handling, and type definitions.

## Directory Structure

Each service library follows this structure:

```
{serviceName}/
├── index.ts                          # Barrel export for service
├── {serviceName}.types.ts            # Service-level type definitions
├── {serviceName}.request.ts          # HTTP request handler
├── __mocks__/
│   └── {serviceName}.request.ts      # Jest mock implementation
└── {featureName}/                    # Sub-feature modules
    ├── index.ts                      # Feature barrel export
    ├── {featureName}.types.ts        # Feature type definitions
    ├── {featureName}.errors.ts       # Feature error classes
    └── {featureName}.service.ts      # Feature business logic
```

**Example (configService):**
```
configService/
├── index.ts
├── configService.types.ts
├── configService.request.ts
├── __mocks__/
│   └── configService.request.ts
└── configVars/
    ├── index.ts
    ├── configVars.types.ts
    ├── configVars.errors.ts
    ├── configVars.service.ts
    └── configVarsLocal.service.ts    # Alternative implementation
```

## Naming Conventions

| File Type | Naming Pattern | Example |
|-----------|----------------|---------|
| Service types | `{serviceName}.types.ts` | `configService.types.ts` |
| Request handler | `{serviceName}.request.ts` | `configService.request.ts` |
| Feature types | `{featureName}.types.ts` | `configVars.types.ts` |
| Feature errors | `{featureName}.errors.ts` | `configVars.errors.ts` |
| Feature service | `{featureName}.service.ts` | `configVars.service.ts` |
| Alternative impl | `{featureName}Local.service.ts` | `configVarsLocal.service.ts` |
| Mock files | `__mocks__/{serviceName}.request.ts` | `__mocks__/configService.request.ts` |

---

## File Type Standards

### Request Handler (`{serviceName}.request.ts`)

The request handler provides the HTTP abstraction layer for the service.

**Structure:**
```typescript
import axios from 'axios';
import { Either, error, success } from '../../types';
import { ResourceError } from '../../errors';
import { ServiceNameRequestParams } from './serviceName.types';
import { FeatureNotFound } from './feature/feature.errors';
import { getCurrentRequestId } from '../../server/server.helper';

// 1. Environment-based URL configuration
const BASE_URL = process.env.IS_LOCAL === 'true'
    ? 'http://localhost:3002'
    : 'http://' + process.env.SERVICE_HOST + ':' + process.env.SERVICE_PORT;

// 2. Axios instance with default headers
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + process.env.SERVICE_KEY
    },
    baseURL: BASE_URL
});

// 3. Main request function
export const serviceNameRequest = async <T>({
    method,
    path,
    body,
    params
}: ServiceNameRequestParams): Promise<Either<ResourceError, T>> => {

    // 4. Integration test bypass
    if (process.env.IS_INTEGRATION_TESTING === 'true') {
        return success({} as T);
    }

    const requestId = String(getCurrentRequestId());

    try {
        const response = await axiosInstance({
            method,
            url: path,
            data: body,
            headers: { 'x-request-id': requestId },
            params
        });
        return success(response?.data as T);
    } catch (err) {
        const response = (err as AxiosError).response;

        // 5. Error code mapping
        const errorCodesMap = new Map<string, ResourceError>([
            ['FEATURE_NOT_FOUND', new FeatureNotFound()],
            ['ANOTHER_ERROR', new AnotherError()]
        ]);

        const customError = errorCodesMap.get(response.data.code);
        if (customError) {
            return error(customError);
        }

        return error(new ResourceError({
            message: 'Service request failed',
            error: response.data
        }));
    }
};
```

**Key Requirements:**
- Generic type parameter `<T>` for response typing
- Return type is always `Promise<Either<ResourceError, T>>`
- Include integration test bypass check
- Include request ID tracking via `x-request-id` header
- Map backend error codes to custom error classes

---

### Service Types (`{serviceName}.types.ts`)

Defines the request parameter interface for the service.

**Structure:**
```typescript
import { RequestMethod } from '../types';

export interface ServiceNameRequestParams {
    method: RequestMethod;
    path: `/${string}`;                 // Template literal for path safety
    params?: { [key: string]: unknown }; // Query parameters
    body?: { [key: string]: unknown };   // Request body
}
```

**Key Requirements:**
- Use template literal type for `path` to enforce leading slash
- Use `unknown` for flexible param/body values
- Import `RequestMethod` enum from shared types

---

### Feature Types (`{featureName}.types.ts`)

Defines domain models and interfaces for the feature.

**Structure:**
```typescript
// Domain model interface
export interface ConfigVar<T = unknown> {
    id: number;
    varName: string;
    varValue: T;
    environment: 'production' | 'staging';
    platform: 'backend' | 'frontend';
}

// Input parameters for creation
export interface NewAccount {
    paymentMethod: PaymentMethod['name'];
    externalId: string;
}

// Enum for status values
export enum PaymentStatus {
    Created = 'created',
    Pending = 'pending',
    Processed = 'processed',
    Failed = 'failed',
    Cancelled = 'cancelled'
}

// Type alias using property reference
export type AccountId = Account['id'];
```

**Patterns:**
| Pattern | Example | Use Case |
|---------|---------|----------|
| Generic type parameter | `ConfigVar<T = unknown>` | Flexible data types |
| Property reference | `Account['id']` | Type-safe ID references |
| String literal union | `'production' \| 'staging'` | Fixed value sets |
| Enum | `PaymentStatus` | Status/state values |

---

### Feature Errors (`{featureName}.errors.ts`)

Defines custom error classes for the feature.

**Structure:**
```typescript
import { ResourceError, ResourceNotFound } from '../../errors';

// 404 Not Found errors - extend ResourceNotFound
export class ConfigVarNotFound extends ResourceNotFound {
    public constructor() {
        const message = 'The requested config var was not found.';
        const code = 'CONFIG_VAR_NOT_FOUND';
        const statusCode = 404;
        super({ message, statusCode, code });
    }
}

// Other errors - extend ResourceError
export class InvalidConfigValue extends ResourceError {
    public constructor() {
        const message = 'The config value is invalid.';
        const code = 'INVALID_CONFIG_VALUE';
        const statusCode = 400;
        super({ message, statusCode, code });
    }
}
```

**Error Class Selection:**
| Base Class | HTTP Status | Use Case |
|------------|-------------|----------|
| `ResourceNotFound` | 404 | Resource does not exist |
| `ResourceError` | 400, 500, etc. | All other errors |

**Requirements:**
- `code` must match the backend service error code
- `message` should be user-facing and descriptive
- `statusCode` must match appropriate HTTP status

---

### Feature Service (`{featureName}.service.ts`)

Contains business logic functions that call the request handler.

**Structure:**
```typescript
import { Either, error, success, RequestMethod } from '../../types';
import { ResourceError } from '../../errors';
import { serviceNameRequest } from '../serviceName.request';
import { FeatureModel } from './feature.types';

// GET single resource
export const getFeatureById = async (
    featureId: FeatureModel['id']
): Promise<Either<ResourceError, FeatureModel>> => {
    const result = await serviceNameRequest<FeatureModel>({
        method: RequestMethod.GET,
        path: `/features/${featureId}`
    });

    if (result.isError()) {
        return error(result.value);
    }

    return success(result.value);
};

// GET collection
export const getAllFeatures = async (): Promise<Either<ResourceError, FeatureModel[]>> => {
    const result = await serviceNameRequest<FeatureModel[]>({
        method: RequestMethod.GET,
        path: '/features'
    });

    if (result.isError()) {
        return error(result.value);
    }

    return success(result.value);
};

// POST create
export const createFeature = async (
    params: NewFeature
): Promise<Either<ResourceError, FeatureModel>> => {
    const result = await serviceNameRequest<FeatureModel>({
        method: RequestMethod.POST,
        path: '/features',
        body: { ...params }
    });

    if (result.isError()) {
        return error(result.value);
    }

    return success(result.value);
};

// PATCH update
export const updateFeature = async (
    featureId: FeatureModel['id'],
    params: Partial<FeatureModel>
): Promise<Either<ResourceError, FeatureModel>> => {
    const result = await serviceNameRequest<FeatureModel>({
        method: RequestMethod.PATCH,
        path: `/features/${featureId}`,
        body: { ...params }
    });

    if (result.isError()) {
        return error(result.value);
    }

    return success(result.value);
};
```

**Function Signature Pattern:**
```typescript
export const {actionName} = async (
    param: ParamType
): Promise<Either<ResourceError, ReturnType>> => {
    // implementation
};
```

**Key Requirements:**
- All functions are `async` and return `Promise<Either<ResourceError, T>>`
- Use property reference types for IDs: `FeatureModel['id']`
- Always check `.isError()` after request calls
- Wrap returns with `success()` or `error()`

---

### Index Files (Barrel Exports)

**Service-level index.ts:**
```typescript
export * from './featureOne';
export * from './featureTwo';
```

**Feature-level index.ts:**
```typescript
export * from './feature.errors';
export * from './feature.service';
export * from './feature.types';
```

**Requirements:**
- Re-export all public modules
- Do not export request handler directly (internal implementation)
- Service index exports feature modules
- Feature index exports errors, service, and types

---

### Mock Files (`__mocks__/{serviceName}.request.ts`)

Provides Jest mock implementation for testing.

**Structure:**
```typescript
import { Either, error, success } from '../../types';
import { ResourceError } from '../../errors';
import { serviceNameRequest as trueServiceNameRequest } from '../serviceName.request';

interface ServiceNameRequestMock extends jest.Mock<
    ReturnType<typeof trueServiceNameRequest>,
    Parameters<typeof trueServiceNameRequest>
> {
    mockResponseOnce(result?: unknown): this;
    mockResponse(result?: unknown): this;
    mockResponseErrorOnce(error?: ResourceError): this;
    mockResponseError(error?: ResourceError): this;
}

const serviceNameRequestMock = jest.fn<
    ReturnType<typeof trueServiceNameRequest>,
    Parameters<typeof trueServiceNameRequest>
>(trueServiceNameRequest) as ServiceNameRequestMock;

// Success mocks
serviceNameRequestMock.mockResponseOnce = (result = {}) =>
    serviceNameRequestMock.mockImplementationOnce(
        async () => success(result)
    );

serviceNameRequestMock.mockResponse = (result = {}) =>
    serviceNameRequestMock.mockImplementation(
        async () => success(result)
    );

// Error mocks
serviceNameRequestMock.mockResponseErrorOnce = (
    resourceError = new ResourceError({ message: '' })
) =>
    serviceNameRequestMock.mockImplementationOnce(
        async () => error(resourceError)
    );

serviceNameRequestMock.mockResponseError = (
    resourceError = new ResourceError({ message: '' })
) =>
    serviceNameRequestMock.mockImplementation(
        async () => error(resourceError)
    );

jest.doMock('../serviceName.request', () => ({
    serviceNameRequest: serviceNameRequestMock
}));

export const serviceNameRequest = serviceNameRequestMock;
```

**Mock Methods:**
| Method | Use Case |
|--------|----------|
| `mockResponseOnce(result)` | Mock single success response |
| `mockResponse(result)` | Mock all success responses |
| `mockResponseErrorOnce(error)` | Mock single error response |
| `mockResponseError(error)` | Mock all error responses |

---

## Error Handling Pattern

All service functions use the Either monad for error handling:

```typescript
// In service function
const result = await serviceNameRequest<ResponseType>({
    method: RequestMethod.GET,
    path: '/resource'
});

if (result.isError()) {
    return error(result.value);
}

return success(result.value);
```

```typescript
// In consuming code (e.g., controller)
const result = await getFeatureById(id);

if (result.isError()) {
    return res.status(result.value.statusCode).json(result.value);
}

const feature = result.value;
```

**Either Monad API:**
| Method/Property | Description |
|-----------------|-------------|
| `success(value)` | Create success Either |
| `error(err)` | Create error Either |
| `result.isError()` | Check if Either is error |
| `result.value` | Access wrapped value (error or success) |

---

## Request Method Enum

All services use the shared `RequestMethod` enum:

```typescript
enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    PUT = 'PUT',
    DELETE = 'DELETE'
}
```

---

## Environment Configuration

Request handlers use environment variables for configuration:

| Variable | Purpose |
|----------|---------|
| `IS_LOCAL` | Switch between local and deployed URLs |
| `SERVICE_HOST` | Deployed service hostname |
| `SERVICE_PORT` | Deployed service port |
| `SERVICE_KEY` | JWT authentication key |
| `IS_INTEGRATION_TESTING` | Bypass requests during integration tests |

---

## Services Reference

| Service | Purpose | Auth Type |
|---------|---------|-----------|
| `configService` | Configuration variable management | JWT |
| `kardService` | Rewards system integration | JWT |
| `launchDarklyService` | Feature flag management | SDK |
| `monolithService` | Internal monolith API | JWT |
| `paymentsService` | Payment processing | JWT |
| `semaphoresService` | Distributed locking | JWT |
| `unitService` | Unit.co bank API | Bearer Token |
| `usersAuthSessionsService` | User authentication | JWT |

---

## Checklist for New Services

When creating a new service library:

- [ ] Create `{serviceName}/` directory
- [ ] Create `{serviceName}.types.ts` with request params interface
- [ ] Create `{serviceName}.request.ts` with request handler
- [ ] Create `__mocks__/{serviceName}.request.ts` with Jest mock
- [ ] Create `index.ts` with barrel exports
- [ ] For each feature:
  - [ ] Create `{featureName}/` directory
  - [ ] Create `{featureName}.types.ts` with domain types
  - [ ] Create `{featureName}.errors.ts` with error classes
  - [ ] Create `{featureName}.service.ts` with service functions
  - [ ] Create `index.ts` with barrel exports
- [ ] Add feature exports to service `index.ts`
