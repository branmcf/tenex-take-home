/* eslint-disable no-console */
/* eslint-disable @stylistic/max-len */
import { Pool } from 'pg';
import { createPostGraphileSchema, withPostGraphileContext } from 'postgraphile';
import {
    graphql, GraphQLSchema, ExecutionResult, GraphQLError
} from 'graphql';
import { OperationVariables } from '@apollo/client/core';
import { Log } from '../../utils';

// check if DATABASE_URL is falsy
if ( !process.env.DATABASE_URL ) {
    throw new Error( 'DATABASE_URL must be set in the environment variables.' );
}

/**
 * A PostGraphile schema and connection pool for internal GraphQL execution.
 */

let schema: GraphQLSchema | null = null;
let pool: Pool | null = null;
let initializationPromise: Promise<GraphQLSchema> | null = null;

/**
 * Initializes the PostGraphile schema and connection pool if not already initialized.
 */
const initializePostGraphile = async (): Promise<GraphQLSchema> => {

    // prevent multiple simultaneous initialization attempts
    if ( initializationPromise ) return initializationPromise;
    if ( schema ) return schema;

    initializationPromise = ( async (): Promise<GraphQLSchema> => {
        try {
            console.log( 'PostGraphile: Starting initialization...' );

            // create connection pool with Railway-optimized settings
            pool = new Pool( {
                connectionString: process.env.DATABASE_URL!
                , max: 5
                , min: 1
                , idleTimeoutMillis: 60000
                , connectionTimeoutMillis: 10000
            } );

            console.log( 'PostGraphile: Pool created, testing connection...' );

            // test the connection with retry logic
            let retries = 3;

            while ( retries > 0 ) {
                try {
                    const testResult = await pool.query( 'SELECT 1 as test, version() as pg_version' );
                    console.log( 'PostGraphile: Connection test successful:', testResult.rows[ 0 ] );
                    break;
                } catch ( connectionError ) {
                    retries--;
                    console.log( `PostGraphile: Connection test failed, retries left: ${ retries }`, connectionError );
                    if ( retries === 0 ) throw connectionError;
                    await new Promise( resolve => setTimeout( resolve, 2000 ) );
                }
            }

            console.log( 'PostGraphile: Creating schema...' );

            // create PostGraphile schema with Railway-optimized configuration
            schema = await createPostGraphileSchema( process.env.DATABASE_URL!, 'public', {
                dynamicJson: true
                , graphileBuildOptions: { pgOmitListSuffix: true }
                , ignoreRBAC: false
                , legacyRelations: 'omit'

                // production vs development settings
                , ...( process.env.NODE_ENV === 'production'
                    ? {

                        // production: minimal, secure
                        disableGraphiql: true
                        , showErrorStack: false
                        , extendedErrors: []
                        , enableQueryBatching: true
                    }
                    : {

                        // development: full features
                        showErrorStack: true
                        , extendedErrors: [
                            'hint'
                            , 'detail'
                            , 'errcode'
                        ]
                    }
                )
            } );

            console.log( 'PostGraphile: Schema created successfully' );

            // return the initialized schema
            return schema;

        } catch ( error ) {
            console.error( 'PostGraphile initialization failed:', error );

            // cleanup pool on failure
            if ( pool ) {
                await pool.end().catch( ( endError ) => {
                    console.error( 'Error ending pool during cleanup:', endError );
                } );
                pool = null;
            }

            // reset schema and promise
            schema = null;
            initializationPromise = null;

            // throw descriptive error
            throw new Error( `Failed to initialize PostGraphile: ${ error }` );
        }
    } )();

    // return the initialization promise
    return initializationPromise;
};

/**
 * Executes a GraphQL query against the PostGraphile schema
 */
export const executePostGraphile = async (
    query: string
    , variables?: OperationVariables
    , operationName?: string
): Promise<ExecutionResult> => {
    try {

        // initialize PostGraphile schema
        const postGraphileSchema = await initializePostGraphile();

        // double-check pool availability
        if ( !pool ) {
            throw new Error( 'PostgreSQL connection pool is not available' );
        }

        console.log( 'PostGraphile: Executing with withPostGraphileContext...' );

        // Use PostGraphile's context creator for proper setup
        return await withPostGraphileContext(
            {
                pgPool: pool
                , pgSettings: { role: 'postgres' }
            }
            , async ( context ) => {
                return await graphql( {
                    schema: postGraphileSchema
                    , source: query
                    , variableValues: variables
                    , operationName
                    , contextValue: context
                } );
            }
        );

    } catch ( error ) {
        console.error( 'PostGraphile execution error:', error );

        // return GraphQL-compatible error response
        return { errors: [ new GraphQLError( `PostGraphile execution failed: ${ error }`, null, null, null, null, null, { code: 'INTERNAL_ERROR' } ) ] };
    }
};

/**
 * Closes the PostGraphile connection pool and resets internal state
 */
export const closePostGraphile = async (): Promise<void> => {
    try {

        // close the connection pool
        if ( pool ) {
            await pool.end();
            pool = null;
        }

        // reset schema and promise
        schema = null;
        initializationPromise = null;

    } catch ( error ) {

        // log cleanup error
        Log.error( 'Error closing PostGraphile:', error );

        // continue cleanup even if pool.end() fails
        pool = null;
        schema = null;
        initializationPromise = null;
    }
};