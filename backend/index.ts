// must be first import — initializes OpenTelemetry for Langfuse tracing
import { spanProcessor } from './lib/langfuse/instrumentation';

import { app } from './server';
import { Log } from './utils';
import { closePostGraphile } from './lib/postGraphile';

const {
    PORT
    , ENVIRONMENT
} = process.env;

const port = PORT || 3026;

const server = app.listen( port, () => {
    Log.info( `Tenex Takehome API is listening on port: ${ port }` );
    Log.info( `Using Node version ${ process.versions.node }` );
    Log.info( `Environment: ${ ENVIRONMENT || 'Local' }` );
} );

process.on( 'SIGINT', async () => {

    // flush pending Langfuse traces
    await spanProcessor.forceFlush();

    // cleanup PostGraphile connections
    await closePostGraphile();

    // close Express server
    server.close( () => process.exit( 128 + 2 ) );
} );

process.on( 'SIGTERM', async () => {

    // flush pending Langfuse traces
    await spanProcessor.forceFlush();

    // cleanup PostGraphile connections
    await closePostGraphile();

    // close Express server
    server.close( () => process.exit( 128 + 15 ) );
} );