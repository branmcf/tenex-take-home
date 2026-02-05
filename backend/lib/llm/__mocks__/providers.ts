import type { LanguageModel } from 'ai';
import { getModelProvider as trueGetModelProvider } from '../providers';

/**
 * getModelProvider mock
 */
interface GetModelProviderMock extends jest.Mock<
    ReturnType<typeof trueGetModelProvider>
    , Parameters<typeof trueGetModelProvider>
> {
    mockProviderOnce( provider?: LanguageModel ): this;
    mockProvider( provider?: LanguageModel ): this;
}

// Create a minimal mock LanguageModel
const createMockLanguageModel = (): LanguageModel => ( {
    specificationVersion: 'v1'
    , provider: 'mock-provider'
    , modelId: 'mock-model'
    , defaultObjectGenerationMode: 'json'
    , doGenerate: jest.fn()
    , doStream: jest.fn()
} as unknown as LanguageModel );

const getModelProviderMock = jest.fn<
    ReturnType<typeof trueGetModelProvider>
    , Parameters<typeof trueGetModelProvider>
>( trueGetModelProvider ) as GetModelProviderMock;

getModelProviderMock.mockProviderOnce = ( provider = createMockLanguageModel() ) =>
    getModelProviderMock.mockImplementationOnce(
        () => provider
    );

getModelProviderMock.mockProvider = ( provider = createMockLanguageModel() ) =>
    getModelProviderMock.mockImplementation(
        () => provider
    );

jest.doMock( '../providers', () => ( {
    getModelProvider: getModelProviderMock
} ) );

export const getModelProvider = getModelProviderMock;
