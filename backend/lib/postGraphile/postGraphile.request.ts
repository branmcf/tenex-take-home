/* eslint-disable no-console */
import { print } from 'graphql';
import {
    QueryOptions, MutationOptions, OperationVariables
} from '@apollo/client/core';
import { executePostGraphile } from './postGraphile.client';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';

export const postGraphileRequest = async <
    TData, TVariables extends OperationVariables
>(
    options: QueryOptions<TVariables> | MutationOptions<TData, TVariables>
): Promise<Either<ResourceError, TData>> => {
    try {

        // extract query/mutation and variables from options
        const query = 'mutation' in options ? options.mutation : options.query;
        const variables = options.variables || {};

        // check for missing query
        if ( !query ) {
            return error( new ResourceError( { message: 'No query or mutation provided' } ) );
        }

        // execute GraphQL directly using internal client
        const result = await executePostGraphile(
            print( query )
            , variables
        );

        // check for GraphQL errors
        if ( result.errors && result.errors.length > 0 ) {
            console.error( 'PostGraphile GraphQL errors:', result.errors );
            return error( new ResourceError( {
                message: 'GraphQL execution failed'
                , error: result.errors
            } ) );
        }

        // return successful result
        return success( result.data as TData );

    } catch ( err ) {

        // log the error with context
        console.error(
            `Error running postGraphileRequest 

ERROR -->   ${ JSON.stringify( err ) } 

OPTIONS --> ${ JSON.stringify( options ) }`
            , err
        );

        // return wrapped error
        return error(
            new ResourceError( {
                message: `Error running postGraphileRequest`
                , error: err
            } )
        );
    }
};
