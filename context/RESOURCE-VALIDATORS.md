# Resource Validators

Resource validators are Express middleware functions that verify ownership and access permissions for resources before allowing requests to proceed. They ensure that users can only access resources they own, providing a security layer between authentication and business logic.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Existing Validators](#existing-validators)
  - [userChatIdValidator](#userchatidvalidator)
  - [userChatMessageIdValidator](#userchatmessageidvalidator)
- [How to Implement a Resource Validator](#how-to-implement-a-resource-validator)
  - [Step 1: Create the Directory Structure](#step-1-create-the-directory-structure)
  - [Step 2: Define Custom Error Classes](#step-2-define-custom-error-classes)
  - [Step 3: Create the Helper Function](#step-3-create-the-helper-function)
  - [Step 4: Create the Middleware Function](#step-4-create-the-middleware-function)
  - [Step 5: Export from Index](#step-5-export-from-index)
- [Usage in Routes](#usage-in-routes)

---

## Overview

Resource validators follow a consistent pattern:

1. **Error Classes** - Custom error types extending `ResourceError` for specific validation failures
2. **Helper Function** - Core validation logic that checks resource existence and ownership
3. **Middleware Function** - Express middleware that extracts parameters and calls the helper
4. **Index Exports** - Clean re-exports for easy importing

## Architecture

```
middleware/
└── {resourceName}Validator/
    ├── index.ts                        # Re-exports
    ├── {resourceName}Validator.ts      # Express middleware
    ├── {resourceName}Validator.helper.ts   # Validation logic
    └── {resourceName}Validator.errors.ts   # Custom error classes
```

---

## Existing Validators

### userChatIdValidator

Validates that a chat exists and belongs to the requesting user.

#### `index.ts`

```typescript
export * from './userChatIdValidator';

export * from './userChatIdValidator.helper';
```

#### `userChatIdValidator.errors.ts`

```typescript
import { ResourceError } from '../../errors';

export class ChatNotFoundError extends ResourceError {
    public constructor () {
        const message = 'Chat with the given id not found.';
        const statusCode = 404;
        const code = 'USER_CHAT_ID_VALIDATION_CHAT_NOT_FOUND';
        super( {
            message
            , statusCode
            , code
        } );
    }
}

export class ChatAccessDeniedError extends ResourceError {
    public constructor () {
        const message = 'Access denied to the specified chat.';
        const statusCode = 403;
        const code = 'CHAT_ACCESS_DENIED';
        super( {
            message
            , statusCode
            , code
        } );
    }
}
```

#### `userChatIdValidator.helper.ts`

```typescript
import { getChatById } from '../../app/v0/users/usersChats/usersChats.service';
import {
    ChatNotFoundError
    , ChatAccessDeniedError
} from './userChatIdValidator.errors';

export const validateChatOwnership = async (
    chatId: number
    , userId: string
): Promise<void> => {

    // get the chat by id
    const getChatByIdResult = await getChatById( chatId );

    // check for errors
    if ( getChatByIdResult.isError() ) {

        // if chat not found, throw specific error
        if ( getChatByIdResult.value.code === 'GET_CHAT_BY_CHAT_ID_NOT_FOUND' ) {
            throw new ChatNotFoundError();
        }

        // throw the original error for other cases
        throw getChatByIdResult.value;
    }

    // extract the chat data
    const chat = getChatByIdResult.value;

    // check if chat data exists
    if ( !chat ) {
        throw new ChatNotFoundError();
    }

    // check if chat belongs to the user
    if ( chat.userId !== userId ) {
        throw new ChatAccessDeniedError();
    }
};
```

#### `userChatIdValidator.ts`

```typescript
import {
    Request
    , Response
    , NextFunction
} from 'express';
import { ResourceError } from '../../errors';
import { validateChatOwnership } from './userChatIdValidator.helper';

export const userChatIdValidator = async (
    req: Request
    , res: Response<ResourceError>
    , next: NextFunction
): Promise<Response<ResourceError> | void> => {

    // get chatId from request body
    const { chatId } = req.body;

    // if no chatId provided, skip validation (chat will be created)
    if ( !chatId ) {
        return next();
    }

    // get userId from URL params
    const { userId } = req.params;

    try {
        await validateChatOwnership( chatId, userId );
        return next();
    } catch ( validationError ) {
        const error = validationError as ResourceError;
        return res
            .status( error.statusCode )
            .json( error );
    }
};
```

---

### userChatMessageIdValidator

Validates that a message exists, belongs to the specified chat, and that the user owns the chat.

#### `index.ts`

```typescript
export * from './userChatMessageIdValidator';

export * from './userChatMessageIdValidator.helper';
```

#### `userChatMessageIdValidator.errors.ts`

```typescript
import { ResourceError } from '../../errors';

export class MessageNotInSpecifiedChat extends ResourceError {
    public constructor ( messageId: number, chatId: number ) {
        const clientMessage = `Message with id ${ messageId } does not belong to chat ${ chatId }.`;
        const code = 'MESSAGE_NOT_IN_SPECIFIED_CHAT';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class UnauthorizedChatAccess extends ResourceError {
    public constructor () {
        const clientMessage = `You are not authorized to access this chat.`;
        const code = 'UNAUTHORIZED_CHAT_ACCESS';
        const statusCode = 403;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class UserChatMessageIdValidatorMessageIdRequired extends ResourceError {
    public constructor () {
        const clientMessage = `Message ID is required.`;
        const code = 'USER_CHAT_MESSAGE_ID_VALIDATOR_MESSAGE_ID_REQUIRED';
        const statusCode = 400;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class UserChatMessageIdValidatorChatIdRequired extends ResourceError {
    public constructor () {
        const clientMessage = `Chat ID is required.`;
        const code = 'USER_CHAT_MESSAGE_ID_VALIDATOR_CHAT_ID_REQUIRED';
        const statusCode = 400;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class UserChatMessageIdValidatorUserIdRequired extends ResourceError {
    public constructor () {
        const clientMessage = `User ID is required.`;
        const code = 'USER_CHAT_MESSAGE_ID_VALIDATOR_USER_ID_REQUIRED';
        const statusCode = 400;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
```

#### `userChatMessageIdValidator.helper.ts`

```typescript
import {
    MessageNotInSpecifiedChat
    , UnauthorizedChatAccess
    , UserChatMessageIdValidatorMessageIdRequired
    , UserChatMessageIdValidatorChatIdRequired
    , UserChatMessageIdValidatorUserIdRequired
} from './userChatMessageIdValidator.errors';
import { getMessageAndChatByMessageId } from '../../app/v0/users/usersChats/usersMessages/usersMessages.service';

export const validateMessageOwnership = async (
    messageId: number
    , chatId: number
    , userId: string
): Promise<void> => {

    // check for falsy messageId
    if ( !messageId ) {
        throw new UserChatMessageIdValidatorMessageIdRequired();
    }

    // check for falsy chatId
    if ( !chatId ) {
        throw new UserChatMessageIdValidatorChatIdRequired();
    }

    // check for falsy userId
    if ( !userId ) {
        throw new UserChatMessageIdValidatorUserIdRequired();
    }

    // call service function to get message and chat by messageId
    const getMessageAndChatByMessageIdResult = await getMessageAndChatByMessageId( messageId );

    // check for errors
    if ( getMessageAndChatByMessageIdResult.isError() ) {

        // throw the error
        throw getMessageAndChatByMessageIdResult.value;
    }

    // store the message and chat date in memory
    const messageAndChat = getMessageAndChatByMessageIdResult.value;

    // check if message belongs to the specified chat
    if ( Number( messageAndChat.chatByChatId?.id ) !== chatId ) {

        throw new MessageNotInSpecifiedChat( messageId, chatId );
    }

    // check if user owns the chat
    if ( messageAndChat.chatByChatId?.userId !== userId ) {

        throw new UnauthorizedChatAccess();
    }


};
```

#### `userChatMessageIdValidator.ts`

```typescript
import {
    Request, Response, NextFunction
} from 'express';
import { ResourceError } from '../../errors';
import { validateMessageOwnership } from './userChatMessageIdValidator.helper';

export const userChatMessageIdValidator = async (
    req: Request
    , res: Response<ResourceError>
    , next: NextFunction
): Promise<Response<ResourceError> | void> => {

    // get messageId, chatId, and userId from URL params
    const { messageId, chatId, userId } = req.params;

    try {
        // validate that the message belongs to the chat and user
        await validateMessageOwnership( Number( messageId ), Number( chatId ), userId );

        // validation passed, continue to next middleware
        return next();

    } catch ( validationError ) {

        // cast the error to ResourceError type
        const error = validationError as ResourceError;

        // return error response with status code and error details
        return res
            .status( error.statusCode )
            .json( error );
    }

};
```

---

## How to Implement a Resource Validator

Follow these steps to create a new resource validator for any arbitrary resource.

### Step 1: Create the Directory Structure

Create a new directory under `middleware/` with the naming convention `{resourceName}Validator/`:

```
middleware/
└── myResourceIdValidator/
    ├── index.ts
    ├── myResourceIdValidator.ts
    ├── myResourceIdValidator.helper.ts
    └── myResourceIdValidator.errors.ts
```

### Step 2: Define Custom Error Classes

Create error classes for each validation failure scenario. All errors should extend `ResourceError`.

**`myResourceIdValidator.errors.ts`**

```typescript
import { ResourceError } from '../../errors';

// Error when resource is not found
export class MyResourceNotFoundError extends ResourceError {
    public constructor () {
        const message = 'Resource with the given id not found.';
        const clientMessage = 'The requested resource could not be found.';
        const statusCode = 404;
        const code = 'MY_RESOURCE_NOT_FOUND';
        super( {
            message
            , clientMessage
            , statusCode
            , code
        } );
    }
}

// Error when user doesn't have access to the resource
export class MyResourceAccessDeniedError extends ResourceError {
    public constructor () {
        const message = 'Access denied to the specified resource.';
        const clientMessage = 'You do not have permission to access this resource.';
        const statusCode = 403;
        const code = 'MY_RESOURCE_ACCESS_DENIED';
        super( {
            message
            , clientMessage
            , statusCode
            , code
        } );
    }
}

// Error when required parameter is missing
export class MyResourceIdRequiredError extends ResourceError {
    public constructor () {
        const clientMessage = 'Resource ID is required.';
        const code = 'MY_RESOURCE_ID_REQUIRED';
        const statusCode = 400;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
```

**Error Class Guidelines:**

| Scenario | Status Code | Description |
|----------|-------------|-------------|
| Resource not found | 404 | The resource doesn't exist |
| Access denied | 403 | User doesn't own/have access to the resource |
| Missing parameter | 400 | Required ID or parameter not provided |
| Other validation failure | 400 | General bad request |

### Step 3: Create the Helper Function

The helper function contains the core validation logic. It should:

1. Validate required parameters
2. Fetch the resource from the database
3. Check if the resource exists
4. Verify ownership/access permissions
5. Throw appropriate errors on failure

**`myResourceIdValidator.helper.ts`**

```typescript
import { getMyResourceById } from '../../app/v0/myResource/myResource.service';
import {
    MyResourceNotFoundError
    , MyResourceAccessDeniedError
    , MyResourceIdRequiredError
} from './myResourceIdValidator.errors';

export const validateMyResourceOwnership = async (
    resourceId: number
    , userId: string
): Promise<void> => {

    // 1. Validate required parameters
    if ( !resourceId ) {
        throw new MyResourceIdRequiredError();
    }

    // 2. Fetch the resource from the database
    const getResourceResult = await getMyResourceById( resourceId );

    // 3. Check for service errors
    if ( getResourceResult.isError() ) {
        // Handle specific error codes
        if ( getResourceResult.value.code === 'RESOURCE_NOT_FOUND' ) {
            throw new MyResourceNotFoundError();
        }
        // Rethrow other errors
        throw getResourceResult.value;
    }

    // 4. Extract resource data
    const resource = getResourceResult.value;

    // 5. Check if resource exists
    if ( !resource ) {
        throw new MyResourceNotFoundError();
    }

    // 6. Verify ownership
    if ( resource.userId !== userId ) {
        throw new MyResourceAccessDeniedError();
    }
};
```

### Step 4: Create the Middleware Function

The middleware function is an Express middleware that:

1. Extracts parameters from the request (params, body, or query)
2. Calls the helper function
3. Handles errors and sends appropriate responses

**`myResourceIdValidator.ts`**

```typescript
import {
    Request
    , Response
    , NextFunction
} from 'express';
import { ResourceError } from '../../errors';
import { validateMyResourceOwnership } from './myResourceIdValidator.helper';

export const myResourceIdValidator = async (
    req: Request
    , res: Response<ResourceError>
    , next: NextFunction
): Promise<Response<ResourceError> | void> => {

    // Extract parameters (adjust based on your route structure)
    const { resourceId } = req.params;
    const { userId } = req.params;

    // Optional: Skip validation if resource ID is not provided
    // (useful for create operations)
    if ( !resourceId ) {
        return next();
    }

    try {
        // Call the validation helper
        await validateMyResourceOwnership( Number( resourceId ), userId );
        
        // Validation passed, continue to next middleware
        return next();
        
    } catch ( validationError ) {
        // Cast and return error response
        const error = validationError as ResourceError;
        return res
            .status( error.statusCode )
            .json( error );
    }
};
```

### Step 5: Export from Index

Create clean re-exports for easy importing.

**`index.ts`**

```typescript
export * from './myResourceIdValidator';

export * from './myResourceIdValidator.helper';
```

---

## Usage in Routes

Apply the validator middleware in your route definitions:

```typescript
import { Router } from 'express';
import { myResourceIdValidator } from '../../middleware/myResourceIdValidator';
import { sessionValidator } from '../../middleware/sessionValidator';

const router = Router();

// Apply validators in the middleware chain
router.get(
    '/users/:userId/resources/:resourceId'
    , sessionValidator          // First: verify user is authenticated
    , myResourceIdValidator     // Second: verify user owns the resource
    , myResourceController.get  // Third: handle the request
);

router.patch(
    '/users/:userId/resources/:resourceId'
    , sessionValidator
    , myResourceIdValidator
    , myResourceController.update
);

router.delete(
    '/users/:userId/resources/:resourceId'
    , sessionValidator
    , myResourceIdValidator
    , myResourceController.delete
);

export default router;
```

---

## Base Error Class Reference

All validator errors extend the `ResourceError` class:

```typescript
import { ErrorConstructorParams } from '../types';
import { getNamespaceAttribute } from '../utils/clsNamespace';

const DEFAULT_ERROR_MESSAGE = 'We experienced an internal error. Please try again or contact support for assistance.';

export class ResourceError extends Error {
    message: string;
    clientMessage: string;
    code: string;
    error?: Error | unknown;
    requestId?: string;
    statusCode: number;

    constructor ( {
        message = DEFAULT_ERROR_MESSAGE
        , clientMessage = DEFAULT_ERROR_MESSAGE
        , code = 'INTERNAL_SERVER_ERROR'
        , error
        , statusCode = 500
    }: ErrorConstructorParams ) {
        super();

        const requestId = getNamespaceAttribute<string>( 'requestId' );

        this.message = message;
        this.clientMessage = clientMessage;
        this.code = code;
        this.error = error;
        this.requestId = requestId;
        this.statusCode = statusCode;
    }
}
```

**Properties:**

| Property | Description |
|----------|-------------|
| `message` | Internal error message (for logging) |
| `clientMessage` | User-facing error message (sent in response) |
| `code` | Unique error code for programmatic handling |
| `statusCode` | HTTP status code |
| `requestId` | Automatically populated request ID for tracing |
| `error` | Optional underlying error for debugging |
