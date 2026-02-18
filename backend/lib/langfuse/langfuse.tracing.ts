import { observe, updateActiveTrace } from '@langfuse/tracing';

export interface TraceContext {
    userId?: string;
    sessionId?: string;
    chatId?: string;
    workflowId?: string;
}

/**
 * update the active Langfuse trace with user/session context
 */
export const setTraceContext = ( context: TraceContext ): void => {
    updateActiveTrace( {
        userId: context.userId
        , sessionId: context.sessionId ?? context.chatId
        , metadata: {
            chatId: context.chatId
            , workflowId: context.workflowId
        }
    } );
};

/**
 * wrap a handler with Langfuse tracing
 */
export const withTracing = <T>( name: string, fn: () => Promise<T> ): Promise<T> => {
    return observe( fn, { name } )();
};
