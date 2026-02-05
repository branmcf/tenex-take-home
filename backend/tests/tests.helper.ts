import { generateRandomString } from '../utils/randoms';

/**
 * Mock user type for testing
 */
interface MockUser {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Mock session type for testing
 */
interface MockSession {
    user: MockUser;
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
    };
}

/**
 * Generate a random session cookie header for testing authenticated requests
 *
 * @returns Tuple of [header name, header value] to use with supertest .set()
 */
export const getRandomSessionCookieHeader = (): [ string, string ] => {
    const sessionId = generateRandomString();
    return [ 'Cookie', `better-auth.session_token=${ sessionId }` ];
};

/**
 * Generate a mock user object for testing
 *
 * @param overrides - Optional overrides for the user object
 * @returns A mock user object
 */
export const createMockUser = ( overrides: Partial<MockUser> = {} ): MockUser => ( {
    id: `user-${ generateRandomString() }`
    , email: `test-${ generateRandomString() }@example.com`
    , name: 'Test User'
    , emailVerified: true
    , createdAt: new Date()
    , updatedAt: new Date()
    , ...overrides
} );

/**
 * Generate a mock session object for testing
 *
 * @param userId - Optional userId for the session
 * @param overrides - Optional overrides for the session object
 * @returns A mock session object with user
 */
export const createMockSession = (
    userId = `user-${ generateRandomString() }`
    , overrides: Partial<MockSession> = {}
): MockSession => ( {
    user: createMockUser( { id: userId } )
    , session: {
        id: `session-${ generateRandomString() }`
        , userId
        , expiresAt: new Date( Date.now() + ( 24 * 60 * 60 * 1000 ) )
        , createdAt: new Date()
        , updatedAt: new Date()
    }
    , ...overrides
} );
