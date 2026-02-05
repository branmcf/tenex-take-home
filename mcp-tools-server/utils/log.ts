export class Log {
    static info ( message: string, meta?: unknown ) {
        // eslint-disable-next-line no-console
        console.log( message, meta ?? '' );
    }

    static warn ( message: string, meta?: unknown ) {
        // eslint-disable-next-line no-console
        console.warn( message, meta ?? '' );
    }

    static error ( messageOrError: string | unknown, meta?: unknown ) {
        // eslint-disable-next-line no-console
        console.error( messageOrError, meta ?? '' );
    }
}
