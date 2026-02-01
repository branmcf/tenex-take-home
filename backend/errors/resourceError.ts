import { ErrorConstructorParams } from '../types';
import { getNamespaceAttribute } from '../utils/clsNamespace';

const DEFAULT_ERROR_MESSAGE = 'We experienced an internal error. Please try again or contact support for assistance.';

export class ResourceError extends Error {
    message: string;
    clientMessage: string;
    code: string;
    error?: Error | unknown;
    requestId?: string;
    statusCode: number;

    constructor ( {
        message = DEFAULT_ERROR_MESSAGE
        , clientMessage = DEFAULT_ERROR_MESSAGE
        , code = 'INTERNAL_SERVER_ERROR'
        , error
        , statusCode = 500
    }: ErrorConstructorParams ) {
        super();

        const requestId = getNamespaceAttribute<string>( 'requestId' );

        this.message = message;
        this.clientMessage = clientMessage;
        this.code = code;
        this.error = error;
        this.requestId = requestId;
        this.statusCode = statusCode;
    }
}