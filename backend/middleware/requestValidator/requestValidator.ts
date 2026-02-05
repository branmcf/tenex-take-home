import {
    Request, Response, NextFunction
} from 'express';
import joi from 'joi';
import { ResourceError } from '../../errors';
import { RequestValidationError } from './requestValidator.errors';
import {
    buildErrorMessage
    , buildRequestContent
} from './requestValidator.helper';
import { SchemaName } from './requestValidator.types';
import { SCHEMAS } from './requestValidator.schemas';


export const requestValidator = ( schemaName: SchemaName ) => {
    return async (
        req: Request
        , res: Response<RequestValidationError>
        , next: NextFunction
    ): Promise<Response<RequestValidationError> | void> => {

        const content = buildRequestContent( req );
        const schema = SCHEMAS[ schemaName ];

        if ( !schema ) {
            const requestValidationError = new RequestValidationError(
                schemaName as string
                , `Validation schema not found: ${ schemaName }.`
            );
            return res
                .status( requestValidationError.statusCode )
                .json( requestValidationError );
        }

        try {
            await schema.validateAsync( content, { abortEarly: false } );
            return next();
        } catch ( validationError ) {
            let error = validationError as string | ResourceError;

            if ( validationError instanceof joi.ValidationError ) {
                error = buildErrorMessage( validationError );
            }

            const requestValidationError = new RequestValidationError(
                schemaName as string
                , error
            );
            return res
                .status( requestValidationError.statusCode )
                .json( requestValidationError );
        }
    };
};
