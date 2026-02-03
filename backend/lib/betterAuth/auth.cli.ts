import { betterAuth } from 'better-auth';
import { buildAuthOptions } from './auth.options';

if ( process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL ) {
    const { config } = await import( 'dotenv' );
    config( { path: 'backend/.env' } );
}

export const auth = betterAuth( buildAuthOptions() );

export default auth;