/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { workflowTools } from '../lib/llm/workflowTools';
import { workflowToolsSchemaDataset } from './datasets/workflow-tools-schema.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( {
    tool: jest.fn( config => config )
    , jsonSchema: jest.fn( schema => schema )
} ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow tool schema compliance', () => {

    workflowToolsSchemaDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                const schema = workflowTools[ example.inputs.toolName ].inputSchema;

                const outputs = {
                    hasRequiredName: schema.required?.includes( 'name' ) ?? false
                    , hasRequiredInstruction: schema.required?.includes( 'instruction' ) ?? false
                    , additionalProperties: schema.additionalProperties
                    , toolRequiresId: schema.properties?.tools?.items?.required?.includes( 'id' ) ?? false
                    , toolRequiresVersion: schema.properties?.tools?.items?.required?.includes( 'version' ) ?? false
                    , requiresStepId: schema.required?.includes( 'stepId' ) ?? false
                    , requiresNewDependsOn: schema.required?.includes( 'newDependsOn' ) ?? false
                };

                const filteredOutputs = Object.keys( example.expected ).reduce<Record<string, unknown>>( ( acc, key ) => {
                    acc[ key ] = outputs[ key as keyof typeof outputs ];
                    return acc;
                }, {} );

                await logAndAssertExactMatch( ls, filteredOutputs, example.expected );

            }
        );
    } );

} );
