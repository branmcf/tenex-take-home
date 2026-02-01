# COLLECTION STANDARDS

This document describes the coding standards and patterns used in the `/app/cards` module.

## Directory Structure

```
/app/cards/
├── index.ts                    # Public API exports
├── cards.types.ts              # Type definitions
├── cards.errors.ts             # Custom error classes
├── cards.validation.ts         # Joi validation schemas
├── cards.ctrl.ts               # Request handlers
├── cards.router.ts             # Route definitions
├── cards.helper.ts             # Utility functions
├── cardPinStatus/              # Nested feature module
│   ├── index.ts
│   ├── cardPinStatus.types.ts
│   ├── cardPinStatus.validation.ts
│   ├── cardPinStatus.ctrl.ts
│   └── cardPinStatus.router.ts
└── mobileWalletPayloads/       # Nested feature module
    ├── index.ts
    ├── mobileWalletPayloads.types.ts
    ├── mobileWalletPayloads.validation.ts
    ├── mobileWalletPayloads.ctrl.ts
    └── mobileWalletPayloads.router.ts
```

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| File names | `{moduleName}.{type}.ts` | `cards.ctrl.ts` |
| Route validators | SCREAMING_SNAKE_CASE | `CREATE_CARD`, `GET_CARD_PIN_STATUS` |
| Router instances | camelCase + Router suffix | `cardsRouter`, `cardPinStatusRouter` |
| Handler functions | camelCase + Handler suffix | `createCardHandler`, `getCardPinStatusHandler` |
| Helper functions | camelCase | `getCardCount`, `hasExistingCard` |
| Error classes | PascalCase | `CreateCardInsufficientFunds`, `CardAlreadyExists` |
| Type interfaces | PascalCase | `Card`, `CreateNewCardRequest` |

---

## File Type Standards

### Controller Files (`*.ctrl.ts`)

Controllers handle HTTP request/response logic. Each handler function processes a single endpoint.

**NatSpec/TSDoc is required:**

- Every exported controller/handler function in a `*.ctrl.ts` file **must** include a NatSpec-style doc comment (`/** ... */`) immediately above the function.
- At minimum include: `@title`, `@notice`, and `@param` entries for `req` and `res`.

**Structure:**
```typescript
/**
 * @title {Action} Handler
 * @notice Briefly describe what this endpoint does.
 * @param req The Express request object
 * @param res The Express response object
 */
export const {actionName}Handler = async (
    req: SpecificRequestType,
    res: Response<ResourceError | SuccessType>
): Promise<Response<ResourceError | SuccessType>> => {
    // 1. Extract params/query/body from request
    const { param } = req.params;
    const { field } = req.body;

    // 2. Call service function(s)
    const result = await serviceFunction(param, field);

    // 3. Check for errors
    if (result.isError()) {
        return res.status(result.value.statusCode).json(result.value);
    }

    // 4. Transform service response to domain model
    const domainModel: DomainType = {
        id: result.value.data.id,
        // ... map fields
    };

    // 5. Return success response
    return res.status(200).json(domainModel);
};
```

**Key Patterns:**

- Use destructuring to extract request data
- Always check `.isError()` after service calls
- Transform external service types to internal domain types
- Use early return pattern for error handling
- For non-blocking operations, use fire-and-forget with `.then()`:

```typescript
createFee({...}).then(result => {
    if (result.isError()) {
        console.error(result.value);
    }
});
```

---

## Collection completion checklist

When a collection is “complete” (routes + controllers + types + validation + exports are in place), the final step is to add an `AGENTS.md` file in the collection folder documenting:

- the public API (routes, method/path, response shape)
- file responsibilities
- extension guidance (how to add endpoints without breaking conventions)
- testing guidance (where tests should live and what to cover)

### Error Files (`*.errors.ts`)

Error files define domain-specific error classes that extend `ResourceError`.

**Structure:**
```typescript
import { ResourceError } from 'errors';

export class CustomError extends ResourceError {
    public constructor() {
        const message = 'User-facing error message';
        const statusCode = 400;
        const code = 'MACHINE_READABLE_CODE';
        super({ message, code, statusCode });
    }
}
```

**Requirements:**
- All errors extend `ResourceError`
- Define `message` (user-facing), `statusCode` (HTTP status), and `code` (machine-readable)
- Class names describe the error condition (e.g., `CreateCardInsufficientFunds`, `CardAlreadyExists`)

---

### Helper Files (`*.helper.ts`)

Helpers contain pure utility functions for business logic.

**Structure:**
```typescript
import { Either, error, success } from 'types';
import { CustomError } from './module.errors';

// Pure transformation function
export const transformData = (input: InputType[]): OutputType => {
    return {
        count: input.length,
        // ... transform
    };
};

// Function with error handling (Either monad)
export const validateCondition = (
    data: DataType[],
    condition: string
): Either<CustomError, boolean> => {
    if (someCondition) {
        return error(new CustomError());
    }
    return success(true);
};
```

**Key Patterns:**
- Functions should be pure with no side effects
- Use `Either` monad for functions that can fail
- Return typed responses for consistency

---

### Router Files (`*.router.ts`)

Routers define route paths and middleware chains.

**Structure:**
```typescript
import express from 'express';
import { requestValidator } from 'middleware';
import { wrapAsync } from 'server/server.helper';
import { VALIDATION_SCHEMA } from './module.validation';
import { handlerFunction } from './module.ctrl';
import { nestedRouter } from './nestedModule';

export const moduleRouter = express.Router();

// Mount nested routers
moduleRouter.use('/:paramId/nested-path', nestedRouter);

// Define routes
moduleRouter
    .post('/', requestValidator(CREATE_SCHEMA), wrapAsync(createHandler))
    .get('/', requestValidator(GET_SCHEMA), wrapAsync(getHandler))
    .get('/:id', requestValidator(GET_BY_ID_SCHEMA), wrapAsync(getByIdHandler));
```

**Nested Router Pattern:**
```typescript
// In nested module
export const nestedRouter = express.Router({ mergeParams: true });

nestedRouter
    .get('/', requestValidator(SCHEMA), wrapAsync(handler));
```

**Middleware Chain Order:**
1. `requestValidator(schema)` - Validates request against Joi schema
2. `wrapAsync(handler)` - Wraps async handler for error handling

---

### Types Files (`*.types.ts`)

Type files define interfaces for requests, responses, and domain models.

**Structure:**
```typescript
import { Request } from 'express';

// Domain model interface
export interface Card {
    id: string;
    accountId: string;
    status: CardStatus;
    // ... properties
}

// Request with body
export interface CreateCardRequest extends Request {
    body: {
        accountId: string;
        type: 'individualDebitCard' | 'individualVirtualDebitCard';
        // ... fields
    };
}

// Request with params
export interface CardIdParamRequest extends Request {
    params: {
        cardId: string;
    };
}

// Request with params and body
export interface ReplaceCardRequest extends Request {
    params: {
        cardId: string;
    };
    body: {
        shippingAddress: ShippingAddress;
    };
}

// Type alias for reuse
export type GetCardRequest = CardIdParamRequest;

// Response type
export interface CardCountResponse {
    physical: number;
    virtual: number;
}

// Array response alias
export type GetCardsResponse = Card[];
```

**Key Patterns:**
- Extend Express `Request` type with specific shapes for `params`, `body`, `query`
- Use type aliases for requests that share the same shape
- Define response interfaces for structured responses
- Import shared types from parent modules when in subdirectories

---

### Validation Files (`*.validation.ts`)

Validation files define Joi schemas for request validation.

**Structure:**
```typescript
import Joi from 'joi';

// Reusable schema objects
const shippingAddress = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().regex(/^[A-Z]{2}$/).required(),
    postalCode: Joi.string().regex(/^[0-9]{5}$/).required(),
    country: Joi.string().equal('US').required()
});

// Base schemas for extension
const cardParamsSchema = Joi.object({
    params: Joi.object({
        cardId: Joi.string().required()
    }).required()
});

// Exported validation schemas (SCREAMING_SNAKE_CASE)
export const CREATE_CARD = Joi.object({
    body: Joi.object({
        accountId: Joi.string().required(),
        type: Joi.string()
            .equal('individualDebitCard')
            .equal('individualVirtualDebitCard')
            .required(),
        shippingAddress: shippingAddress.optional()
    }).options({ presence: 'required' }).required()
});

// Schema extension pattern
export const REPLACE_CARD = cardParamsSchema.append({
    body: Joi.object({
        shippingAddress: shippingAddress.required()
    }).required()
});

// Schema reuse
export const GET_CARD = cardParamsSchema;
```

**Validation Patterns:**

| Pattern | Example |
|---------|---------|
| Required string | `Joi.string().required()` |
| Regex validation | `Joi.string().regex(/^[0-9]{5}$/)` |
| Enum values | `Joi.string().equal('value1').equal('value2')` |
| Optional with empty | `Joi.string().optional().allow('')` |
| Nested object | `Joi.object({ ... }).required()` |
| All fields required | `.options({ presence: 'required' })` |

**Conditional Validation:**
```typescript
design: Joi.any()
    .valid()
    .when('type', {
        is: 'individualVirtualDebitCard',
        then: Joi.string().optional(),
        otherwise: Joi.string().required()
    })
```

**Schema Reuse Across Modules:**
```typescript
// In subdirectory, import parent schemas
import { PARENT_SCHEMA, baseParamsSchema } from '../module.validation';

// Reuse directly
export const GET_ITEM = PARENT_SCHEMA;

// Or extend
export const CREATE_ITEM = baseParamsSchema.append({
    body: Joi.object({ ... }).required()
});
```

---

## Index File Standards

**Root Module (`/app/cards/index.ts`):**
```typescript
export * from './cards.router';
export * from './cards.types';
```
- Export only router and types
- Handlers, helpers, and errors are not directly exported

**Subdirectory (`/app/cards/nestedModule/index.ts`):**
```typescript
export * from './nestedModule.router';
```
- Export only the router
- Types are imported directly when needed by other modules

---

## Import Organization

**Standard Import Order:**
1. External packages (`express`, `joi`)
2. Internal libraries (`lib/unitService`, `lib/configService`)
3. Shared utilities (`errors`, `types`, `middleware`)
4. Parent module imports (`../index`, `../module.validation`)
5. Local module imports (`./module.types`, `./module.ctrl`)

---

## Error Handling Pattern

The module uses the Either monad pattern for error handling:

```typescript
// Service call returns Either type
const result = await serviceFunction(params);

// Check for error
if (result.isError()) {
    return res.status(result.value.statusCode).json(result.value);
}

// Access success value
const data = result.value.data;
```

**Parallel Operations:**
```typescript
const [result1, result2] = await Promise.all([
    operation1(),
    operation2()
]);

if (result1.isError()) {
    return res.status(result1.value.statusCode).json(result1.value);
}
if (result2.isError()) {
    return res.status(result2.value.statusCode).json(result2.value);
}
```

---

## Response Transformation

Always transform external service types to internal domain types:

```typescript
// Service returns CardUnit (external type)
const cardUnit = result.value.data;

// Transform to Card (internal domain type)
const card: Card = {
    id: cardUnit.id,
    accountId: cardUnit.relationships.account.data.id,
    status: cardUnit.attributes.status,
    // ... map all required fields
};

return res.status(200).json(card);
```
