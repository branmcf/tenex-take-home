import { ResourceError } from '../../../errors';
import { success, error } from '../../../types';
import { searchWeb as trueSearchWeb } from '../exa';
import type { ExaSearchResult } from '../exa.types';
import { ExaSearchFailed } from '../exa.errors';

interface SearchWebMock extends jest.Mock<
    ReturnType<typeof trueSearchWeb>
    , Parameters<typeof trueSearchWeb>
> {
    mockResponseOnce( result?: ExaSearchResult[] ): this;
    mockResponse( result?: ExaSearchResult[] ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const searchWebMock = jest.fn<
    ReturnType<typeof trueSearchWeb>
    , Parameters<typeof trueSearchWeb>
>( trueSearchWeb ) as SearchWebMock;

/**
 * Mocking successes
 */
searchWebMock.mockResponseOnce = ( result = [] ) =>
    searchWebMock.mockImplementationOnce(
        async () => success( result )
    );

searchWebMock.mockResponse = ( result = [] ) =>
    searchWebMock.mockImplementation(
        async () => success( result )
    );

/**
 * Mocking errors
 */
searchWebMock.mockResponseErrorOnce = (
    resourceError = new ExaSearchFailed()
) =>
    searchWebMock.mockImplementationOnce(
        async () => error( resourceError )
    );

searchWebMock.mockResponseError = (
    resourceError = new ExaSearchFailed()
) =>
    searchWebMock.mockImplementation(
        async () => error( resourceError )
    );

jest.doMock( '../exa', () =>
    ( { searchWeb: searchWebMock } ) );

export const searchWeb = searchWebMock;
