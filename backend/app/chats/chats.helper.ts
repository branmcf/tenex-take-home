import { Response } from 'express';

/**
 * SSE event payload type
 */
type SSEPayload = Record<string, unknown>;

/**
 * SSE helper functions returned by the factory
 */
export interface SSEHelpers {
    sendEvent: ( payload: SSEPayload ) => void;
    cleanup: () => void;
    isClosed: () => boolean;
}

/**
 * Create SSE helper functions for a chat events stream
 *
 * @param res - Express response object
 * @param onCleanup - callback invoked when cleanup is called
 * @returns SSE helper functions
 */
export const createChatSSEHelpers = (
    res: Response
    , onCleanup: () => void
): SSEHelpers => {

    let closed = false;

    const sendEvent = ( payload: SSEPayload ): void => {
        if ( !closed ) {
            res.write( `data: ${ JSON.stringify( payload ) }\n\n` );
        }
    };

    const cleanup = (): void => {
        if ( closed ) return;
        closed = true;
        onCleanup();
        res.end();
    };

    const isClosed = (): boolean => closed;

    return { sendEvent, cleanup, isClosed };

};
