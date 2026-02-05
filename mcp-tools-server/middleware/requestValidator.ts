import {
    Request
    , Response
    , NextFunction
} from 'express';
import joi from 'joi';
import { RequestValidationError } from './requestValidator.errors';
import { buildErrorMessage, buildRequestContent } from './requestValidator.helper';
import { SCHEMAS } from './requestValidator.schemas';
import { SchemaName } from './requestValidator.types';
import { Log } from '../utils';

export const requestValidator = ( schemaName: SchemaName ) => {
    return async (
        req: Request
        , res: Response<RequestValidationError>
        , next: NextFunction
    ): Promise<Response<RequestValidationError> | void> => {

        const content = buildRequestContent( req );
        const schema = SCHEMAS[ schemaName ];

        try {
            await schema.validateAsync( content, { abortEarly: false } );
            return next();
        } catch ( validationError ) {
            let errorMessage = 'Request validation failed.';

            if ( validationError instanceof joi.ValidationError ) {
                errorMessage = buildErrorMessage( validationError );
            }

            Log.warn( '[MCP] Request validation failed', { message: errorMessage } );

            const requestValidationError = new RequestValidationError( errorMessage );
            return res
                .status( requestValidationError.statusCode )
                .json( requestValidationError );
        }
    };
};
