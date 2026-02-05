# Backend Evals

This directory contains TypeScript-based evaluation suites for AI behavior in the backend.

## How to run

From `backend/`:

```bash
npm run test:evals
```

To run the live dataset suite (real model calls):

```bash
npm run test:evals-live
```

Set `LIVE_EVAL_MODEL_ID` if you want a different model than the default `gpt-4o`.

## LangSmith + OpenEvals

These evals use LangSmith's Jest integration (`langsmith/jest`) for reporting and OpenEvals for scoring. The tests log outputs to LangSmith and use OpenEvals' `exactMatch` evaluator to score deterministic checks.

If you want to stream results to LangSmith, configure environment variables such as `LANGSMITH_TRACING`, `LANGSMITH_API_KEY`, `LANGSMITH_ENDPOINT`, and `LANGSMITH_PROJECT` before running the suite. See LangSmith docs for details.

## What these cover

- RAG heuristics and prompt augmentation
- Workflow intent parsing and tool call normalization
- Workflow tool usage and step plan parsing
- Workflow metadata and chat title generation
- Workflow chat response proposal flow
- Workflow runner single-step execution path

## Live dataset evals

The `live` dataset suite runs real model calls against fixed datasets (including the golden set) and evaluates the structured outputs. It is gated behind `RUN_LIVE_EVALS=true` to avoid requiring API keys in normal CI runs. Set `LIVE_EVAL_MODEL_ID` to override the default model (`gpt-4o`).

## Datasets

Each eval suite pulls its human-level examples from `backend/evals/datasets/*.dataset.ts`. These datasets are intended to be readable by humans, provide realistic scenarios, and serve as the single source of truth for both mocked evals and live evals.

## Notes

- The suites use Jest mocks to isolate model behavior and keep runs deterministic.
- These evals are intentionally strict; expect failures as models and prompts evolve.
