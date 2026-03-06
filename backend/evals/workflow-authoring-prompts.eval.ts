/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import {
    buildWorkflowToolCallPrompt
    , buildWorkflowToolUsagePrompt
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
        'tool usage prompt prefers pairing web search with read_url for page facts'
        , async () => {
            const prompt = buildWorkflowToolUsagePrompt( {
                userMessage: 'Find top tomato recipes with ratings and review counts.'
                , workflowName: 'Recipe Finder'
                , workflowDescription: 'Find recipes from the web.'
                , steps: [
                    {
                        id: 'step_1'
                        , name: 'Research Recipes'
                        , instruction: 'Find recipe pages with ratings and review counts.'
                        , dependsOn: []
                    }
                ]
                , availableTools: [
                    { id: 'web_search', name: 'web_search', version: '1.0.0' }
                    , { id: 'read_url', name: 'read_url', version: '1.0.0' }
                ]
                , conversationContext: null
            } );

            const outputs = {
                includesSearchThenReadRule: prompt.includes( 'Use web_search to discover candidate URLs and read_url to fetch page contents when page-specific facts are required.' )
                , includesPageFactsRule: prompt.includes( 'If a step needs ratings, review counts, ingredients, timings, prices, or other page-specific facts, prefer web_search plus read_url instead of web_search alone.' )
            };

            await logAndAssertExactMatch( ls, outputs, {
                includesSearchThenReadRule: true
                , includesPageFactsRule: true
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
        'step execution prompt allows structured partial results before hard failure'
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
                , includesPartialResultRule: prompt.includes( 'If some required information is unavailable but the step can still provide a useful partial result, return the best structured result you can and clearly note which fields are missing or unverified.' )
                , includesHardErrorRule: prompt.includes( 'Only output ERROR: when the step truly cannot continue or produce any useful result.' )
            };

            await logAndAssertExactMatch( ls, outputs, {
                includesJsonParsingRule: true
                , includesNoInventingRule: true
                , includesPartialResultRule: true
                , includesHardErrorRule: true
            } );
        }
    );

} );
