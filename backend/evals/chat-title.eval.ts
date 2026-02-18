/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateLLMText } from '../lib/llm';
import { updateChatTitle } from '../app/messages/messages.service';
import {
    generateAndUpdateChatTitle
    , generateFallbackChatTitle
} from '../app/messages/messages.helper';
import { success } from '../types';
import { chatTitleDataset } from './datasets/chat-title.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( '../lib/llm', () => ( { generateLLMText: jest.fn() } ) );

jest.mock( '../app/messages/messages.service', () => ( { updateChatTitle: jest.fn() } ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Chat title generation', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    chatTitleDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                updateChatTitle.mockResolvedValueOnce( success( undefined ) );

                if ( example.mocks?.action === 'llm' ) {
                    generateLLMText.mockResolvedValueOnce( success( { content: example.mocks.llmContent ?? '' } ) );

                    const result = await generateAndUpdateChatTitle( {
                        chatId: example.inputs.chatId
                        , userMessage: example.inputs.userMessage
                        , modelId: example.inputs.modelId ?? 'gpt-4o'
                    } );

                    const outputs = {
                        success: result.isSuccess()
                        , title: updateChatTitle.mock.calls[ 0 ]?.[ 0 ]?.title ?? null
                        , wasUpdated: updateChatTitle.mock.calls.length > 0
                    };

                    await logAndAssertExactMatch( ls, outputs, example.expected );
                    return;
                }

                const result = await generateFallbackChatTitle( {
                    chatId: example.inputs.chatId
                    , userMessage: example.inputs.userMessage
                } );

                const outputs = {
                    success: result.isSuccess()
                    , title: updateChatTitle.mock.calls[ 0 ]?.[ 0 ]?.title ?? null
                    , wasUpdated: updateChatTitle.mock.calls.length > 0
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
