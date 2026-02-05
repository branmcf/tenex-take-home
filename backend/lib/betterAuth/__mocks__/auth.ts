/**
 * betterAuth mock
 *
 * This mock provides a minimal auth instance for testing.
 * The actual betterAuth instance makes calls to:
 * - Resend API (email verification)
 * - PostgreSQL database
 * - Google OAuth
 *
 * For most tests, you should mock the specific auth methods you need.
 */

interface MockAuthApi {
    getSession: jest.Mock;
    signUpEmail: jest.Mock;
    signInEmail: jest.Mock;
    signOut: jest.Mock;
    verifyEmail: jest.Mock;
    sendVerificationEmail: jest.Mock;
    forgetPassword: jest.Mock;
    resetPassword: jest.Mock;
}

interface MockAuthHandler {
    ( request: Request ): Promise<Response>;
}

interface MockAuth {
    api: MockAuthApi;
    handler: MockAuthHandler;
}

const createMockSession = ( overrides = {} ) => ( {
    user: {
        id: 'mock-user-id'
        , email: 'test@example.com'
        , name: 'Test User'
        , emailVerified: true
        , createdAt: new Date()
        , updatedAt: new Date()
    }
    , session: {
        id: 'mock-session-id'
        , userId: 'mock-user-id'
        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
        , createdAt: new Date()
        , updatedAt: new Date()
    }
    , ...overrides
} );

const mockApi: MockAuthApi = {
    getSession: jest.fn().mockResolvedValue( createMockSession() )
    , signUpEmail: jest.fn().mockResolvedValue( { user: createMockSession().user } )
    , signInEmail: jest.fn().mockResolvedValue( createMockSession() )
    , signOut: jest.fn().mockResolvedValue( { success: true } )
    , verifyEmail: jest.fn().mockResolvedValue( { success: true } )
    , sendVerificationEmail: jest.fn().mockResolvedValue( { success: true } )
    , forgetPassword: jest.fn().mockResolvedValue( { success: true } )
    , resetPassword: jest.fn().mockResolvedValue( { success: true } )
};

const mockHandler: MockAuthHandler = jest.fn().mockResolvedValue(
    new Response( JSON.stringify( { success: true } ), {
        status: 200
        , headers: { 'Content-Type': 'application/json' }
    } )
);

export const auth: MockAuth = {
    api: mockApi
    , handler: mockHandler
};

/**
 * Helper to reset all mocks
 */
export const resetAuthMocks = () => {
    Object.values( mockApi ).forEach( mock => mock.mockClear() );
    ( mockHandler as jest.Mock ).mockClear();
};

/**
 * Helper to mock session response
 */
export const mockSessionOnce = ( session = createMockSession() ) => {
    mockApi.getSession.mockResolvedValueOnce( session );
};

/**
 * Helper to mock no session (unauthenticated)
 */
export const mockNoSessionOnce = () => {
    mockApi.getSession.mockResolvedValueOnce( null );
};

/**
 * Helper to mock session error
 */
export const mockSessionErrorOnce = ( errorMessage = 'Session error' ) => {
    mockApi.getSession.mockRejectedValueOnce( new Error( errorMessage ) );
};

jest.doMock( '../auth', () => ( {
    auth
    , default: auth
} ) );

export default auth;
