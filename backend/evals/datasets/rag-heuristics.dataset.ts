/* ----------------- Imports --------------------- */
import { RagHeuristicsDatasetCase } from './datasets.types';

export const ragHeuristicsDataset: RagHeuristicsDatasetCase[] = [
    {
        name: 'casual greeting'
        , story: 'A user greets the assistant without requesting external facts.'
        , inputs: {
            query: 'Hi there!'
            , reason: 'casual greeting'
        }
        , expected: { needsWebSearch: false }
    }
    , {
        name: 'gratitude'
        , story: 'A user thanks the assistant.'
        , inputs: {
            query: 'Thanks for your help earlier.'
            , reason: 'gratitude'
        }
        , expected: { needsWebSearch: false }
    }
    , {
        name: 'simple bot question'
        , story: 'A user asks a general product question that does not need sources.'
        , inputs: {
            query: 'What is your name?'
            , reason: 'simple bot question'
        }
        , expected: { needsWebSearch: false }
    }
    , {
        name: 'how-to question'
        , story: 'A user asks for deployment guidance that likely benefits from sources.'
        , inputs: {
            query: 'How do I deploy this app on AWS with best practices?'
            , reason: 'how-to question'
        }
        , expected: { needsWebSearch: true }
    }
    , {
        name: 'comparison request'
        , story: 'A user compares model variants and expects up-to-date info.'
        , inputs: {
            query: 'Compare GPT-4o vs Claude 3.5 Sonnet.'
            , reason: 'comparison'
        }
        , expected: { needsWebSearch: true }
    }
    , {
        name: 'current events keyword'
        , story: 'A user requests the latest macroeconomic data.'
        , inputs: {
            query: 'Latest US CPI numbers for this month.'
            , reason: 'current events keyword'
        }
        , expected: { needsWebSearch: true }
    }
    , {
        name: 'recommendations keyword'
        , story: 'A user asks for the best tools on the market.'
        , inputs: {
            query: 'Best tools for workflow automation in 2026.'
            , reason: 'recommendations keyword'
        }
        , expected: { needsWebSearch: true }
    }
    , {
        name: 'creative request defaults to search'
        , story: 'A longer creative request still triggers the strict heuristic.'
        , inputs: {
            query: 'Write a short poem about rain on steel and neon.'
            , reason: 'longer request defaults to search'
        }
        , expected: { needsWebSearch: true }
    }
];
