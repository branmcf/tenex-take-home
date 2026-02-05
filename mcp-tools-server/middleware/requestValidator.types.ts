import { SCHEMAS } from './requestValidator.schemas';

export interface RequestContent {
    query?: unknown;
    params?: unknown;
    body?: unknown;
}

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
type OmitNonRequestSchema<S extends string>
    = S extends `${ infer _ }_${ infer __ }` ? S : never;

export type SchemaName = OmitNonRequestSchema<keyof typeof SCHEMAS>;
