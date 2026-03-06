/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import {
    buildWorkflowToolCallPrompt
    , buildWorkflowStepPlanPrompt
} from '../lib/llm/llm.prompts';
import { buildWorkflowStepExecutionPrompt } from '../utils/constants';

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow authoring prompt guards', () => {

    ls.test(
        'tool call prompt requires structured handoff contracts'
        , async () => {
            const prompt = buildWorkflowToolCallPrompt( {
                userMessage: 'Create a workflow that checks the weather and recommends a bar.'
                , workflowName: 'Weather Bar'
                , workflowDescription: 'Finds the weather then recommends a bar.'
                , dag: { steps: [] }
                , availableTools: []
                , conversationContext: null
            } );

            const outputs = {
                includesStructuredJsonRule: prompt.includes( 'structured JSON outputs over prose' )
                , includesExactFieldsRule: prompt.includes( 'name the exact fields it expects to receive' )
                , includesErrorRule: prompt.includes( 'output ERROR:' )
            };

            await logAndAssertExactMatch( ls, outputs, {
                includesStructuredJsonRule: true
                , includesExactFieldsRule: true
                , includesErrorRule: true
            } );
        }
    );

    ls.test(
        'step plan prompt requires explicit input and output fields'
        , async () => {
            const prompt = buildWorkflowStepPlanPrompt( {
                userMessage: 'Create a workflow that checks the weather and recommends a bar.'
                , workflowName: 'Weather Bar'
                , workflowDescription: 'Finds the weather then recommends a bar.'
                , dag: { steps: [] }
                , conversationContext: null
            } );

            const outputs = {
                includesExplicitFieldRule: prompt.includes( 'For each step, make the instruction specify the exact input fields it expects and the output fields it must produce.' )
                , includesJsonOutputRule: prompt.includes( 'Prefer instructions that produce valid JSON objects when downstream steps need to consume the result.' )
                , includesErrorRule: prompt.includes( 'If required upstream data is missing or invalid, the instruction should say to output ERROR:' )
            };

            await logAndAssertExactMatch( ls, outputs, {
                includesExplicitFieldRule: true
                , includesJsonOutputRule: true
                , includesErrorRule: true
            } );
        }
    );

    ls.test(
        'step execution prompt forces JSON parsing and explicit error output'
        , async () => {
            const prompt = buildWorkflowStepExecutionPrompt( {
                userMessage: 'What bars are good tonight?'
                , step: {
                    id: 'step_2'
                    , name: 'Recommend Bar'
                    , instruction: 'Read the weather JSON and recommend a bar.'
                    , dependsOn: [ 'step_1' ]
                    , tools: []
                }
                , upstreamOutputs: [ 'Output from step_1:\n{"location":"Austin","outdoor_ok":true}' ]
                , toolNames: []
            } );

            const outputs = {
                includesJsonParsingRule: prompt.includes( 'If an upstream output contains JSON, parse and use that JSON instead of paraphrasing it.' )
                , includesNoInventingRule: prompt.includes( 'Do not invent missing fields or claim data exists when it does not.' )
                , includesErrorRule: prompt.includes( 'If required upstream data is missing, malformed, or indicates failure, output ERROR:' )
            };

            await logAndAssertExactMatch( ls, outputs, {
                includesJsonParsingRule: true
                , includesNoInventingRule: true
                , includesErrorRule: true
            } );
        }
    );

} );
