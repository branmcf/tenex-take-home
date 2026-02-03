export interface ExaSearchResult {
    url: string;
    title: string;
    text?: string;
}

export interface ExaSearchParams {
    query: string;
    numResults?: number;
    type?: 'auto' | 'neural' | 'keyword';
    useAutoprompt?: boolean;
    textMaxCharacters?: number;
}
