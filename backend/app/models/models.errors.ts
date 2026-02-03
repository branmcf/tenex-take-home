import { ResourceError } from '../../errors';

export class ModelsNotFound extends ResourceError {
    public constructor () {
        const clientMessage = `No models found.`;
        const code = 'MODELS_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class GetModelsFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to retrieve models.`;
        const code = 'GET_MODELS_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
