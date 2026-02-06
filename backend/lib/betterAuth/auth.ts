import { betterAuth } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { Resend } from 'resend';
import { buildAuthOptions } from './auth.options';
import { Log, createNamespaceAttribute } from '../../utils';

const resend = new Resend( process.env.RESEND_API_KEY ?? '' );

export const auth = betterAuth( {
    ...buildAuthOptions()

    , emailVerification: {
        sendOnSignUp: true
        , sendOnSignIn: true
        , sendVerificationEmail: async ( { user, url } ) => {
            try {
                const result = await resend.emails.send( {
                    from: process.env.RESEND_FROM ?? 'HardWire <onboarding@resend.dev>'
                    , to: user.email
                    , subject: 'Verify your email address'
                    , html: `
                        <p>Thank you for signing up for HardWire!</p>
                        <br/>
                        <p>Please verify your email address <a href="${ url }">here</a> to log in and get started.</p>
                        <br/>
                        <p>Don't hesitate to reach out to us if you need anything!</p>
                        <br/>
                        <p>All the best,</p>
                        <p>HardWire Team</p>
                    `
                } );
                Log.info( 'Resend result', result );
            } catch ( err ) {
                Log.error( 'Failed to send verification email', err );
            }
        }
    }

    , hooks: {
        before: createAuthMiddleware( async ( ctx ) => {
            const requestBody = ctx.body ?? {};
            Log.req( {
                method: ctx.request?.method ?? 'INTERNAL', path: ctx.path, query: ctx.query ?? {}, requestBody
            } );
            createNamespaceAttribute( 'parsedBody', requestBody );
        } )
    }

} );

export default auth;