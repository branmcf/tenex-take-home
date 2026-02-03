import { apiClient } from "../api-client";
import type { Model } from "@/components/chat/types";

/**
 * Response type for GET /api/models
 */
interface GetModelsResponse {
    models: Model[];
}

/**
 * Fetches all active models from the API.
 * @returns Array of available models
 */
export async function getModels(): Promise<Model[]> {
    const response = await apiClient.get<GetModelsResponse>("/api/models");
    return response.data.models;
}
