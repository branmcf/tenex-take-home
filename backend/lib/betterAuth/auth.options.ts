import type { BetterAuthOptions } from 'better-auth';
import { Pool } from 'pg';

export const buildAuthOptions = (): BetterAuthOptions => {
    const DATABASE_URL = process.env.DATABASE_URL;
    const API_URL = process.env.API_URL ?? '';

    return {
        database: new Pool( { connectionString: DATABASE_URL } )
        , baseURL: API_URL
        , basePath: '/api/auth'

        , emailAndPassword: {
            enabled: true
            , requireEmailVerification: true
        }

        , socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID ?? ''
                , clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
                , redirectURI: API_URL ? `${ API_URL }/api/auth/callback/google` : undefined
            }
        }

        , advanced: {
            defaultCookieAttributes: {

                // Only set domain in production
                ...( process.env.NODE_ENV === 'production' && process.env.API_DOMAIN
                    ? { domain: process.env.API_DOMAIN }
                    : {}
                )
                , sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
                , secure: process.env.NODE_ENV === 'production'
                , httpOnly: true
            }
            , ipAddress: {
                ipAddressHeaders: [ 'x-client-ip', 'x-forwarded-for' ]
                , disableIpTracking: false
            }
            , useSecureCookies: process.env.NODE_ENV === 'production'
        }

        , secret: process.env.AUTH_SECRET ?? ''
        , trustedOrigins: [
            'http://localhost:3026'
            , 'http://localhost:3000'
            , 'https://app.hardwire.branmcf.com'
        ]
    };
};