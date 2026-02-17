import { ResourceError } from '../../../errors';
import {
    Either, success, error
} from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockResult = Promise<Either<ResourceError, any>>;

interface PostGraphileRequestMock extends jest.Mock {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockResponseOnce( result?: any ): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockResponse( result?: any ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const postGraphileRequestMock = jest.fn() as PostGraphileRequestMock;

/**
 * Mocking successes
 */
postGraphileRequestMock.mockResponseOnce = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any = {}
): PostGraphileRequestMock =>
    postGraphileRequestMock.mockImplementationOnce(
        async (): MockResult => success( result )
    );

postGraphileRequestMock.mockResponse = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any = {}
): PostGraphileRequestMock =>
    postGraphileRequestMock.mockImplementation(
        async (): MockResult => success( result )
    );

/**
 * Mocking errors
 */
postGraphileRequestMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: '' } )
): PostGraphileRequestMock =>
    postGraphileRequestMock.mockImplementationOnce(
        async (): MockResult => error( resourceError )
    );

postGraphileRequestMock.mockResponseError = (
    resourceError = new ResourceError( { message: '' } )
): PostGraphileRequestMock =>
    postGraphileRequestMock.mockImplementation(
        async (): MockResult => error( resourceError )
    );

jest.doMock( '../postGraphile.request', () =>
    ( { postGraphileRequest: postGraphileRequestMock } ) );

export const postGraphileRequest = postGraphileRequestMock;
