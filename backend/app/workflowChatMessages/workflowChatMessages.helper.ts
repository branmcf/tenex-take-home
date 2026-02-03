import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { generateLLMText } from '../../lib/llm';
import { WorkflowChatLLMRequestFailed } from './workflowChatMessages.errors';

/**
 * generate a response from the LLM for workflow authoring
 *
 * @param params - the parameters for generating the response
 * @returns Either<ResourceError, { content: string }> - the LLM response
 */
export const generateWorkflowChatResponse = async (
    params: {
        userMessage: string;
        modelId: string;
    }
): Promise<Either<ResourceError, { content: string }>> => {

    // create a system prompt for workflow authoring context
    const workflowPrompt = `You are a helpful assistant that helps users create and modify workflows.
A workflow is a series of steps that can be executed in sequence or in parallel.
Each step has a name, a prompt/instruction, and optional tools.

When users ask you to:
- Add a step: Acknowledge and describe what the step will do
- Remove a step: Acknowledge and confirm the removal
- Modify a step: Acknowledge and describe the changes
- Add a tool: Acknowledge and describe the tool being added

User's request: ${params.userMessage}

Respond with a helpful, concise message about the workflow change. Use markdown formatting when appropriate.`;

    // call the LLM lib function without RAG (workflow authoring doesn't need external sources)
    const result = await generateLLMText( {
        modelId: params.modelId
        , prompt: workflowPrompt
        , useRAG: false
    } );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( new WorkflowChatLLMRequestFailed() );
    }

    // return success with the generated text
    return success( {
        content: result.value.content
    } );

};
