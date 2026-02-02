import type { Message, Model, Workflow, Source } from "@/components/chat/types";

export const MOCK_MODELS: Model[] = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic" },
];

export const MOCK_WORKFLOWS: Workflow[] = [
  { id: "code-review", name: "Code Review" },
  { id: "summarize", name: "Summarize Document" },
  { id: "translate", name: "Translate" },
  { id: "debug", name: "Debug Code" },
];

export const MOCK_SOURCES: Source[][] = [
  [
    {
      url: "https://react.dev/reference/react",
      title: "React Documentation",
      description: "Official React documentation with API reference and guides",
    },
    {
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      title: "MDN Web Docs",
      description: "JavaScript documentation and tutorials",
    },
  ],
  [
    {
      url: "https://nextjs.org/docs",
      title: "Next.js Documentation",
      description: "Learn about Next.js features and API",
    },
    {
      url: "https://tailwindcss.com/docs",
      title: "Tailwind CSS Docs",
      description: "Utility-first CSS framework documentation",
    },
    {
      url: "https://ui.shadcn.com",
      title: "shadcn/ui",
      description: "Beautifully designed components built with Radix UI and Tailwind CSS",
    },
  ],
  [
    {
      url: "https://www.typescriptlang.org/docs/",
      title: "TypeScript Documentation",
      description: "Official TypeScript language documentation",
    },
  ],
  [
    {
      url: "https://github.com/vercel/ai",
      title: "Vercel AI SDK",
      description: "Build AI-powered applications with React, Svelte, Vue, and Solid",
    },
    {
      url: "https://docs.anthropic.com",
      title: "Anthropic API Docs",
      description: "Claude API documentation and guides",
    },
  ],
];

const BASE_MESSAGE_TIME = Date.parse("2024-02-01T12:00:00Z");

export const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Can you explain how React hooks work?",
    createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 5),
  },
  {
    id: "2",
    role: "assistant",
    content: `React Hooks are functions that let you "hook into" React state and lifecycle features from function components.

## Core Hooks

1. **useState** - Adds state to function components
2. **useEffect** - Performs side effects
3. **useContext** - Accesses context values

## Example

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

Learn more at [React Docs](https://react.dev/reference/react).`,
    createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 4),
    sources: MOCK_SOURCES[0],
  },
];

export const MOCK_RESPONSES = [
  `I understand your question. Let me help you with that.

Here's a detailed explanation of the concept you're asking about. The key points to understand are:

1. **First concept** - This is the foundation
2. **Second concept** - Building on the first
3. **Third concept** - Putting it all together

Would you like me to elaborate on any of these points?`,

  `Great question! This involves several interesting concepts.

## Overview

The approach I'd recommend involves:

- Understanding the basics
- Implementing step by step
- Testing thoroughly

\`\`\`javascript
// Example code
function example() {
  const data = fetchData();
  return processData(data);
}
\`\`\`

Let me know if you need more details!`,

  `Let me break this down step by step:

### Step 1: Setup
First, you'll want to initialize your project with the necessary dependencies.

### Step 2: Configuration
Configure the settings according to your requirements.

### Step 3: Implementation
Here's where the main logic goes:

\`\`\`typescript
interface Config {
  option1: string;
  option2: number;
}

function process(config: Config) {
  // Implementation details
  return result;
}
\`\`\`

### Step 4: Testing
Always test your implementation thoroughly.

Does this help clarify things?`,

  `That's an excellent question! Here's what you need to know:

**The short answer:** It depends on your specific use case.

**The longer answer:**

There are multiple approaches you could take:

1. **Approach A** - Best for simple cases
   - Pro: Easy to implement
   - Con: Limited scalability

2. **Approach B** - Better for complex scenarios
   - Pro: More flexible
   - Con: Higher complexity

3. **Approach C** - Balanced solution
   - Pro: Good trade-offs
   - Con: May not be optimal for edge cases

Which approach sounds most relevant to your situation?`,
];
