/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateWorkflowIntent, generateLLMText } from '../lib/llm';
import { getWorkflowById, getLatestWorkflowVersion } from '../app/workflows/workflows.service';
import { getWorkflowChatMessages } from '../app/workflowChatMessages/workflowChatMessages.service';
import { getCachedTools } from '../app/tools/tools.helper';
import { generateWorkflowChatResponse } from '../app/workflowChatMessages/workflowChatMessages.helper';
import { success } from '../types';
import { workflowChatHistorySummarizationDataset } from './datasets/workflow-chat-history-summarization.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( '../lib/llm', () => ( {
    generateWorkflowIntent: jest.fn()
    , generateWorkflowToolCalls: jest.fn()
    , generateWorkflowStepToolUsage: jest.fn()
    , generateWorkflowStepPlan: jest.fn()
    , generateLLMText: jest.fn()
} ) );

jest.mock( '../app/workflows/workflows.service', () => ( {
    getWorkflowById: jest.fn()
    , getLatestWorkflowVersion: jest.fn()
} ) );

jest.mock( '../app/workflowChatMessages/workflowChatMessages.service', () => ( { getWorkflowChatMessages: jest.fn() } ) );

jest.mock( '../app/tools/tools.helper', () => ( { getCachedTools: jest.fn() } ) );

jest.mock( '../lib/workflowProposals', () => ( { storeWorkflowProposal: jest.fn() } ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow chat history summarization', () => {

    beforeEach( () => {
        jest.clearAllMocks();

        getWorkflowById.mockResolvedValue( success( {
            id: 'workflow-1'
            , name: 'Summarization Workflow'
            , description: null
        } ) );

        getLatestWorkflowVersion.mockResolvedValue( success( {
            id: 'version-1'
            , dag: { steps: [] }
        } ) );

        getCachedTools.mockResolvedValue( success( [] ) );
    } );

    workflowChatHistorySummarizationDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                const historyMessages = example.inputs.historyMessages.map( ( message, index ) => ( {
                    role: message.role
                    , content: message.content
                    , createdAt: new Date( Date.now() + index ).toISOString()
                } ) );

                getWorkflowChatMessages.mockResolvedValueOnce( success( historyMessages ) );

                if ( example.expected.summaryCalled > 0 ) {
                    generateLLMText.mockResolvedValueOnce( success( { content: example.mocks?.summaryText ?? '' } ) );
                }

                let capturedContext: string | null = null;

                generateWorkflowIntent.mockImplementationOnce( async params => {
                    capturedContext = params.conversationContext ?? null;
                    return success( {
                        intent: 'ask_clarifying'
                        , assistantMessage: ''
                        , clarificationQuestion: 'Clarify?'
                    } );
                } );

                const result = await generateWorkflowChatResponse( {
                    workflowId: 'workflow-1'
                    , userMessage: example.inputs.userMessage
                    , modelId: 'gpt-4o'
                } );

                const summaryPrompt = generateLLMText.mock.calls[ 0 ]?.[ 0 ]?.prompt ?? '';
                const contextValue = capturedContext ?? '';

                const outputs = {
                    success: result.isSuccess()
                    , summaryCalled: generateLLMText.mock.calls.length
                    , summaryPromptContainsInstruction: summaryPrompt.includes( 'Summarize the workflow authoring conversation' )
                    , contextIncludesSummaryHeader: contextValue.includes( 'Summary of earlier messages' )
                    , contextIncludesSummaryText: contextValue.includes( example.mocks?.summaryText ?? '' )
                    , contextIncludesRecentMessages: contextValue.includes( 'Recent messages' )
                    , contextIncludesRecentMessage: contextValue.includes( example.inputs.recentMessageContent )
                    , contextExcludesOlderMessage: !contextValue.includes( example.inputs.excludedMessageContent )
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
