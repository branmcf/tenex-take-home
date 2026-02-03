import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { postGraphileRequest } from '../../lib/postGraphile';
import {
    GetActiveModelsQuery
    , GetActiveModelsQueryVariables
} from './models.service.generatedTypes';
import { ModelsNotFound } from './models.errors';

/**
 * get all active models from the database
 *
 * @returns Either<ResourceError, GetActiveModelsQuery['allModels']> - list of active models
 */
export const getActiveModels = async (): Promise<Either<ResourceError, GetActiveModelsQuery['allModels']>> => {

    // create the graphql query
    const GET_ACTIVE_MODELS = gql`
        query getActiveModels {
            allModels(
                condition: { isActive: true }
                orderBy: [PROVIDER_ASC, NAME_ASC]
            ) {
                nodes {
                    id
                    name
                    provider
                }
            }
        }
    `;

    // execute the graphql query
    const result = await postGraphileRequest<GetActiveModelsQuery, GetActiveModelsQueryVariables>(
        {
            query: GET_ACTIVE_MODELS
            , variables: {}
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for models
    if ( !result.value.allModels?.nodes?.length ) {

        // return custom error
        return error( new ModelsNotFound() );
    }

    // return success
    return success( result.value.allModels );

};
