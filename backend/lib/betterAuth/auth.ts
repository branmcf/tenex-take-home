import { createAuthMiddleware } from 'better-auth/api';
import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { Resend } from 'resend';
import { Pool } from  'pg';
import { Log, createNamespaceAttribute } from '../../utils';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend( RESEND_API_KEY ) : null;

const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : undefined;
const API_URL = process.env.API_URL ? process.env.API_URL : '';
const API_DOMAIN = process.env.API_DOMAIN ? process.env.API_DOMAIN : '';

export const auth = betterAuth( {
    database: new Pool( { connectionString: DATABASE_URL } )
    , baseURL: API_URL
    , basePath: '/api/auth'
    , emailAndPassword: { enabled: true }
    , plugins: [
        magicLink( {
            sendMagicLink: async ( { email, url } ) => {
                if ( !resend ) {
                    Log.warn( 'RESEND_API_KEY is not set; skipping magic link email send', { email } );
                    return;
                }

                await resend.emails.send( {
                    from: 'Tenex Take-Home <onboarding@resend.dev>'
                    , to: email
                    , subject: 'Sign in to Tenex Take Home'
                    , html: `Heyyyy`
                } );
            }
        } )
    ]
    , hooks: {
        before: createAuthMiddleware( async ( ctx ) => {
            const requestBody = ctx.body ?? {};
            // Log the request start using info from the better-auth context.
            Log.req( {
                method: ctx.request?.method ?? 'INTERNAL'
                , path: ctx.path
                , query: ctx.query ?? {}
                , requestBody
            } );

            // Store the parsed body in the CLS context for the end handler.
            createNamespaceAttribute( 'parsedBody', requestBody );
        } )
    }
    , advanced: {
        defaultCookieAttributes: {
            domain: API_DOMAIN
            , sameSite: 'none'
            , secure: true
            , httpOnly: true
        }
        , ipAddress: {
            ipAddressHeaders: [ 'x-client-ip', 'x-forwarded-for' ]
            , disableIpTracking: false
        }
        , useSecureCookies: true
    }

    /*
     * This should be a long, random string.
     * You can generate one here: https://generate-secret.now.sh/32
     */
    , secret: process.env.AUTH_SECRET ?? ''
    , trustedOrigins: [ 'http://localhost:3026', 'https://api.mondayfortuesday.com' ]
} );