import { ErrorConstructorParams } from '../types';

const DEFAULT_ERROR_MESSAGE = 'Internal server error.';

export class ResourceError extends Error {
    message: string;
    clientMessage: string;
    code: string;
    error?: Error | unknown;
    statusCode: number;

    constructor ( {
        message = DEFAULT_ERROR_MESSAGE
        , clientMessage = DEFAULT_ERROR_MESSAGE
        , code = 'INTERNAL_SERVER_ERROR'
        , error
        , statusCode = 500
    }: ErrorConstructorParams ) {
        super();

        this.message = message;
        this.clientMessage = clientMessage;
        this.code = code;
        this.error = error;
        this.statusCode = statusCode;
    }
}
