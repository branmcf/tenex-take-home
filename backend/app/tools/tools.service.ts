import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { postGraphileRequest } from '../../lib/postGraphile';
import {
    ToolsFetchFailed
    , ToolNotFound
} from './tools.errors';
import {
    CreateToolMutation
    , CreateToolMutationVariables
    , GetToolByExternalIdQuery
    , GetToolByExternalIdQueryVariables
    , GetToolByIdQuery
    , GetToolByIdQueryVariables
    , GetToolsQuery
    , UpdateToolMutation
    , UpdateToolMutationVariables
} from './tools.service.generatedTypes';

export interface ToolRecord {
    id: string;
    name: string;
    description?: string | null;
    schema?: Record<string, unknown> | null;
    source: string;
    externalId?: string | null;
    version?: string | null;
    schemaHash?: string | null;
    lastSyncedAt?: string | null;
}

/**
 * get all tools from the database
 *
 * @returns Either<ResourceError, ToolRecord[]>
 */
export const getTools = async (): Promise<Either<ResourceError, ToolRecord[]>> => {

    const GET_TOOLS = gql`
        query getTools {
            allTools(condition: { deletedAt: null }) {
                nodes {
                    id
                    name
                    description
                    schema
                    source
                    externalId
                    version
                }
            }
        }
    `;

    const result = await postGraphileRequest<GetToolsQuery, undefined>( {
        query: GET_TOOLS
    } );

    if ( result.isError() ) {
        return error( result.value );
    }

    const tools = result.value.allTools?.nodes
        .filter( ( tool ): tool is NonNullable<typeof tool> => tool !== null ) ?? [];

    return success( tools );

};

/**
 * get a tool by id
 *
 * @param toolId - tool id
 * @returns Either<ResourceError, ToolRecord>
 */
export const getToolById = async (
    toolId: string
): Promise<Either<ResourceError, ToolRecord>> => {

    const GET_TOOL_BY_ID = gql`
        query getToolById($toolId: UUID!) {
            toolById(id: $toolId) {
                id
                name
                description
                schema
                source
                externalId
                version
            }
        }
    `;

    const result = await postGraphileRequest<GetToolByIdQuery, GetToolByIdQueryVariables>( {
        query: GET_TOOL_BY_ID
        , variables: { toolId }
    } );

    if ( result.isError() ) {
        return error( result.value );
    }

    if ( !result.value.toolById ) {
        return error( new ToolNotFound() );
    }

    return success( result.value.toolById );

};

/**
 * get a tool by external id
 *
 * @param externalId - external id
 * @returns Either<ResourceError, ToolRecord | null>
 */
export const getToolByExternalId = async (
    externalId: string
): Promise<Either<ResourceError, ToolRecord | null>> => {

    const GET_TOOL_BY_EXTERNAL_ID = gql`
        query getToolByExternalId($externalId: String!) {
            allTools(condition: { externalId: $externalId }) {
                nodes {
                    id
                    name
                    description
                    schema
                    source
                    externalId
                    version
                }
            }
        }
    `;

    const result = await postGraphileRequest<GetToolByExternalIdQuery, GetToolByExternalIdQueryVariables>( {
        query: GET_TOOL_BY_EXTERNAL_ID
        , variables: { externalId }
    } );

    if ( result.isError() ) {
        return error( result.value );
    }

    const tools = result.value.allTools?.nodes
        .filter( ( tool ): tool is NonNullable<typeof tool> => tool !== null ) ?? [];

    return success( tools[ 0 ] ?? null );

};

/**
 * create a tool record
 *
 * @param params - tool parameters
 * @returns Either<ResourceError, ToolRecord>
 */
export const createTool = async (
    params: CreateToolMutationVariables['tool']
): Promise<Either<ResourceError, ToolRecord>> => {

    const CREATE_TOOL = gql`
        mutation createTool($tool: ToolInput!) {
            createTool(input: { tool: $tool }) {
                tool {
                    id
                    name
                    description
                    schema
                    source
                    externalId
                    version
                }
            }
        }
    `;

    const result = await postGraphileRequest<CreateToolMutation, CreateToolMutationVariables>( {
        mutation: CREATE_TOOL
        , variables: { tool: params }
    } );

    if ( result.isError() ) {
        return error( result.value );
    }

    if ( !result.value.createTool?.tool ) {
        return error( new ToolsFetchFailed() );
    }

    return success( result.value.createTool.tool );

};

/**
 * update a tool record
 *
 * @param toolId - tool id
 * @param toolPatch - fields to update
 * @returns Either<ResourceError, ToolRecord>
 */
export const updateToolById = async (
    toolId: string
    , toolPatch: UpdateToolMutationVariables['toolPatch']
): Promise<Either<ResourceError, ToolRecord>> => {

    const UPDATE_TOOL = gql`
        mutation updateToolById($toolId: UUID!, $toolPatch: ToolPatch!) {
            updateToolById(input: { id: $toolId, toolPatch: $toolPatch }) {
                tool {
                    id
                    name
                    description
                    schema
                    source
                    externalId
                    version
                }
            }
        }
    `;

    const result = await postGraphileRequest<UpdateToolMutation, UpdateToolMutationVariables>( {
        mutation: UPDATE_TOOL
        , variables: { toolId, toolPatch }
    } );

    if ( result.isError() ) {
        return error( result.value );
    }

    if ( !result.value.updateToolById?.tool ) {
        return error( new ToolsFetchFailed() );
    }

    return success( result.value.updateToolById.tool );

};
