import {
    generateSources as trueGenerateSources
    , needsWebSearch as trueNeedsWebSearch
} from '../llm.rag';
import type { LLMSource } from '../llm.types';

/**
 * generateSources mock
 */
interface GenerateSourcesMock extends jest.Mock<
    ReturnType<typeof trueGenerateSources>
    , Parameters<typeof trueGenerateSources>
> {
    mockResponseOnce( result?: LLMSource[] ): this;
    mockResponse( result?: LLMSource[] ): this;
}

const generateSourcesMock = jest.fn<
    ReturnType<typeof trueGenerateSources>
    , Parameters<typeof trueGenerateSources>
>( trueGenerateSources ) as GenerateSourcesMock;

generateSourcesMock.mockResponseOnce = ( result = [] ) =>
    generateSourcesMock.mockImplementationOnce(
        async () => result
    );

generateSourcesMock.mockResponse = ( result = [] ) =>
    generateSourcesMock.mockImplementation(
        async () => result
    );

/**
 * needsWebSearch mock
 */
interface NeedsWebSearchMock extends jest.Mock<
    ReturnType<typeof trueNeedsWebSearch>
    , Parameters<typeof trueNeedsWebSearch>
> {
    mockResultOnce( result?: boolean ): this;
    mockResult( result?: boolean ): this;
}

const needsWebSearchMock = jest.fn<
    ReturnType<typeof trueNeedsWebSearch>
    , Parameters<typeof trueNeedsWebSearch>
>( trueNeedsWebSearch ) as NeedsWebSearchMock;

needsWebSearchMock.mockResultOnce = ( result = false ) =>
    needsWebSearchMock.mockImplementationOnce(
        () => result
    );

needsWebSearchMock.mockResult = ( result = false ) =>
    needsWebSearchMock.mockImplementation(
        () => result
    );

jest.doMock( '../llm.rag', () => ( {
    generateSources: generateSourcesMock
    , needsWebSearch: needsWebSearchMock
} ) );

export const generateSources = generateSourcesMock;

export const needsWebSearch = needsWebSearchMock;
