import { searchWeb } from '../exa';
import type { LLMSource } from './llm.types';

/**
 * determine if a query needs a web search based on simple heuristics
 *
 * @param query - the user's query
 * @returns true if search is needed, false otherwise
 */
export const needsWebSearch = ( query: string ): boolean => {

    // normalize query for analysis
    const normalizedQuery = query.trim().toLowerCase();

    // if query is too short (< 3 words), likely doesn't need search
    const wordCount = normalizedQuery.split( /\s+/ ).length;
    if ( wordCount < 3 ) {
        return false;
    }

    // greetings and casual conversation patterns
    const casualPatterns = [
        /^(hi|hey|hello|sup|yo|greetings)/
        , /^(thanks|thank you|thx)/
        , /^(bye|goodbye|see you|later)/
        , /^(how are you|how's it going)/
        , /^(good morning|good afternoon|good evening)/
        , /^(yes|no|ok|okay|sure|alright)/
        , /^(lol|haha|hehe)/
    ];

    // check if query matches casual patterns
    for ( const pattern of casualPatterns ) {
        if ( pattern.test( normalizedQuery ) ) {
            return false;
        }
    }

    // simple questions that don't need search
    const simpleQuestionPatterns = [
        /^what is your name/
        , /^who are you/
        , /^what can you do/
        , /^help$/
        , /^test$/
    ];

    for ( const pattern of simpleQuestionPatterns ) {
        if ( pattern.test( normalizedQuery ) ) {
            return false;
        }
    }

    // indicators that search is likely needed
    const searchIndicators = [
        /\b(latest|recent|current|today|2024|2025|2026)\b/  // current events
        , /\b(how to|how do|how can)\b/  // how-to questions
        , /\b(what is|what are|who is|who are|when|where)\b/  // factual questions
        , /\b(explain|describe|tell me about)\b/  // knowledge requests
        , /\b(compare|difference between|vs)\b/  // comparisons
        , /\b(best|top|recommend)\b/  // recommendations
        , /\b(tutorial|guide|documentation|docs)\b/  // learning
    ];

    for ( const pattern of searchIndicators ) {
        if ( pattern.test( normalizedQuery ) ) {
            return true;
        }
    }

    // default: if longer than 5 words and doesn't match casual patterns, search
    return wordCount > 5;

};

/**
 * generate relevant sources for a given query using RAG
 *
 * @param query - the user's query
 * @returns array of relevant sources
 */
export const generateSources = async ( query: string ): Promise<LLMSource[]> => {

    // check if this query needs a web search
    if ( !needsWebSearch( query ) ) {
        return [];
    }

    // search the web using Exa
    const searchResult = await searchWeb( {
        query
        , numResults: 3
        , textMaxCharacters: 2000  // increased to get more content per source
    } );

    // if search failed, return empty sources
    if ( searchResult.isError() ) {
        return [];
    }

    // map Exa results to LLMSource format
    const sources: LLMSource[] = searchResult.value.map( result => ( {
        url: result.url
        , title: result.title
        , description: result.text
    } ) );

    return sources;

};
