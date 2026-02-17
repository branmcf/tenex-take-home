import { ResourceError } from '../../errors';

// error thrown when a general llm request fails
export class LLMRequestFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to get response from LLM.`;
        const code = 'LLM_REQUEST_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

// error thrown when an llm workflow tools request fails
export class LLMWorkflowToolsRequestFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to get response from LLM.`;
        const code = 'LLM_WORKFLOW_TOOLS_REQUEST_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
