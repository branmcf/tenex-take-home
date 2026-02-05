/* ----------------- Imports --------------------- */
import { WorkflowChatHistorySummarizationDatasetCase } from './datasets.types';

export const workflowChatHistorySummarizationDataset: WorkflowChatHistorySummarizationDatasetCase[] = [
    {
        name: 'summarizes history when message count exceeds threshold'
        , story: 'A long authoring conversation should be summarized for context.'
        , inputs: {
            userMessage: 'Update the workflow to include next steps.'
            , historyMessages: [
                { role: 'user', content: 'We need a workflow to digest the weekly sales report.' }
                , { role: 'assistant', content: 'Got it. What sources do you want to include?' }
                , { role: 'user', content: 'Use the CSV export from Salesforce and the revenue dashboard.' }
                , { role: 'assistant', content: 'Any formatting requirements?' }
                , { role: 'user', content: 'Yes, include a short executive summary at the top.' }
                , { role: 'assistant', content: 'Should we email it to leadership?' }
                , { role: 'user', content: 'Yes, send to execs@example.com.' }
                , { role: 'assistant', content: 'Do you want to include pipeline risks?' }
                , { role: 'user', content: 'Include risks and open deals over $100k.' }
                , { role: 'assistant', content: 'Do you want charts or just text?' }
                , { role: 'user', content: 'Just text is fine.' }
                , { role: 'assistant', content: 'Anything else to add?' }
                , { role: 'user', content: 'Add a final section with next steps.' }
            ]
            , recentMessageContent: 'Add a final section with next steps.'
            , excludedMessageContent: 'Yes, include a short executive summary at the top.'
        }
        , mocks: {
            summaryText: 'Summary text only.'
        }
        , expected: {
            success: true
            , summaryCalled: 1
            , summaryPromptContainsInstruction: true
            , contextIncludesSummaryHeader: true
            , contextIncludesSummaryText: true
            , contextIncludesRecentMessages: true
            , contextIncludesRecentMessage: true
            , contextExcludesOlderMessage: true
        }
    }
    , {
        name: 'skips summarization when message count is below threshold'
        , story: 'Short chat history should remain verbatim without a summary.'
        , inputs: {
            userMessage: 'Update the workflow to include a weekly cadence.'
            , historyMessages: [
                { role: 'user', content: 'Build a workflow to summarize product feedback.' }
                , { role: 'assistant', content: 'Any specific sources?' }
                , { role: 'user', content: 'Use the support inbox.' }
                , { role: 'assistant', content: 'Do you want a weekly cadence?' }
                , { role: 'user', content: 'Yes, weekly is perfect.' }
            ]
            , recentMessageContent: 'Yes, weekly is perfect.'
            , excludedMessageContent: 'Use the support inbox.'
        }
        , mocks: {
            summaryText: 'Summary text only.'
        }
        , expected: {
            success: true
            , summaryCalled: 0
            , summaryPromptContainsInstruction: false
            , contextIncludesSummaryHeader: false
            , contextIncludesSummaryText: false
            , contextIncludesRecentMessages: true
            , contextIncludesRecentMessage: true
            , contextExcludesOlderMessage: false
        }
    }
];
