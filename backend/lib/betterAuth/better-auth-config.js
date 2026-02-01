/* eslint-disable @typescript-eslint/no-require-imports */
const { betterAuth } = require( 'better-auth' );
const { magicLink } = require( 'better-auth/plugins' );
const { Resend } = require( 'resend' );
const { Pool } = require( 'pg' );

const resend = new Resend( process.env.RESEND_API_KEY ?? '' );

const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : undefined;

export const auth = betterAuth( {
    database: new Pool( { connectionString: DATABASE_URL } )
    , plugins: [
        magicLink( {
            sendMagicLink: async ( { email, url } ) => {
                await resend.emails.send( {
                    from: 'Tenex Take Home <onboarding@resend.dev>'
                    , to: email
                    , subject: 'Sign in to Tenex Take Home'
                    , html: `<p>Click the link to log in to your account ${ url } </p>`
                } );
            }
        } )
    ]
    , advanced: {
        defaultCookieAttributes: {
            sameSite: 'none'
            , secure: true
        }
    }

    /*
     * This should be a long, random string.
     * You can generate one here: https://generate-secret.now.sh/32
     */
    , authSecret: process.env.AUTH_SECRET ?? ''

    // trustedOrigins: [/^https:\/\/[a-z0-9-]+\.vm\.elestio\.app$/, "http://localhost:3014"],
} );

module.exports = auth;
module.exports.auth = auth;
