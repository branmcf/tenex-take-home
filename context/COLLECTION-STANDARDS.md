# COLLECTION STANDARDS

This document describes the coding standards and patterns used for a **collection** in `/app/v0`. The goal is to give an LLM everything needed to implement a full collection **in this codebase's style** without mixing concerns, changing patterns, or inventing new conventions.

---

## Directory Structure

### Full Collection

```
/app/v0/<parent>/<collection>/
├── index.ts                                # Public API exports
├── <collection>.types.ts                   # Request/response/domain types
├── <collection>.errors.ts                  # Custom ResourceError classes
├── <collection>.validation.ts              # Joi schemas
├── <collection>.ctrl.ts                    # Express handlers
├── <collection>.router.ts                  # Express routes
├── <collection>.helper.ts                  # Pure helpers / business logic
├── <collection>.service.ts                 # Postgraphile queries/mutations
└── <collection>.service.generatedTypes.ts  # GraphQL types (auto-generated)
```

### Nested Modules

Nested modules mirror this structure with their own files. Example:

```
/app/v0/users/usersChats/
├── index.ts
├── usersChats.types.ts
├── usersChats.errors.ts
├── usersChats.validation.ts
├── usersChats.ctrl.ts
├── usersChats.router.ts
├── usersChats.helper.ts
├── usersChats.service.ts
├── usersChats.service.generatedTypes.ts
└── usersMessages/                          # Nested feature module
    ├── index.ts
    ├── usersMessages.types.ts
    ├── usersMessages.errors.ts
    ├── usersMessages.validation.ts
    ├── usersMessages.ctrl.ts
    ├── usersMessages.router.ts
    ├── usersMessages.helper.ts
    ├── usersMessages.service.ts
    ├── usersMessages.service.generatedTypes.ts
    └── usersMessagesLikes/                 # Deeper nesting
        ├── index.ts
        ├── ...
```

---

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| File names | `{collection}.{type}.ts` | `userSubscriptionCredits.ctrl.ts` |
| Joi schema exports | SCREAMING_SNAKE_CASE | `GET_USER_SUBSCRIPTION_CREDITS`, `CREATE_MESSAGE` |
| Router instances | camelCase + Router suffix | `userSubscriptionCreditsRouter` |
| Handler functions | camelCase + Handler suffix | `getUserSubscriptionCreditsHandler` |
| Helper functions | camelCase (descriptive verb) | `findLatestValidUserSubscriptionCredit`, `validateUserHasActiveCredits` |
| Service functions | verb + resource noun | `getUserSubscriptionCredits`, `createUserSubscriptionCredit`, `updateMessageById` |
| Error classes | PascalCase (descriptive condition) | `UserSubscriptionCreditsNotFound`, `InsufficientCredits` |
| Types/interfaces | PascalCase | `GetUserSubscriptionCreditsRequest`, `CreateUserMessageResponse` |
| Type aliases | PascalCase | `UserSubscriptionCredit`, `NonNullableMessages` |

---

## Comment Style and Frequency

This codebase uses **dense, step-by-step inline comments**:

- **Every meaningful block** is preceded by a short comment explaining intent
- Comments describe **what** and **why**, not just restating code
- Prefer small, focused comments rather than large narrative sections
- Avoid TODOs or speculative comments in committed code
- Use `/* eslint-disable ... */` at file top when needed (common in generated types)

**Example pattern:**

```typescript
// get the userId from the url params
const { userId } = req.params;

// get the user subscription credits from the database
const getUserSubscriptionCreditsResult = await getUserSubscriptionCredits( userId );

// check for errors
if ( getUserSubscriptionCreditsResult.isError() ) {

    // return the error
    return res
        .status( getUserSubscriptionCreditsResult.value.statusCode )
        .json( getUserSubscriptionCreditsResult.value );
}

// store the validated subscription credits in memory
const currentValidUserSubscriptionCredits = validatedSubscriptionCredits.value;
```

---

## Core Pattern: The Either Monad

All service functions and many helpers return `Either<ResourceError, SuccessType>`.

### Either Type Definition

```typescript
export type Either<L, A> = Error<L, A> | Success<L, A>;

export class Error<L, A> {
    readonly value: L;
    constructor ( value: L ) { this.value = value; }
    isError (): this is Error<L, A> { return true; }
    isSuccess (): this is Success<L, A> { return false; }
}

export class Success<L, A> {
    readonly value: A;
    constructor ( value: A ) { this.value = value; }
    isError (): this is Error<L, A> { return false; }
    isSuccess (): this is Success<L, A> { return true; }
}

export const error = <L, A>( l: L ): Either<L, A> => new Error( l );
export const success = <L, A>( a: A ): Either<L, A> => new Success<L, A>( a );
```

### Usage Pattern

```typescript
import { Either, error, success } from '../../../../types';

// In service/helper functions:
if ( someConditionFailed ) {
    return error( new CustomError() );
}
return success( data );

// In controllers:
const result = await serviceFunction( params );

if ( result.isError() ) {
    return res.status( result.value.statusCode ).json( result.value );
}

// Access success value
const data = result.value;
```

### Parallel Operations

```typescript
const [resultA, resultB] = await Promise.all( [ opA(), opB() ] );

if ( resultA.isError() ) {
    return res.status( resultA.value.statusCode ).json( resultA.value );
}
if ( resultB.isError() ) {
    return res.status( resultB.value.statusCode ).json( resultB.value );
}

// Both succeeded
const dataA = resultA.value;
const dataB = resultB.value;
```

---

## File Type Standards

### Controller Files (`*.ctrl.ts`)

Controllers handle HTTP request/response logic **only**. They orchestrate service calls and helpers but contain no business logic or database access.

**NatSpec/TSDoc is OPTIONAL but recommended** for exported handlers:

```typescript
/**
 * @title Get User Subscription Credits Handler
 * @notice Returns the current valid subscription credits for a user.
 * @param req Express request
 * @param res Express response
 */
```

**Full Controller Structure:**

```typescript
import { Response } from 'express';
import { ResourceError } from '../../../../errors';
import { getUserSubscriptionCredits } from './userSubscriptionCredits.service';
import {
    GetUserSubscriptionCreditsRequest
    , GetUserSubscriptionCreditsResponse
} from './userSubscriptionCredits.types';
import { findLatestValidUserSubscriptionCredit } from './userSubscriptionCredits.helper';

export const getUserSubscriptionCreditsHandler = async (
    req: GetUserSubscriptionCreditsRequest
    , res: Response<ResourceError | GetUserSubscriptionCreditsResponse>
): Promise<Response<ResourceError | GetUserSubscriptionCreditsResponse>> => {

    // get the userId from the url params
    const { userId } = req.params;

    // get the user subscription credits from the database
    const getUserSubscriptionCreditsResult = await getUserSubscriptionCredits( userId );

    // check for errors
    if ( getUserSubscriptionCreditsResult.isError() ) {

        // return the error
        return res
            .status( getUserSubscriptionCreditsResult.value.statusCode )
            .json( getUserSubscriptionCreditsResult.value );
    }

    // get the latest valid subscription credits
    const validatedSubscriptionCredits
        = findLatestValidUserSubscriptionCredit( getUserSubscriptionCreditsResult.value );

    // check for errors
    if ( validatedSubscriptionCredits.isError() ) {

        // return the error
        return res
            .status( validatedSubscriptionCredits.value.statusCode )
            .json( validatedSubscriptionCredits.value );

    }

    // store the validated subscription credits in memory
    const currentValidUserSubscriptionCredits = validatedSubscriptionCredits.value;

    // map the credit data to response format
    const credits = {
        id: Number( currentValidUserSubscriptionCredits.id )
        , remainingCredits: Number( currentValidUserSubscriptionCredits.remainingCredits )
        , allocatedCredits: Number( currentValidUserSubscriptionCredits.allocatedCredits )
        , periodStart: currentValidUserSubscriptionCredits.periodStart
        , periodEnd: currentValidUserSubscriptionCredits.periodEnd
    };

    // return success
    return res.status( 200 ).json( { credits } );

};
```

**Controller Rules:**

- Controllers must **NOT** query the database directly
- Controllers must **NOT** contain complex business logic
- Controllers must call service functions for data access
- Controllers must call helper functions for business logic
- Always use the `Either` pattern (`result.isError()`)
- Always return early on error
- Always map external types (GraphQL/Postgraphile scalars) to response types
- Use `Number()` to convert BigInt scalars to numbers

**Fire-and-Forget Pattern** (for non-blocking operations):

```typescript
createFee( { ...params } ).then( result => {
    if ( result.isError() ) {
        console.error( result.value );
    }
} );
```

---

### Service Files (`*.service.ts`)

Services are the **ONLY** place that touch the database, using **Postgraphile v4**.

**What goes in a service file:**

- GraphQL query/mutation definitions with `gql` from `graphile-utils`
- Calls to `postGraphileRequest`
- Mapping of GraphQL response shapes into minimal success payloads
- Conversion of scalars when needed (e.g., `BigInt` to `number`, `Datetime` to ISO string)
- Error handling using `Either`, returning `ResourceError` or success

**What must NOT go in a service file:**

- Express request/response logic
- Joi validation
- Domain transformation helpers
- Business logic unrelated to IO

**Full Service Structure:**

```typescript
import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../../../types';
import { ResourceError } from '../../../../errors';
import { postGraphileRequest } from '../../../../lib/postGraphile';
import {
    GetUserSubscriptionCreditsQuery
    , GetUserSubscriptionCreditsQueryVariables
    , UpdateUserSubscriptionCreditsMutation
    , UpdateUserSubscriptionCreditsMutationVariables
    , CreateUserSubscriptionCreditMutation
    , CreateUserSubscriptionCreditMutationVariables
} from './userSubscriptionCredits.service.generatedTypes';
import {
    UserSubscriptionCreditsNotFound
    , UpdateUserSubscriptionCreditsFailed
    , CreateUserSubscriptionCreditsFailed
} from './userSubscriptionCredits.errors';

export const getUserSubscriptionCredits = async (
    userId: GetUserSubscriptionCreditsQueryVariables['userId']
): Promise<Either<ResourceError, GetUserSubscriptionCreditsQuery['userById']>> => {

    // create the graphql query
    const GET_USER_SUBSCRIPTION_CREDITS = gql`
        query getUserSubscriptionCredits($userId: String!) {
            userById(id: $userId) {
                userSubscriptionCreditsByUserId(
                    orderBy: CREATED_AT_DESC
                ) {
                    nodes {
                        nodeId
                        id
                        remainingCredits
                        allocatedCredits
                        periodStart
                        periodEnd
                        subscriptionId
                        stripeEventId
                        createdAt
                    }
                }
            }
        }
    `;

    // execute the graphql query
    const result = await postGraphileRequest<GetUserSubscriptionCreditsQuery, GetUserSubscriptionCreditsQueryVariables>(
        {
            query: GET_USER_SUBSCRIPTION_CREDITS
            , variables: { userId }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for user and credits
    if ( !result.value.userById?.userSubscriptionCreditsByUserId?.nodes?.length ) {

        // return custom error
        return error( new UserSubscriptionCreditsNotFound() );
    }

    // return success
    return success( result.value.userById );

};
```

**Mutation Example:**

```typescript
export const createUserSubscriptionCredit = async (
    params: {
        userId: string;
        subscriptionId: string | null;
        allocatedCredits: number;
        periodStart: Date;
        periodEnd: Date;
        stripeEventId: string;
    }
): Promise<Either<ResourceError, { id: string; allocatedCredits: number; remainingCredits: number }>> => {

    // create the graphql mutation
    const CREATE_USER_SUBSCRIPTION_CREDIT = gql`
        mutation createUserSubscriptionCredit(
            $userId: String!
            $subscriptionId: String
            $allocatedCredits: BigInt!
            $remainingCredits: BigInt!
            $periodStart: Datetime!
            $periodEnd: Datetime!
            $stripeEventId: String!
        ) {
            createUserSubscriptionCredit(input: {
                userSubscriptionCredit: {
                    userId: $userId
                    subscriptionId: $subscriptionId
                    allocatedCredits: $allocatedCredits
                    remainingCredits: $remainingCredits
                    periodStart: $periodStart
                    periodEnd: $periodEnd
                    stripeEventId: $stripeEventId
                }
            }) {
                userSubscriptionCredit {
                    id
                    allocatedCredits
                    remainingCredits
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<CreateUserSubscriptionCreditMutation, CreateUserSubscriptionCreditMutationVariables>(
        {
            mutation: CREATE_USER_SUBSCRIPTION_CREDIT
            , variables: {
                userId: params.userId
                , subscriptionId: params.subscriptionId
                , allocatedCredits: params.allocatedCredits
                , remainingCredits: params.allocatedCredits
                , periodStart: params.periodStart.toISOString()
                , periodEnd: params.periodEnd.toISOString()
                , stripeEventId: params.stripeEventId
            }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for falsy createUserSubscriptionCredit
    if ( !result.value.createUserSubscriptionCredit?.userSubscriptionCredit ) {

        // return custom error
        return error( new CreateUserSubscriptionCreditsFailed() );
    }

    // extract the credit data
    const creditData = result.value.createUserSubscriptionCredit.userSubscriptionCredit;

    // return success with mapped data
    return success( {
        id: creditData.id
        , allocatedCredits: Number( creditData.allocatedCredits )
        , remainingCredits: Number( creditData.remainingCredits )
    } );
};
```

**Update Mutation Example (using input object):**

```typescript
export const updateUserSubscriptionCredits = async (
    input: UpdateUserSubscriptionCreditsMutationVariables['input']
): Promise<Either<ResourceError, UpdateUserSubscriptionCreditsMutation['updateUserSubscriptionCredit']>> => {

    // create the graphql mutation
    const UPDATE_USER_SUBSCRIPTION_CREDITS = gql`
        mutation updateUserSubscriptionCredits($input: UpdateUserSubscriptionCreditInput!) {
            updateUserSubscriptionCredit(input: $input) {
                userSubscriptionCredit {
                    id
                    remainingCredits
                    allocatedCredits
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<UpdateUserSubscriptionCreditsMutation, UpdateUserSubscriptionCreditsMutationVariables>(
        {
            mutation: UPDATE_USER_SUBSCRIPTION_CREDITS
            , variables: { input }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for falsy updateUserSubscriptionCredit
    if ( !result.value.updateUserSubscriptionCredit ) {

        // return custom error
        return error( new UpdateUserSubscriptionCreditsFailed() );
    }

    // return success
    return success( result.value.updateUserSubscriptionCredit );

};
```

**Service Function Rules:**

1. Define GraphQL document **inside** the function (not at module level)
2. Always use `postGraphileRequest` with typed generics: `<QueryType, VariablesType>`
3. For queries, use `{ query: QUERY, variables: { ... } }`
4. For mutations, use `{ mutation: MUTATION, variables: { ... } }`
5. Always check `result.isError()` first and return `error( result.value )`
6. Always validate required data exists before calling `success()`
7. Prefer returning **minimal payloads** needed by controllers/helpers
8. Convert `BigInt` to `number` with `Number()` when needed
9. Convert `Date` to ISO string with `.toISOString()` for Datetime scalars

**postGraphileRequest Signature:**

```typescript
const result = await postGraphileRequest<TData, TVariables>(
    options: QueryOptions<TVariables> | MutationOptions<TData, TVariables>
): Promise<Either<ResourceError, TData>>
```

---

### Generated Types (`*.service.generatedTypes.ts`)

These files are **auto-generated** by GraphQL Codegen from your service file's `gql` queries/mutations.

**Rules:**

- **Do NOT edit manually** - they will be overwritten
- They provide types for Postgraphile query/mutation inputs and outputs
- They commonly have `/* eslint-disable */` at the top
- Services must import types from here, not re-define them
- They import base types from `../../../../lib/postGraphile/postGraphile.generatedTypes`

**Example generated file:**

```typescript
/* eslint-disable */
import * as Types from '../../../../lib/postGraphile/postGraphile.generatedTypes';

export type GetUserSubscriptionCreditsQueryVariables = Types.Exact<{
  userId: Types.Scalars['String']['input'];
}>;

export type GetUserSubscriptionCreditsQuery = {
    __typename: 'Query',
    userById?: {
        __typename: 'User',
        userSubscriptionCreditsByUserId: {
            __typename: 'UserSubscriptionCreditsConnection',
            nodes: Array<{
                __typename: 'UserSubscriptionCredit',
                nodeId: string,
                id: any,
                remainingCredits: any,
                allocatedCredits: any,
                periodStart: any,
                periodEnd: any,
                subscriptionId?: string | null,
                stripeEventId: string,
                createdAt: any
            } | null>
        }
    } | null
};
```

**To regenerate types after changing queries/mutations:**

```bash
npm run codegen
```

The codegen configuration is in `codegen.ts` and uses:
- `near-operation-file` preset to place generated types next to service files
- Scalar mappings (BigInt becomes any, Datetime becomes any, etc.)

---

### Helper Files (`*.helper.ts`)

Helpers contain **pure business logic** and transformations. No IO, no database, no network.

**What goes in a helper file:**

- Pure transformation functions
- Validation logic using Either monad
- Domain-specific calculations
- Data filtering/mapping

**What must NOT go in a helper file:**

- Database queries
- Express request/response handling
- Joi validation schemas
- API calls

**Pure Transformation Example:**

```typescript
export const transformData = ( input: InputType[] ): OutputType => {
    return {
        count: input.length
        , items: input.map( item => ( { id: item.id } ) )
    };
};
```

**Validation Helper with Either:**

```typescript
import {
    Either
    , error
    , success
} from '../../../../types';
import { ResourceError } from '../../../../errors';
import { GetUserSubscriptionCreditsQuery } from './userSubscriptionCredits.service.generatedTypes';
import { UserSubscriptionCreditsNotFound } from './userSubscriptionCredits.errors';
import { UserSubscriptionCredit } from './userSubscriptionCredits.types';

/**
 * find the latest valid user subscription credit for the current period
 *
 * @param userSubscriptionCreditsData - result.value from getUserSubscriptionCredits()
 * @returns Either<ResourceError, UserSubscriptionCredit> - latest valid credit
 */
export const findLatestValidUserSubscriptionCredit = (
    userSubscriptionCreditsData: GetUserSubscriptionCreditsQuery['userById']
): Either<ResourceError, NonNullable<UserSubscriptionCredit>> => {

    // get current time in UTC as ISO string
    const now = new Date().toISOString();

    // get all user subscription credits from the data
    const allUserSubscriptionCredits = userSubscriptionCreditsData?.userSubscriptionCreditsByUserId?.nodes || [];

    // This should never happen due to service validation, but safe fallback
    if ( allUserSubscriptionCredits.length === 0 ) {

        // return error for no valid credits found
        return error( new UserSubscriptionCreditsNotFound() );

    }

    // find the latest valid credit allocation for the current period
    const currentValidUserSubscriptionCredits = allUserSubscriptionCredits.find( row => {

        // handle the case where row could be null
        if ( !row ) {
            return false;
        }

        // compare ISO strings directly for UTC comparison
        return row.periodStart <= now && row.periodEnd > now;

    } );

    // check if we found valid credits for the current period
    if ( !currentValidUserSubscriptionCredits ) {

        // return error for no valid credits found
        return error( new UserSubscriptionCreditsNotFound() );
    }

    // return success with the latest valid credit record
    return success( currentValidUserSubscriptionCredits );

};
```

**Complex Validation Helper:**

```typescript
export const validateUserHasActiveCredits = async (
    userId: string
): Promise<Either<ResourceError, number>> => {

    // initialize total credits counter
    let totalCredits = 0;

    // check subscription credits
    const getUserSubscriptionCreditsResult = await getUserSubscriptionCredits( userId );

    // check for errors
    if ( getUserSubscriptionCreditsResult.isError() ) {

        // return the error
        return error( getUserSubscriptionCreditsResult.value );
    }

    // get the latest valid subscription credits
    const validatedSubscriptionCredits
        = findLatestValidUserSubscriptionCredit( getUserSubscriptionCreditsResult.value );

    // check for errors
    if ( validatedSubscriptionCredits.isError() ) {

        // return the error
        return error( validatedSubscriptionCredits.value );

    }

    // get the credit record
    const creditRecord = validatedSubscriptionCredits.value;

    // check if credit record exists
    if ( !creditRecord ) {

        // return credits not found error
        return error( new CreditsNotFound() );
    }

    // check if we're in the valid period
    const now = new Date().toISOString();
    const periodStart = new Date( creditRecord.periodStart ).toISOString();
    const periodEnd = new Date( creditRecord.periodEnd ).toISOString();

    if ( now < periodStart ) {

        // return credits not yet active error
        return error( new CreditsNotYetActive() );
    }

    if ( now > periodEnd ) {

        // return credits expired error
        return error( new CreditsExpired() );
    }

    // store the subscription credits in memory
    const subscriptionCredits = Number( creditRecord.remainingCredits );

    // add the subscription credits to the totalCredits
    totalCredits += subscriptionCredits;

    // ... additional logic ...

    if ( totalCredits <= 0 ) {

        // return insufficient credits error
        return error( new InsufficientCredits() );
    }

    // return success with total remaining credits count
    return success( totalCredits );
};
```

**Helper Rules:**

- Functions should be pure with no side effects (when possible)
- Use `Either` monad for functions that can fail
- Return typed responses for consistency
- Small, readable functions with inline comments
- No Express types; inputs are domain data from service results

---

### Router Files (`*.router.ts`)

Routers define Express routes and middleware chains.

**Basic Router Structure:**

```typescript
import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
} from '../../../../middleware';
import { getUserSubscriptionCreditsHandler } from './userSubscriptionCredits.ctrl';
import { sessionValidator } from '../../../../middleware/sessionValidator';

// create an express router
export const userSubscriptionCreditsRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
userSubscriptionCreditsRouter
    .get(
        '/'
        , sessionValidator
        , requestValidator( 'GET_USER_SUBSCRIPTION_CREDITS' )
        , requestHandlerErrorWrapper( getUserSubscriptionCreditsHandler )
    );
```

**Router with Multiple Routes:**

```typescript
export const usersMessagesRouter = express.Router( { mergeParams: true } );

usersMessagesRouter
    .post(
        '/'
        , requestValidator( 'CREATE_MESSAGE' )
        , requestHandlerErrorWrapper( createUserMessageHandler )
    )
    .get(
        '/:messageId'
        , requestValidator( 'GET_MESSAGE' )
        , requestHandlerErrorWrapper( getMessageHandler )
    );
```

**Nested Router Mounting:**

```typescript
import express from 'express';
import {
    subscriptionValidator
    , userChatIdValidator
    , userChatMessageIdValidator
} from '../../../../middleware';
import { usersMessagesRouter } from './usersMessages';
import { usersMessagesLikesRouter } from './usersMessages/usersMessagesLikes';

// create an express router
export const usersChatsRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
usersChatsRouter
    .use(
        '/messages'
        , subscriptionValidator
        , userChatIdValidator
        , usersMessagesRouter
    )
    .use(
        '/:chatId/messages/:messageId/likes'
        , subscriptionValidator
        , userChatMessageIdValidator
        , usersMessagesLikesRouter
    );
```

**Middleware Chain Order:**

1. `sessionValidator` (if route requires authentication)
2. `subscriptionValidator` (if route requires active subscription)
3. Custom validators (`userChatIdValidator`, `userChatMessageIdValidator`, etc.)
4. `requestValidator( 'SCHEMA_NAME' )` - validates request against Joi schema
5. `requestHandlerErrorWrapper( handler )` - wraps async handler for error handling

**Router Rules:**

- Always use `express.Router( { mergeParams: true } )` for nested modules
- Middleware order matters: auth then subscription then validation then handler
- Use `requestHandlerErrorWrapper` for all handlers (catches unhandled errors)
- Schema names in `requestValidator()` must match exports from validation file

---

### Types Files (`*.types.ts`)

Define **ALL** request/response/domain types here. Types must NOT be defined elsewhere.

**Request with Params:**

```typescript
import { Request } from 'express';

export interface GetUserSubscriptionCreditsRequest extends Request {
    params: {
        userId: string;
    };
}
```

**Request with Body:**

```typescript
export interface CreateUserMessageRequest extends Request {
    params: {
        userId: string;
    };

    body: {
        message: string;
        modelId: number;
        chatId: number | null;
        workflowContext?: {
            currentWorkflow: string | null;
            currentWorkflowId: string;
        };
        mode: MessageMode;
    };
}
```

**Request with Query:**

```typescript
export interface ListItemsRequest extends Request {
    params: {
        userId: string;
    };
    query: {
        limit?: string;
        offset?: string;
        filter?: string;
    };
}
```

**Response Types:**

```typescript
export interface GetUserSubscriptionCreditsResponse {
    credits: {
        id: number;
        remainingCredits: number;
        allocatedCredits: number;
        periodStart: string;
        periodEnd: string;
    };
}

export interface CreateUserMessageResponse {
    user: {
        id: string;
    };
    chat: {
        id: number;
    };
    userMessage: {
        id: number;
        content: string;
    };
    modelResponseMessage: {
        id: number;
        message: string;
        workflow: ValidatedAiResponse['data']['workflow'] | null;
        needs: ValidatedAiResponse['data']['needs'] | null;
    };
    model: {
        name: string;
    };
    provider: {
        name: string;
    };
    tokenUsage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
```

**Type Aliases for Domain Models:**

```typescript
import { GetUserSubscriptionCreditsQuery } from './userSubscriptionCredits.service.generatedTypes';
import { CreateMessageMutation } from './usersMessages.service.generatedTypes';

// Extract nested type from generated query
export type UserSubscriptionCredit = NonNullable<
    GetUserSubscriptionCreditsQuery['userById']
>['userSubscriptionCreditsByUserId']['nodes'][0];

// Extract mutation result type
export type CreatedMessage = NonNullable<
    NonNullable<CreateMessageMutation['createMessage']>['message']
>;

// Filter nulls from array
export type NonNullableMessages = NonNullableArrayItems<
    NonNullable<
        NonNullable<GetMessagesByChatIdQuery['chatById']>['messagesByChatId']
    >['nodes']
>;
```

**Reusing Request Types:**

```typescript
// Type alias when multiple routes share the same shape
export type GetCardRequest = CardIdParamRequest;
```

**Types Rules:**

- Extend `express.Request` with `params`, `body`, and `query` as needed
- Use explicit response shapes; never use inline objects in controllers
- Export shared domain type aliases for use in helpers
- Import generated types from `*.service.generatedTypes.ts`
- Use `NonNullable<>` to unwrap nullable GraphQL types

---

### Validation Files (`*.validation.ts`)

Define Joi schemas for request validation. Schema names must be in SCREAMING_SNAKE_CASE.

**Basic Validation:**

```typescript
import Joi from 'joi';

export const GET_USER_SUBSCRIPTION_CREDITS = Joi.object( {
    params: Joi.object( {
        userId: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );
```

**Validation with Body:**

```typescript
import Joi from 'joi';
import { MessageMode } from '../../../../../lib/postGraphile';

export const CREATE_MESSAGE = Joi.object( {
    params: Joi.object( {
        userId: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
    , body: Joi.object( {
        message: Joi.string()
            .trim()
            .min( 1 )
            .required()
        , modelId: Joi.number()
            .integer()
            .positive()
            .required()
        , chatId: Joi.number()
            .integer()
            .positive()
            .allow( null )
            .required()
        , workflowContext: Joi.object( {
            currentWorkflow: Joi.string()
                .trim()
                .min( 1 )
                .allow( null )
                .required()
            , currentWorkflowId: Joi.string()
                .trim()
                .min( 1 )
                .required()
        } ).optional()
        , mode: Joi.string()
            .trim()
            .min( 1 )
            .required()
            .valid( MessageMode.Create, MessageMode.Ask )
    } )
        .required()
        .options( { presence: 'required' } )
} );
```

**Validation Patterns Reference:**

| Pattern | Example |
|---------|---------|
| Required string | `Joi.string().required()` |
| Required string with trim | `Joi.string().trim().min( 1 ).required()` |
| Regex validation | `Joi.string().regex( /^[0-9]{5}$/ )` |
| Enum values (single) | `Joi.string().valid( 'value1', 'value2' )` |
| Enum values (from import) | `Joi.string().valid( MessageMode.Create, MessageMode.Ask )` |
| Optional field | `Joi.string().optional()` |
| Optional with empty | `Joi.string().optional().allow( '' )` |
| Nullable required | `Joi.number().allow( null ).required()` |
| Positive integer | `Joi.number().integer().positive().required()` |
| Nested object | `Joi.object( { ... } ).required()` |
| All fields required | `.options( { presence: 'required' } )` |

**Reusable Schema Objects:**

```typescript
const shippingAddress = Joi.object( {
    street: Joi.string().required()
    , city: Joi.string().required()
    , state: Joi.string().regex( /^[A-Z]{2}$/ ).required()
    , postalCode: Joi.string().regex( /^[0-9]{5}$/ ).required()
    , country: Joi.string().equal( 'US' ).required()
} );

const cardParamsSchema = Joi.object( {
    params: Joi.object( {
        cardId: Joi.string().required()
    } ).required()
} );
```

**Schema Extension Pattern:**

```typescript
export const REPLACE_CARD = cardParamsSchema.append( {
    body: Joi.object( {
        shippingAddress: shippingAddress.required()
    } ).required()
} );

// Schema reuse
export const GET_CARD = cardParamsSchema;
```

**Conditional Validation:**

```typescript
design: Joi.any()
    .valid()
    .when( 'type', {
        is: 'individualVirtualDebitCard'
        , then: Joi.string().optional()
        , otherwise: Joi.string().required()
    } )
```

**Schema Reuse Across Modules:**

```typescript
// In subdirectory, import parent schemas
import { PARENT_SCHEMA, baseParamsSchema } from '../module.validation';

// Reuse directly
export const GET_ITEM = PARENT_SCHEMA;

// Or extend
export const CREATE_ITEM = baseParamsSchema.append( {
    body: Joi.object( { ... } ).required()
} );
```

**CRITICAL: Schema Registration:**

All validation schemas must be imported into `middleware/requestValidator/requestValidator.schemas.ts`:

```typescript
import * as UsersSubscriptionCreditsSchemas from '../../app/v0/users/userSubscriptionCredits/userSubscriptionCredits.validation';

export const SCHEMAS = {
    ...UsersSubscriptionCreditsSchemas
    // ... other schemas
};
```

The `SchemaName` type is derived from this object. Only SCREAMING_SNAKE_CASE keys are valid schema names.

---

### Error Files (`*.errors.ts`)

Define domain-specific error classes that extend `ResourceError`.

**Error Class Structure:**

```typescript
import { ResourceError } from '../../../../errors';

export class UserSubscriptionCreditsNotFound extends ResourceError {
    public constructor () {
        const clientMessage = `No active credits found for user.`;
        const code = 'USER_SUBSCRIPTION_CREDITS_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class UpdateUserSubscriptionCreditsFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Updating user subscription credits failed.`;
        const code = 'UPDATE_USER_SUBSCRIPTION_CREDITS_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class CreateUserSubscriptionCreditsFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Creating user subscription credits failed.`;
        const code = 'CREATE_USER_SUBSCRIPTION_CREDITS_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class InsufficientCredits extends ResourceError {
    public constructor () {
        const clientMessage = `User has insufficient credits to perform this action.`;
        const code = 'INSUFFICIENT_CREDITS';
        const statusCode = 402;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class CreditsNotYetActive extends ResourceError {
    public constructor () {
        const clientMessage = `User credits are not yet active for the current period.`;
        const code = 'CREDITS_NOT_YET_ACTIVE';
        const statusCode = 402;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class CreditsExpired extends ResourceError {
    public constructor () {
        const clientMessage = `User credits have expired for the current period.`;
        const code = 'CREDITS_EXPIRED';
        const statusCode = 402;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
```

**ResourceError Base Class:**

```typescript
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
    }: ErrorConstructorParams ) { ... }
}
```

**Error Rules:**

- Always extend `ResourceError`
- Define `clientMessage` (user-facing, shown to client)
- Define `statusCode` (HTTP status code)
- Define `code` (machine-readable, SCREAMING_SNAKE_CASE)
- Class names must be descriptive and action/condition-focused
- Group related errors in the same file

**Common Status Codes:**

| Status | Use Case |
|--------|----------|
| 400 | Bad request, validation failed |
| 401 | Unauthorized, not authenticated |
| 402 | Payment required, insufficient credits |
| 403 | Forbidden, not allowed |
| 404 | Not found |
| 409 | Conflict, already exists |
| 500 | Internal server error |

---

### Index Files (`index.ts`)

**Root Collection Index - Export Everything:**

```typescript
export * from './userSubscriptionCredits.ctrl';

export * from './userSubscriptionCredits.router';

export * from './userSubscriptionCredits.service';

export * from './userSubscriptionCredits.types';

export * from './userSubscriptionCredits.validation';

export * from './userSubscriptionCredits.errors';

export * from './userSubscriptionCredits.helper';
```

**Nested Module Index - Export Router (minimum):**

```typescript
export * from './nestedModule.router';
```

**Why export everything:**

- Other modules may need to call service functions directly
- Helpers may be reused across modules
- Error classes are used for `instanceof` checks
- Types are imported for function signatures

---

## Import Organization

Standard import order:

1. **External packages** (`express`, `joi`, `graphile-utils`)
2. **Internal libs** (`lib/postGraphile`, `lib/redis`, `lib/stripe`)
3. **Shared utilities** (`errors`, `types`, `middleware`)
4. **Parent module imports** (`../index`, `../<module>.validation`)
5. **Local module imports** (`./<collection>.*`)

**Example:**

```typescript
import { Response } from 'express';                                    // 1. External
import { gql } from 'graphile-utils';                                  // 1. External

import { postGraphileRequest } from '../../../../lib/postGraphile';    // 2. Internal libs

import { Either, error, success } from '../../../../types';            // 3. Shared utilities
import { ResourceError } from '../../../../errors';                    // 3. Shared utilities

import { ParentType } from '../parent.types';                          // 4. Parent module

import { GetUserSubscriptionCreditsQuery } from './userSubscriptionCredits.service.generatedTypes';  // 5. Local
import { UserSubscriptionCreditsNotFound } from './userSubscriptionCredits.errors';                  // 5. Local
```

---

## Response Transformation

Always map external service types (Postgraphile/GraphQL scalars) into explicit response DTOs:

```typescript
// GraphQL BigInt returns as `any`, must convert to number
const credits = {
    id: Number( currentValidUserSubscriptionCredits.id )
    , remainingCredits: Number( currentValidUserSubscriptionCredits.remainingCredits )
    , allocatedCredits: Number( currentValidUserSubscriptionCredits.allocatedCredits )
    , periodStart: currentValidUserSubscriptionCredits.periodStart
    , periodEnd: currentValidUserSubscriptionCredits.periodEnd
};

return res.status( 200 ).json( { credits } );
```

**Why transform:**

- GraphQL scalars like `BigInt` come as `any`; clients expect `number`
- Decouples internal DB schema from API contract
- Allows reshaping data for client needs
- Ensures consistent response shapes

---

## Collection Completion Checklist

When implementing a new collection, ensure you have:

- [ ] `index.ts` - exports all public API
- [ ] `<collection>.types.ts` - all request/response types
- [ ] `<collection>.errors.ts` - all domain-specific errors
- [ ] `<collection>.validation.ts` - Joi schemas for all routes
- [ ] `<collection>.ctrl.ts` - handlers for all routes
- [ ] `<collection>.router.ts` - route definitions
- [ ] `<collection>.helper.ts` - business logic (if needed)
- [ ] `<collection>.service.ts` - database operations
- [ ] `<collection>.service.generatedTypes.ts` - run `npm run codegen`
- [ ] Schemas registered in `middleware/requestValidator/requestValidator.schemas.ts`
- [ ] Router mounted in parent router

**Optional:** Add an `AGENTS.md` file documenting:

- Public API (routes, method/path, response shape)
- File responsibilities
- Extension guidance (how to add endpoints without breaking conventions)
- Testing guidance (where tests should live and what to cover)

---

## Code Formatting Notes

This codebase uses specific formatting:

- **Spaces inside parentheses:** `fn( arg )` not `fn(arg)`
- **Spaces inside brackets:** `[ item ]` not `[item]`
- **Leading commas in multi-line objects:**
  ```typescript
  const obj = {
      id: value
      , name: value2
      , status: value3
  };
  ```
- **Blank lines between logical sections**
- **4-space indentation**

---

## Summary: File Responsibility Matrix

| File | Database Access | Express Types | Business Logic | Types Definition |
|------|-----------------|---------------|----------------|------------------|
| `*.ctrl.ts` | No | Yes | No (calls helpers) | No |
| `*.service.ts` | Yes | No | No | No |
| `*.helper.ts` | No | No | Yes | No |
| `*.types.ts` | No | Yes (extends Request) | No | Yes |
| `*.validation.ts` | No | No | No | No |
| `*.errors.ts` | No | No | No | No |
| `*.router.ts` | No | Yes | No | No |
| `*.service.generatedTypes.ts` | No | No | No | Yes (auto-generated) |