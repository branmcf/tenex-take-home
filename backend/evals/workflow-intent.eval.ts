/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText } from 'ai';
import { generateWorkflowIntent } from '../lib/llm/llmWithTools';
import { workflowIntentDataset } from './datasets/workflow-intent.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( {
    generateText: jest.fn()
    , streamText: jest.fn()
    , jsonSchema: jest.fn( () => ( {} ) )
    , tool: jest.fn( () => ( {} ) )
} ) );

jest.mock( '../lib/llm/providers', () => ( {
    getModelProvider: jest.fn( () => ( { name: 'mock-model' } ) )
} ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow intent parsing (generateWorkflowIntent)', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowIntentDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                generateText.mockResolvedValueOnce( {
                    text: example.mocks?.llmText ?? ''
                } );

                const result = await generateWorkflowIntent( {
                    userMessage: example.inputs.userMessage
                    , modelId: example.inputs.modelId ?? 'gpt-4o'
                    , workflowName: 'Test Workflow'
                    , workflowDescription: null
                    , dag: { steps: [] }
                    , availableTools: []
                    , conversationContext: null
                } );

                const outputs = {
                    isSuccess: result.isSuccess()
                    , intent: result.value.intent
                    , assistantMessage: result.value.assistantMessage
                    , clarificationQuestion: result.value.clarificationQuestion
                    , clarificationQuestionContains: result.value.clarificationQuestion
                        ? result.value.clarificationQuestion.includes( 'What should I change' )
                        : false
                    , expectsClarification: Boolean( result.value.clarificationQuestion )
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
