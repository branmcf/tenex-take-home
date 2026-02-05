export interface ErrorConstructorParams {
    message?: string;
    clientMessage?: string;
    code?: string;
    error?: Error | unknown;
    statusCode?: number;
}
