import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { generateLLMText } from '../../lib/llm';
import { WorkflowDAG } from '../../lib/workflowDags';
import {
    getWorkflowMetadata
    , updateWorkflowMetadata
} from './workflows.service';
import { buildWorkflowMetadataPrompt } from '../../utils/constants';

interface WorkflowMetadataResult {
    name: string;
    description: string;
}


const parseMetadataJson = ( raw: string ): WorkflowMetadataResult | null => {
    const start = raw.indexOf( '{' );
    const end = raw.lastIndexOf( '}' );

    if ( start < 0 || end < 0 || end <= start ) {
        return null;
    }

    try {
        const json = JSON.parse( raw.slice( start, end + 1 ) );
        if ( !json.name || !json.description ) {
            return null;
        }
        return {
            name: json.name
            , description: json.description
        } as WorkflowMetadataResult;
    } catch {
        return null;
    }
};

const fallbackMetadata = ( userMessage: string ): WorkflowMetadataResult => {
    const words = userMessage.trim().split( /\s+/ );
    const name = words.slice( 0, 6 ).join( ' ' ) || 'Untitled Workflow';
    const description = words.slice( 0, 20 ).join( ' ' ) || 'Workflow description unavailable.';

    return {
        name
        , description
    };
};

/**
 * generate workflow name and description from LLM
 *
 * @param params - metadata params
 * @returns Either<ResourceError, WorkflowMetadataResult>
 */
export const generateWorkflowMetadata = async (
    params: {
        userMessage: string;
        modelId: string;
        dag?: WorkflowDAG;
    }
): Promise<Either<ResourceError, WorkflowMetadataResult>> => {

    const prompt = buildWorkflowMetadataPrompt( {
        userMessage: params.userMessage
        , dag: params.dag
    } );

    const result = await generateLLMText( {
        modelId: params.modelId
        , prompt
        , useRAG: false
        , maxTokens: 300
        , temperature: 0.3
    } );

    if ( result.isError() ) {
        return error( result.value );
    }

    const parsed = parseMetadataJson( result.value.content.trim() );

    if ( !parsed ) {
        return success( fallbackMetadata( params.userMessage ) );
    }

    return success( parsed );

};

/**
 * update workflow metadata if sources are auto
 *
 * @param params - update params
 * @returns Either<ResourceError, void>
 */
export const updateWorkflowMetadataIfAuto = async (
    params: {
        workflowId: string;
        userMessage: string;
        modelId: string;
        dag?: WorkflowDAG;
    }
): Promise<Either<ResourceError, void>> => {

    const metadataResult = await getWorkflowMetadata( params.workflowId );

    if ( metadataResult.isError() ) {
        return error( metadataResult.value );
    }

    const metadata = metadataResult.value;
    const shouldUpdateName = metadata.nameSource === 'auto';
    const shouldUpdateDescription = metadata.descriptionSource === 'auto';

    if ( !shouldUpdateName && !shouldUpdateDescription ) {
        return success( undefined );
    }

    const generatedResult = await generateWorkflowMetadata( {
        userMessage: params.userMessage
        , modelId: params.modelId
        , dag: params.dag
    } );

    if ( generatedResult.isError() ) {
        return error( generatedResult.value );
    }

    const patch: {
        name?: string;
        description?: string;
        nameSource?: 'auto' | 'user';
        descriptionSource?: 'auto' | 'user';
    } = {};

    if ( shouldUpdateName ) {
        patch.name = generatedResult.value.name;
        patch.nameSource = 'auto';
    }

    if ( shouldUpdateDescription ) {
        patch.description = generatedResult.value.description;
        patch.descriptionSource = 'auto';
    }

    const updateResult = await updateWorkflowMetadata( params.workflowId, patch );

    if ( updateResult.isError() ) {
        return error( updateResult.value );
    }

    return success( undefined );

};
