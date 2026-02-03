/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request } from 'express';

// request type for getting all active models
export interface GetModelsRequest extends Request {

    // no params or body required for this endpoint

}

// individual model in the response
export interface ModelResponse {
    id: string;
    name: string;
    provider: string;
}

// response type for getting all active models
export interface GetModelsResponse {
    models: ModelResponse[];
}
