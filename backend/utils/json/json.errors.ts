import { ResourceError } from '../../errors';

export class JsonParseError extends ResourceError {
    public constructor (
        error: Error
    ) {
        const message = 'The provided string could not parsed into a valid JS data structure';
        const code = 'JSON_PARSE';
        const statusCode = 500;

        super( {
            message
            , code
            , error
            , statusCode
        } );

    }
}

export class JsonStringifyError extends ResourceError {
    public constructor (
        error: Error
    ) {
        const message = 'The provided resource could not be stringified';
        const code = 'JSON_STRINGIFY';
        const statusCode = 400;

        super( {
            message
            , code
            , error
            , statusCode
        } );

    }
}