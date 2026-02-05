import { NextFunction, Response } from 'express';
import { ResourceError } from '../../errors';
import {
    buildWorkflowRunSnapshot
    , getWorkflowRunSnapshotData
    , getWorkflowRunsByChatId
    , normalizeWorkflowRunSnapshotSource
} from './workflowRuns.service';
import { StreamWorkflowRunRequest } from './workflowRuns.types';
import {
    WorkflowRunAccessForbidden
    , WorkflowRunStreamFailed
} from './workflowRuns.errors';
import {
    GetWorkflowRunsRequest
    , GetWorkflowRunsResponse
} from './workflowRuns.types';

const POLL_INTERVAL_MS = 1000;
const TERMINAL_GRACE_MS = 15000;

const isTerminalStatus = ( status: string ) => {
    return status === 'PASSED' || status === 'FAILED' || status === 'CANCELLED';
};

/**
 * @title Stream Workflow Run Handler
 * @notice Streams workflow run step updates via SSE.
 * @param req Express request
 * @param res Express response
 */
export const streamWorkflowRunHandler = async (
    req: StreamWorkflowRunRequest
    , res: Response<ResourceError>
    , _next: NextFunction
): Promise<Response<ResourceError>> => {

    // get params
    const { chatId, workflowRunId } = req.params;

    // set headers for SSE
    res.setHeader( 'Content-Type', 'text/event-stream' );
    res.setHeader( 'Cache-Control', 'no-cache' );
    res.setHeader( 'Connection', 'keep-alive' );

    // ensure headers are flushed
    if ( typeof res.flushHeaders === 'function' ) {
        res.flushHeaders();
    }

    let isClosed = false;
    let lastSnapshot = '';
    let terminalSince: number | null = null;
    let isPolling = false;

    // helper to send SSE data
    const sendEvent = ( payload: Record<string, unknown> ) => {
        res.write( `data: ${ JSON.stringify( payload ) }\n\n` );
    };

    // helper to fetch and stream snapshot updates
    const fetchAndSendSnapshot = async () => {
        if ( isPolling || isClosed ) {
            return;
        }

        isPolling = true;

        try {
            const snapshotResult = await getWorkflowRunSnapshotData( workflowRunId );

            if ( snapshotResult.isError() ) {
                sendEvent( {
                    type: 'error'
                    , error: snapshotResult.value
                } );
                res.end();
                isClosed = true;
                return;
            }

            const normalizedSource = normalizeWorkflowRunSnapshotSource( snapshotResult.value );

            // validate workflow run belongs to chat
            if ( normalizedSource.workflowRun.chatId !== chatId ) {
                const error = new WorkflowRunAccessForbidden();
                sendEvent( {
                    type: 'error'
                    , error
                } );
                res.end();
                isClosed = true;
                return;
            }

            const snapshot = buildWorkflowRunSnapshot( normalizedSource );
            const snapshotPayload = {
                type: 'snapshot'
                , ...snapshot
            };

            const serialized = JSON.stringify( snapshotPayload );

            if ( serialized !== lastSnapshot ) {
                sendEvent( snapshotPayload as Record<string, unknown> );
                lastSnapshot = serialized;
            }

            if ( isTerminalStatus( snapshot.workflowRun.status ) ) {
                if ( terminalSince === null ) {
                    terminalSince = Date.now();
                }

                const hasMessage = Boolean( snapshot.message );
                const terminalElapsed = Date.now() - terminalSince;

                if ( hasMessage || terminalElapsed > TERMINAL_GRACE_MS ) {
                    sendEvent( {
                        type: 'complete'
                        , workflowRunId
                        , status: snapshot.workflowRun.status
                    } );
                    res.end();
                    isClosed = true;
                    return;
                }
            } else {
                terminalSince = null;
            }
        } catch ( err ) {
            const error = new WorkflowRunStreamFailed();
            sendEvent( {
                type: 'error'
                , error: {
                    message: error.clientMessage
                    , code: error.code
                }
            } );
            res.end();
            isClosed = true;
        } finally {
            isPolling = false;
        }
    };

    // send initial snapshot immediately
    await fetchAndSendSnapshot();

    // poll for updates
    const interval = setInterval( () => {
        void fetchAndSendSnapshot();
    }, POLL_INTERVAL_MS );

    // stop polling on client disconnect
    req.on( 'close', () => {
        isClosed = true;
        clearInterval( interval );
    } );

    return res;

};

/**
 * @title Get Workflow Runs Handler
 * @notice Returns workflow runs and step details for a chat.
 * @param req Express request
 * @param res Express response
 */
export const getWorkflowRunsByChatIdHandler = async (
    req: GetWorkflowRunsRequest
    , res: Response<ResourceError | GetWorkflowRunsResponse>
): Promise<Response<ResourceError | GetWorkflowRunsResponse>> => {

    // get chatId from params
    const { chatId } = req.params;

    // fetch workflow runs
    const workflowRunsResult = await getWorkflowRunsByChatId( chatId );

    // check for errors
    if ( workflowRunsResult.isError() ) {
        return res
            .status( workflowRunsResult.value.statusCode )
            .json( workflowRunsResult.value );
    }

    // return success
    return res.status( 200 ).json( { workflowRuns: workflowRunsResult.value } );

};
