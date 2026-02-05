/* ----------------- Imports --------------------- */
import {
    buildWorkflowIntentPrompt
    , buildWorkflowToolUsagePrompt
} from '../lib/llm/workflowSystemPrompt';
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { workflowSystemPromptDataset } from './datasets/workflow-system-prompt.dataset';

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow system prompt formatting', () => {

    workflowSystemPromptDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                const prompt = example.inputs.promptType === 'intent'
                    ? buildWorkflowIntentPrompt( example.inputs.input as Parameters<typeof buildWorkflowIntentPrompt>[ 0 ] )
                    : buildWorkflowToolUsagePrompt( example.inputs.input as Parameters<typeof buildWorkflowToolUsagePrompt>[ 0 ] );

                const outputs = example.inputs.promptType === 'intent'
                    ? {
                        includesWorkflowName: prompt.includes( 'Current workflow name: Demo Workflow' )
                        , includesWorkflowDescription: prompt.includes( 'Current workflow description: Handles demo tasks.' )
                        , includesStart: prompt.includes( 'Start' )
                        , includesToolId: prompt.includes( 'web_search' )
                        , includesConversationHistory: prompt.includes( 'Conversation history' )
                        , includesUserRequest: prompt.includes( 'User request' )
                        , includesJsonInstruction: prompt.includes( 'Output ONLY valid JSON' )
                    }
                    : {
                        includesDecisionRules: prompt.includes( 'Decision rules' )
                        , includesCandidateSteps: prompt.includes( 'Candidate steps to classify' )
                        , includesResearch: prompt.includes( 'Research' )
                        , includesToolId: prompt.includes( 'web_search' ) || prompt.includes( 'Web Search' )
                    };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
