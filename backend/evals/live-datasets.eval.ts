/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch, assertExactMatch } from './evals.helper';
import { workflowIntentDataset } from './datasets/workflow-intent.dataset';
import { workflowToolUsageDataset } from './datasets/workflow-tool-usage.dataset';
import { goldenWorkflowDataset } from './datasets/golden-workflow.dataset';
import { generateWorkflowIntent, generateWorkflowStepToolUsage } from '../lib/llm/llmWithTools';

const shouldRunLive = process.env.RUN_LIVE_EVALS === 'true';
const modelId = process.env.LIVE_EVAL_MODEL_ID ?? 'gpt-4o';

const describeLive = shouldRunLive ? ls.describe : ls.describe.skip;

/* ----------------- Tests ----------------------- */

describeLive( 'Live dataset evals - workflow intent', () => {

    workflowIntentDataset.forEach( example => {
        ls.test(
            example.name
            , {
                inputs: {
                    userMessage: example.inputs.userMessage
                    , modelId
                    , workflowName: 'Sample Workflow'
                    , workflowDescription: 'A workflow used for live eval validation.'
                    , dag: { steps: [] }
                    , availableTools: []
                    , conversationContext: null
                }
                , referenceOutputs: {
                    intent: example.expected.intent
                    , expectsClarification: example.expected.expectsClarification
                }
            }
            , async () => {

                const result = await generateWorkflowIntent( {
                    userMessage: example.inputs.userMessage
                    , modelId
                    , workflowName: 'Sample Workflow'
                    , workflowDescription: 'A workflow used for live eval validation.'
                    , dag: { steps: [] }
                    , availableTools: []
                    , conversationContext: null
                } );

                const outputs = result.isSuccess()
                    ? {
                        intent: result.value.intent
                        , expectsClarification: Boolean( result.value.clarificationQuestion )
                    }
                    : {
                        intent: 'error'
                        , expectsClarification: false
                    };

                const referenceOutputs = {
                    intent: example.expected.intent
                    , expectsClarification: example.expected.expectsClarification
                };

                await logAndAssertExactMatch( ls, outputs, referenceOutputs );

            }
        );
    } );

} );

describeLive( 'Live dataset evals - workflow tool usage', () => {

    workflowToolUsageDataset.forEach( example => {
        if ( example.expected.isError ) {
            return;
        }

        ls.test(
            example.name
            , {
                inputs: {
                    userMessage: example.inputs.userMessage
                    , modelId
                    , workflowName: 'Sample Workflow'
                    , workflowDescription: 'A workflow used for live eval validation.'
                    , steps: example.inputs.steps
                    , availableTools: example.inputs.availableTools
                    , conversationContext: null
                }
                , referenceOutputs: example.expected.expectedUsageByStepId
            }
            , async () => {

                const result = await generateWorkflowStepToolUsage( {
                    userMessage: example.inputs.userMessage
                    , modelId
                    , workflowName: 'Sample Workflow'
                    , workflowDescription: 'A workflow used for live eval validation.'
                    , steps: example.inputs.steps
                    , availableTools: example.inputs.availableTools
                    , conversationContext: null
                } );

                const usageByStepId = result.isSuccess()
                    ? result.value.steps.reduce<Record<string, boolean>>( ( acc, step ) => {
                        acc[ step.stepId ] = Boolean( step.useTools );
                        return acc;
                    }, {} )
                    : {};

                await logAndAssertExactMatch( ls, usageByStepId, example.expected.expectedUsageByStepId );

            }
        );
    } );

} );

describeLive( 'Live dataset evals - golden set', () => {

    goldenWorkflowDataset.forEach( example => {
        ls.test(
            example.name
            , {
                inputs: {
                    userMessage: example.inputs.userMessage
                    , modelId
                    , workflowName: example.inputs.workflowName
                    , workflowDescription: example.inputs.workflowDescription
                    , dag: example.inputs.dag
                    , availableTools: example.inputs.availableTools
                    , conversationContext: example.inputs.conversationContext
                    , toolUsageSteps: example.inputs.toolUsageSteps
                }
                , referenceOutputs: {
                    intent: example.expected.expectedIntent
                    , expectsClarification: example.expected.expectsClarification
                }
            }
            , async () => {

                const intentResult = await generateWorkflowIntent( {
                    userMessage: example.inputs.userMessage
                    , modelId
                    , workflowName: example.inputs.workflowName
                    , workflowDescription: example.inputs.workflowDescription
                    , dag: example.inputs.dag
                    , availableTools: example.inputs.availableTools
                    , conversationContext: example.inputs.conversationContext
                } );

                const toolUsageResult = await generateWorkflowStepToolUsage( {
                    userMessage: example.inputs.userMessage
                    , modelId
                    , workflowName: example.inputs.workflowName
                    , workflowDescription: example.inputs.workflowDescription
                    , steps: example.inputs.toolUsageSteps
                    , availableTools: example.inputs.availableTools
                    , conversationContext: example.inputs.conversationContext
                } );

                const intentOutputs = {
                    intent: intentResult.isSuccess() ? intentResult.value.intent : 'error'
                    , expectsClarification: intentResult.isSuccess()
                        ? Boolean( intentResult.value.clarificationQuestion )
                        : false
                };

                const usageByStepId = toolUsageResult.isSuccess()
                    ? toolUsageResult.value.steps.reduce<Record<string, boolean>>( ( acc, step ) => {
                        acc[ step.stepId ] = Boolean( step.useTools );
                        return acc;
                    }, {} )
                    : {};

                const referenceOutputs = {
                    intent: example.expected.expectedIntent
                    , expectsClarification: example.expected.expectsClarification
                };

                ls.logOutputs( {
                    ...intentOutputs
                    , usageByStepId
                } );

                await assertExactMatch( intentOutputs, referenceOutputs );

            }
        );
    } );

} );
