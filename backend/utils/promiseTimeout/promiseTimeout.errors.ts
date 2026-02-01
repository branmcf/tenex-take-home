import { ResourceError } from '../../errors';

export class PromiseTimeout extends ResourceError {
    public constructor ( timeout: number ) {
        const message = `This process timed out because it took longer than ${ timeout }ms.`;
        const statusCode = 408;
        super( { message, statusCode } );
    }
}