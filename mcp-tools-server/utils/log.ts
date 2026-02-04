export class Log {
    static info ( message: string, meta?: unknown ) {
        // eslint-disable-next-line no-console
        console.log( message, meta ?? '' );
    }

    static error ( error: unknown ) {
        // eslint-disable-next-line no-console
        console.error( error );
    }
}
