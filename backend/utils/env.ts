import { config } from 'dotenv';

export const loadEnvVars = ( {
    myEnv = process.env.myEnv
    , showLogs = true
} = {} ): void => {

    if ( !myEnv )
        return;

    if ( myEnv.toLowerCase() === 'qa' ) {
        config( { path: '.env.qa' } );
    } else if ( myEnv.toLowerCase() === 'prod' ) {
        config( { path: '.env.prod' } );
    } else if ( myEnv.toLowerCase() === 'staging' ) {
        config( { path: '.env.staging' } );
    } else if ( myEnv.toLowerCase() === 'demo' ) {
        config( { path: '.env.demo' } );
    }

    if ( showLogs )
        // eslint-disable-next-line no-console
        console.log( `Loaded ${ myEnv } environment vars` );
};