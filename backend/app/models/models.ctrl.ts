import { Response } from 'express';
import { ResourceError } from '../../errors';
import { getActiveModels } from './models.service';
import {
    GetModelsRequest
    , GetModelsResponse
} from './models.types';

/**
 * @title Get Models Handler
 * @notice Returns all active models for selection in the UI.
 * @param req Express request
 * @param res Express response
 */
export const getModelsHandler = async (
    req: GetModelsRequest
    , res: Response<ResourceError | GetModelsResponse>
): Promise<Response<ResourceError | GetModelsResponse>> => {

    // get all active models from the database
    const getActiveModelsResult = await getActiveModels();

    // check for errors
    if ( getActiveModelsResult.isError() ) {

        // return the error
        return res
            .status( getActiveModelsResult.value.statusCode )
            .json( getActiveModelsResult.value );
    }

    // get the models nodes (allModels is guaranteed to exist from service validation)
    const modelsNodes = getActiveModelsResult.value?.nodes ?? [];

    // map the models to response format, filtering out null values
    const models = modelsNodes
        .filter( ( model ): model is NonNullable<typeof model> => model !== null )
        .map( model => ( {
            id: model.id
            , name: model.name
            , provider: model.provider
        } ) );

    // return success
    return res.status( 200 ).json( { models } );

};
