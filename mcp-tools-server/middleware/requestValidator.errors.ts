import { BadRequestError } from '../errors';

export class RequestValidationError extends BadRequestError {
    public constructor ( message?: string ) {
        super( message ?? 'Request validation failed.' );
    }
}
