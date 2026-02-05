import { Request } from 'express';

export interface GetUserModelPreferenceRequest extends Request {
    params: {
        userId: string;
    };
}

export interface GetUserModelPreferenceResponse {
    modelId: string | null;
}

export interface UpdateUserModelPreferenceRequest extends Request {
    params: {
        userId: string;
    };
    body: {
        modelId: string;
    };
}

export interface UpdateUserModelPreferenceResponse {
    success: boolean;
    modelId: string;
}

export interface UserModelPreferenceRecord {
    id: string;
    userId: string;
    modelId: string;
    createdAt: string;
    updatedAt: string;
}
