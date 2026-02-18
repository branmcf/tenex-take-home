import { apiClient } from "../api-client";
import type { Model } from "@/types";

/**
 * Response type for GET /api/models
 */
interface GetModelsResponse {
    models: Model[];
}

interface GetUserModelPreferenceResponse {
    modelId: string | null;
}

interface UpdateUserModelPreferenceResponse {
    success: boolean;
    modelId: string;
}

/**
 * Fetches all active models from the API.
 * @returns Array of available models
 */
export async function getModels(): Promise<Model[]> {
    const response = await apiClient.get<GetModelsResponse>("/api/models");
    return response.data.models;
}

/**
 * Fetches the user's last selected model id.
 * @param userId - The user ID
 * @returns The model id or null
 */
export async function getUserModelPreference(userId: string): Promise<string | null> {
    const response = await apiClient.get<GetUserModelPreferenceResponse>(
        `/api/users/${userId}/model-preference`
    );
    return response.data.modelId ?? null;
}

/**
 * Persists the user's last selected model id.
 * @param userId - The user ID
 * @param modelId - The model ID
 * @returns The saved model id
 */
export async function updateUserModelPreference(
    userId: string,
    modelId: string
): Promise<string> {
    const response = await apiClient.post<UpdateUserModelPreferenceResponse>(
        `/api/users/${userId}/model-preference`,
        { modelId }
    );
    return response.data.modelId;
}
