import { ResourceError } from '../../../errors';
import { success, error } from '../../../types';
import {
    generateLLMText as trueGenerateLLMText
    , streamLLMText as trueStreamLLMText
} from '../llm';
import type { LLMGenerateResult } from '../llm.types';

/**
 * generateLLMText mock
 */
interface GenerateLLMTextMock extends jest.Mock<
    ReturnType<typeof trueGenerateLLMText>
    , Parameters<typeof trueGenerateLLMText>
> {
    mockResponseOnce( result?: LLMGenerateResult ): this;
    mockResponse( result?: LLMGenerateResult ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const generateLLMTextMock = jest.fn<
    ReturnType<typeof trueGenerateLLMText>
    , Parameters<typeof trueGenerateLLMText>
>( trueGenerateLLMText ) as GenerateLLMTextMock;

const defaultGenerateResult: LLMGenerateResult = {
    content: 'Mock LLM response'
    , sources: []
    , usage: {
        inputTokens: 10
        , outputTokens: 20
        , totalTokens: 30
    }
};

generateLLMTextMock.mockResponseOnce = ( result = defaultGenerateResult ) =>
    generateLLMTextMock.mockImplementationOnce(
        async () => success( result )
    );

generateLLMTextMock.mockResponse = ( result = defaultGenerateResult ) =>
    generateLLMTextMock.mockImplementation(
        async () => success( result )
    );

generateLLMTextMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'LLM request failed' } )
) =>
    generateLLMTextMock.mockImplementationOnce(
        async () => error( resourceError )
    );

generateLLMTextMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'LLM request failed' } )
) =>
    generateLLMTextMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * streamLLMText mock
 */
interface StreamLLMTextMock extends jest.Mock<
    ReturnType<typeof trueStreamLLMText>
    , Parameters<typeof trueStreamLLMText>
> {
    mockResponseOnce( textStream?: AsyncIterable<string>, sources?: Array<{ url: string; title: string; description?: string }> ): this;
    mockResponse( textStream?: AsyncIterable<string>, sources?: Array<{ url: string; title: string; description?: string }> ): this;
}

const createMockTextStream = ( text: string ): AsyncIterable<string> => {
    return {
        async *[ Symbol.asyncIterator ]() {
            yield text;
        }
    };
};

const streamLLMTextMock = jest.fn<
    ReturnType<typeof trueStreamLLMText>
    , Parameters<typeof trueStreamLLMText>
>( trueStreamLLMText ) as StreamLLMTextMock;

streamLLMTextMock.mockResponseOnce = (
    textStream = createMockTextStream( 'Mock streamed response' )
    , sources = []
) =>
    streamLLMTextMock.mockImplementationOnce(
        async () => ( { textStream, sources } )
    );

streamLLMTextMock.mockResponse = (
    textStream = createMockTextStream( 'Mock streamed response' )
    , sources = []
) =>
    streamLLMTextMock.mockImplementation(
        async () => ( { textStream, sources } )
    );

jest.doMock( '../llm', () => ( {
    generateLLMText: generateLLMTextMock
    , streamLLMText: streamLLMTextMock
} ) );

export const generateLLMText = generateLLMTextMock;
export const streamLLMText = streamLLMTextMock;
