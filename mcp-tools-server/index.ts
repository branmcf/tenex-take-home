import { app } from './server';
import { Log } from './utils';

const { PORT, ENVIRONMENT } = process.env;

const port = PORT || 4010;

const server = app.listen( port, () => {
    Log.info( `MCP Tools service is listening on port: ${ port }` );
    Log.info( `Environment: ${ ENVIRONMENT || 'Local' }` );
} );

process.on( 'SIGINT', () => {
    server.close( () => process.exit( 128 + 2 ) );
} );

process.on( 'SIGTERM', () => {
    server.close( () => process.exit( 128 + 15 ) );
} );
