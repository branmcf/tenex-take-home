export type LogLevel = '*'
    | 'req'
    | 'res'
    | 'debug'
    | 'info'
    | 'warn'
    | 'error'
    | 'dir';

export interface ReqParams {
    method: string;
    path: string;
    query: Record<string, unknown>;
    requestBody: unknown;
}

export interface ResParams extends ReqParams {
    statusCode: number;
    responseBody: unknown;
    duration: number;
}