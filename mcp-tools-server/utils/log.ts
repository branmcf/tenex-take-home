export class Log {
    static info ( message: string, meta?: unknown ) {
         
        console.log( message, meta ?? '' );
    }

    static warn ( message: string, meta?: unknown ) {
         
        console.warn( message, meta ?? '' );
    }

    static error ( messageOrError: string | unknown, meta?: unknown ) {
         
        console.error( messageOrError, meta ?? '' );
    }
}
