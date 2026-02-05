import { Request } from 'express';
import { ValidationError, ValidationErrorItem } from 'joi';
import { RequestContent } from './requestValidator.types';

const isObjectEmpty = ( obj: Record<string, unknown> ): boolean => {
    return Object.keys( obj ).length === 0;
};

export const buildRequestContent = ( req: Request ): RequestContent => {
    const { query, params, body } = req;
    const content: RequestContent = {};

    if ( !isObjectEmpty( query ) ) content.query = query;
    if ( !isObjectEmpty( params ) ) content.params = params;
    if ( !isObjectEmpty( body ) ) content.body = body;
    if ( req.method === 'GET' ) delete content.body;

    return content;
};

export const buildErrorMessage = ( validationError: ValidationError ): string => {
    const { details } = validationError;
    return details.map( ( item: ValidationErrorItem ) => item.message ).join( ',' );
};
