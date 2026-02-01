import 'express-serve-static-core';

declare module 'express-serve-static-core' {
    export interface Response {
        body?: Record<string, unknown>;
    }
}