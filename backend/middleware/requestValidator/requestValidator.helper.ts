import { Request } from 'express';
import { ValidationError, ValidationErrorItem } from 'joi';
import { RequestContent } from './requestValidator.types';
import { Either } from '../../types';
import { ResourceError } from '../../errors';
import {
    ExternalFieldValidationDataFetchError
    , ExternalFieldValidationError
} from './requestValidator.errors';


export const isObjectEmpty = ( obj: Record<string, unknown> ): boolean => {
    return Object.keys( obj ).length === 0;
};

/*
 *This removes empty attributes from
 *the request before the content can
 *be used for validation
 */
export const buildRequestContent = ( req: Request ): RequestContent => {
    const { query, params, body } = req;
    const content: RequestContent = {};

    if ( !isObjectEmpty( query ) ) content.query = query;
    if ( !isObjectEmpty( params ) ) content.params = params;
    if ( !isObjectEmpty( body ) ) content.body = body;
    if ( req.method === 'GET' ) delete content.body;

    return content;
};

export const externalFieldValidator = async <T, K extends keyof T>(
    fnToFetchExternalData: () => Promise<Either<ResourceError, T[]>>
    , datumAttributeName: K
    , datumAttributeDescription: string
    , value: T[ K ]
): Promise<T[ K ]> => {
    const dataFetchResult = await fnToFetchExternalData();

    if ( dataFetchResult.isError() ) {
        throw new ExternalFieldValidationDataFetchError(
            value
            , datumAttributeDescription
        );
    }

    const data = dataFetchResult.value;

    const validValues: T[ K ][] = [];

    for ( const datum of data ) {
        if ( datum[ datumAttributeName ] === value ) {
            return value;
        }

        validValues.push( datum[ datumAttributeName ] );
    }

    throw new ExternalFieldValidationError(
        value
        , validValues
        , datumAttributeDescription
    );
};

export const buildErrorMessage = (
    validationError: ValidationError
): string => {
    const { details } = validationError;
    const errorMessage = details
        .map( ( i: ValidationErrorItem ) => i.message )
        .join( ',' );
    return errorMessage;
};