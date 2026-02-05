# Testing Standards

This document describes the testing standards and conventions used in the workforce-management-fte-web-bff codebase.

## Directory Structure

### Relationship Between `tests/` and `app/`

The `tests/` directory mirrors the `app/` directory structure. Each collection (feature module) in `app/` should have a corresponding test directory in `tests/`.

```
app/
├── businesses/
│   ├── locations/
│   │   ├── workAreaDates/
│   │   │   ├── workAreaDates.ctrl.ts
│   │   │   ├── workAreaDates.errors.ts
│   │   │   ├── workAreaDates.router.ts
│   │   │   ├── workAreaDates.service.ts
│   │   │   ├── workAreaDates.types.ts
│   │   │   └── workAreaDates.validation.ts
│   │   └── locationSettings/
│   │       └── ...
│   └── ...
├── employees/
│   └── ...
└── ...

tests/
├── businesses/
│   ├── locations/
│   │   ├── workAreaDates/
│   │   │   └── workAreaDates.test.ts
│   │   └── locationSettings/
│   │       └── locationSettings.test.ts
│   └── ...
├── employees/
│   └── ...
└── tests.helper.ts
```

### Adding New Test Suites

When adding tests for a new collection:

1. Create a directory in `tests/` that mirrors the path in `app/`
2. Create a `{collectionName}.test.ts` file in that directory
3. If the collection has nested sub-collections (e.g., `workAreaDates/shiftDayMetrics`), create nested test directories accordingly

## Test File Structure

### Import Order

Test files follow a specific import order with labeled sections:

```typescript
/* ----------------- Mocks ----------------------- */

import { wfmServiceRequest } from '../../../../lib/wfmService/__mocks__/wfmService.request';
import { usersAuthSessionsServiceRequest } from '../../../../lib/usersAuthSessionsService/__mocks__/usersAuthSessionsService.request';

/* ----------------- Mocks ----------------------- */

import supertest from 'supertest';
import { app } from '../../../../server';
import { getRandomSessionIdHeader } from '../../../../tests/tests.helper';

import * as SomeService from '../../../../app/path/to/service';
import { generateRandomString, generateRandomInteger } from '../../../../utils/randoms';
```

**Important:** Mock imports must come FIRST, before any other imports. This ensures Jest's mocking mechanism intercepts the real modules correctly.

### Server Setup and Teardown

Every test file should set up and tear down the server:

```typescript
const server = app.listen();
const request = supertest( server );

afterAll( async () => {
    server.close();
} );
```

### Describe Block Organization

Tests are organized by endpoint, then by test category:

```typescript
describe( 'GET /businesses/:businessId/locations/:locationId/work-area-dates', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns controller checkUserOnSession errors', () => {
        // Authentication/authorization error tests
    } );

    describe( 'the request to endpoint is invalid', () => {
        // Validation error tests
    } );

    describe( 'the request to endpoint is valid', () => {
        // Success path and business logic error tests
    } );

} );
```

## Test Case Structure

Each test case follows a consistent structure with labeled sections:

```typescript
it(
    'descriptive test name that explains expected behavior'
    , async () => {

        // create test specific data
        const businessId = 1;
        const locationId = 1;
        const user = {
            id: generateRandomInteger()
            , firstName: 'Lightning'
            , lastName: 'McQueen'
            , email: 'lightning@kachow.ai'
            , roles: [
                {
                    id: 1
                    , name: generateRandomString()
                    , level: generateRandomInteger()
                    , businessId
                    , locationId
                }
            ]
            , types: []
        };

        // create spys
        const serviceFunctionSpy = jest.spyOn( SomeService, 'serviceFunction' );

        // create mocks
        usersAuthSessionsServiceRequest.mockResponseOnce( {
            session: {
                cookie: {
                    originalMaxAge: generateRandomInteger()
                    , expires: new Date( Date.now() + ( 14 * 24 * 3600 * 1000 ) ).toISOString()
                    , secure: false
                    , httpOnly: true
                    , path: '/'
                    , sameSite: 'lax'
                }
                , user
            }
        } );
        usersAuthSessionsServiceRequest.mockResponseOnce( user );
        wfmServiceRequest.mockResponseOnce( { /* response data */ } );

        // send request
        const result = await request
            .get( `/businesses/${ businessId }/locations/${ locationId }/endpoint` )
            .query( { /* query params */ } )
            .set( ...getRandomSessionIdHeader() );

        // get spy results
        const spyResult = await serviceFunctionSpy.mock.results[ 0 ].value;

        // check times called
        expect( serviceFunctionSpy )
            .toHaveBeenCalledTimes( 1 );

        // check called with
        expect( serviceFunctionSpy )
            .toHaveBeenCalledWith( /* expected arguments */ );

        // check spy results
        expect( spyResult.value )
            .toMatchObject( { /* expected shape */ } );

        // check result
        expect( result.body ).toStrictEqual( {
            /* expected response body */
        } );

        // check status code
        expect( result.status ).toBe( 200 );

    }
);
```

When a section is not applicable, include a comment indicating so:

```typescript
// create spys - NONE
// get spy results - NONE
// check times called - NONE
```

## Mocking Strategy

### Service Mocks

External service requests are mocked using custom mock implementations located in `lib/{serviceName}/__mocks__/`:

| Mock | Location | Purpose |
|------|----------|---------|
| `wfmServiceRequest` | `lib/wfmService/__mocks__/wfmService.request.ts` | Mock WFM GraphQL service calls |
| `usersAuthSessionsServiceRequest` | `lib/usersAuthSessionsService/__mocks__/usersAuthSessionsService.request.ts` | Mock authentication/session calls |
| `monolithServiceRequest` | `lib/monolithService/__mocks__/monolithService.request.ts` | Mock monolith service calls |
| `configServiceRequest` | `lib/configService/__mocks__/configService.request.ts` | Mock config service calls |

### Mock Methods

Each mock provides these methods:

```typescript
// Mock a successful response (single use)
serviceMock.mockResponseOnce( responseData );

// Mock a successful response (persistent)
serviceMock.mockResponse( responseData );

// Mock a delayed response
serviceMock.mockDelayedResponseOnce( delayMs, responseData );
serviceMock.mockDelayedResponse( delayMs, responseData );

// Mock an error response
serviceMock.mockResponseErrorOnce( new ResourceError({ message: '...' }) );
serviceMock.mockResponseError( new ResourceError({ message: '...' }) );
```

### Authentication Mocking Pattern

For authenticated endpoints, mock both session verification calls:

```typescript
// First call returns the session with user
usersAuthSessionsServiceRequest.mockResponseOnce( {
    session: {
        cookie: {
            originalMaxAge: generateRandomInteger()
            , expires: new Date( Date.now() + ( 14 * 24 * 3600 * 1000 ) ).toISOString()
            , secure: false
            , httpOnly: true
            , path: '/'
            , sameSite: 'lax'
        }
        , user
    }
} );
// Second call returns the user data
usersAuthSessionsServiceRequest.mockResponseOnce( user );
```

### Service Function Spies

To verify service function calls, use `jest.spyOn`:

```typescript
import * as SomeService from '../../../../app/path/to/service';

const serviceFunctionSpy = jest.spyOn( SomeService, 'serviceFunction' );
```

## Test Utilities

### `tests/tests.helper.ts`

Provides the `getRandomSessionIdHeader()` function that generates a valid session cookie header for authenticated requests:

```typescript
import { getRandomSessionIdHeader } from '../../../../tests/tests.helper';

const result = await request
    .get( '/endpoint' )
    .set( ...getRandomSessionIdHeader() );
```

### Random Data Generators

Located in `utils/randoms/`:

```typescript
import { generateRandomString, generateRandomInteger } from '../../../../utils/randoms';

const randomString = generateRandomString();  // e.g., "k7d8f2g9"
const randomInt = generateRandomInteger();    // Random 32-bit integer
```

## Test Categories

### 1. Authentication/Authorization Errors

Test that endpoints properly handle:
- Missing session (`SESSION_NOT_FOUND`)
- Business ID mismatch (`AUTHENTICATED_USER_BUSINESS_MISMATCH`)

### 2. Validation Errors

Test request validation:
- Missing required parameters
- Invalid parameter types (string instead of number)
- Invalid parameter values (negative IDs)
- Disallowed query parameters
- Invalid date formats

### 3. Success Paths

Test successful responses:
- Proper response body structure
- Correct status codes (200, 201, etc.)
- Service function called with correct arguments

### 4. Business Logic Errors

Test error handling:
- Resource not found (404)
- Service failures (500)
- Empty results handling

## Response Assertion Patterns

### Error Responses

```typescript
expect( result.body ).toStrictEqual( {
    message: 'Internal error message'
    , clientMessage: 'User-friendly error message'
    , code: 'ERROR_CODE'
    , requestId: expect.any( String )
    , statusCode: 400
} );

expect( result.status ).toBe( 400 );
```

### Success Responses

```typescript
expect( result.body ).toStrictEqual( {
    dataField: [
        {
            id: 1
            , /* other fields */
        }
    ]
} );

expect( result.status ).toBe( 200 );
```

## Running Tests

```bash
# Run integration tests (tests in /tests directory)
npm run test:int

# Run unit tests (tests outside /tests directory)
npm run test:unit

# Debug integration tests
npm run test:int-debug
```

## Jest Configuration

Integration tests use `jest/integrationTests.config.json`:
- Test timeout: 30 seconds
- Max workers: 8
- Tests match: `<rootDir>/tests/**/*.test.ts`
- Mocks are auto-cleared between tests

## Code Style in Tests

This codebase uses a leading-comma style for object and array literals:

```typescript
const user = {
    id: 1
    , firstName: 'Test'
    , lastName: 'User'
    , roles: [
        {
            id: 1
            , name: 'Admin'
        }
    ]
};
```

Template literal spacing:

```typescript
`/businesses/${ businessId }/locations/${ locationId }/endpoint`
```

Parentheses spacing:

```typescript
expect( result.status ).toBe( 200 );
someFunction( arg1, arg2 );
```
