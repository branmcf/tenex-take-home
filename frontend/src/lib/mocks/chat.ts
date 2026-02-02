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

// Mock conversation history for each chat
export interface ChatConversation {
  chatId: string;
  messages: Message[];
}

export const MOCK_CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    chatId: "1",
    messages: [
      {
        id: "1-msg-1",
        role: "user",
        content: "Let me test this model with a few prompts. Can you explain what GPT-4 is capable of?",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 10),
      },
      {
        id: "1-msg-2",
        role: "assistant",
        content: `GPT-4 is OpenAI's most advanced language model with several key capabilities:

## Core Capabilities

1. **Advanced Reasoning** - Can solve complex logical problems and follow multi-step instructions
2. **Code Generation** - Writes and debugs code in multiple programming languages
3. **Creative Writing** - Produces creative content like stories, poems, and scripts
4. **Analysis** - Can analyze documents, images, and data

## Key Improvements over GPT-3.5

- Better at following nuanced instructions
- More factually accurate
- Improved performance on academic benchmarks
- Can handle longer context (up to 128K tokens)

Would you like me to demonstrate any specific capability?`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 9),
        sources: MOCK_SOURCES[3],
      },
    ],
  },
  {
    chatId: "2",
    messages: [
      {
        id: "2-msg-1",
        role: "user",
        content: "What's the difference between viewport units and fixed positioning in CSS?",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 35),
      },
      {
        id: "2-msg-2",
        role: "assistant",
        content: `Great question! These are two different CSS concepts that often get confused:

## Viewport Units

Viewport units are relative to the browser window size:

- \`vw\` - 1% of viewport width
- \`vh\` - 1% of viewport height
- \`vmin\` - 1% of smaller dimension
- \`vmax\` - 1% of larger dimension

\`\`\`css
.full-screen-hero {
  height: 100vh;
  width: 100vw;
}
\`\`\`

## Fixed Positioning

Fixed positioning takes an element out of normal flow and positions it relative to the viewport:

\`\`\`css
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
\`\`\`

## Key Differences

| Aspect | Viewport Units | Fixed Position |
|--------|---------------|----------------|
| Purpose | Sizing elements | Positioning elements |
| Scrolling | Element scrolls with page | Element stays in place |
| Use case | Responsive sizing | Sticky headers/footers |

They can be combined! A fixed element can use viewport units for sizing.`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 34),
        sources: MOCK_SOURCES[1],
      },
    ],
  },
  {
    chatId: "3",
    messages: [
      {
        id: "3-msg-1",
        role: "user",
        content: "I'm looking for fonts similar to Inter and SF Pro. Any recommendations?",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 65),
      },
      {
        id: "3-msg-2",
        role: "assistant",
        content: `Here are some excellent alternatives to Inter and SF Pro:

## Similar to Inter

1. **Satoshi** - Modern geometric sans with a friendly feel
2. **Plus Jakarta Sans** - Clean, professional with good x-height
3. **General Sans** - Slightly more geometric than Inter
4. **Outfit** - Similar weights and proportions

## Similar to SF Pro

1. **DM Sans** - Geometric with similar proportions
2. **Nunito Sans** - Rounded, friendly alternative
3. **Source Sans Pro** - Adobe's clean sans-serif
4. **Work Sans** - Optimized for screen display

## Free Alternatives on Google Fonts

\`\`\`css
/* Inter-like */
font-family: 'Plus Jakarta Sans', sans-serif;

/* SF Pro-like */
font-family: 'DM Sans', sans-serif;
\`\`\`

Would you like me to provide specific font pairings for headings and body text?`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 64),
      },
    ],
  },
  {
    chatId: "4",
    messages: [
      {
        id: "4-msg-1",
        role: "user",
        content: "Hey, I need help setting up a monorepo structure for my frontend and backend code. What's the best approach?",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 24 - 1000 * 60 * 5),
      },
      {
        id: "4-msg-2",
        role: "assistant",
        content: `I'd recommend using a modern monorepo tool. Here are your best options:

## Recommended: Turborepo

Turborepo is excellent for TypeScript/JavaScript monorepos:

\`\`\`
my-monorepo/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Node.js backend
├── packages/
│   ├── ui/           # Shared React components
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utilities
├── turbo.json
└── package.json
\`\`\`

## Key Benefits

1. **Smart caching** - Only rebuilds what changed
2. **Parallel execution** - Runs tasks concurrently
3. **Shared dependencies** - No duplication

## Getting Started

\`\`\`bash
npx create-turbo@latest
\`\`\`

## Alternatives

- **Nx** - More features, steeper learning curve
- **pnpm workspaces** - Simpler, manual configuration
- **Lerna** - Older, now maintained by Nx

Would you like a detailed setup guide for any of these?`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 24 - 1000 * 60 * 4),
        sources: MOCK_SOURCES[1],
      },
    ],
  },
  {
    chatId: "5",
    messages: [
      {
        id: "5-msg-1",
        role: "user",
        content: "What are some alternatives to TanStack Query for data fetching in React?",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 25 - 1000 * 60 * 10),
      },
      {
        id: "5-msg-2",
        role: "assistant",
        content: `There are several great alternatives to TanStack Query:

## Top Alternatives

### 1. SWR (Stale-While-Revalidate)
From Vercel, lightweight and simple:

\`\`\`tsx
import useSWR from 'swr'

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)
  // ...
}
\`\`\`

### 2. RTK Query (Redux Toolkit)
If you're already using Redux:

\`\`\`tsx
const api = createApi({
  endpoints: (builder) => ({
    getUsers: builder.query({ query: () => '/users' }),
  }),
})
\`\`\`

### 3. Apollo Client
For GraphQL APIs:

\`\`\`tsx
const { data, loading } = useQuery(GET_USERS)
\`\`\`

## Comparison

| Feature | TanStack Query | SWR | RTK Query |
|---------|---------------|-----|-----------|
| Bundle Size | ~12KB | ~4KB | ~15KB |
| DevTools | Yes | No | Yes |
| Mutations | Built-in | Manual | Built-in |
| Caching | Advanced | Simple | Advanced |

**My recommendation:** Use SWR for simple apps, stick with TanStack Query for complex ones.`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 25 - 1000 * 60 * 9),
        sources: MOCK_SOURCES[0],
      },
    ],
  },
  {
    chatId: "6",
    messages: [
      {
        id: "6-msg-1",
        role: "user",
        content: "A new agent capability must rely on external constraints for financial transactions. Can you explain how an onchain bank for AI would work?",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 48 - 1000 * 60 * 15),
      },
      {
        id: "6-msg-2",
        role: "assistant",
        content: `This is a fascinating area of research at the intersection of AI and blockchain:

## Core Concept

An "onchain bank for AI" would allow AI agents to:

1. **Hold assets** in smart contract wallets
2. **Execute transactions** with programmable constraints
3. **Operate autonomously** within defined boundaries

## Key Components

### 1. Smart Contract Wallet
\`\`\`solidity
contract AIWallet {
    uint256 public dailyLimit;
    address public controller;

    function executeTransaction(
        address to,
        uint256 amount
    ) external onlyController withinLimit(amount) {
        // Execute with guardrails
    }
}
\`\`\`

### 2. Constraint System
- Daily/transaction limits
- Whitelist of allowed recipients
- Multi-sig for large transactions
- Audit trails

### 3. Identity Layer
- Verifiable AI agent credentials
- Proof of authorized actions

## Challenges

- **Liability** - Who's responsible for AI mistakes?
- **Security** - Prompt injection could drain funds
- **Regulation** - KYC/AML requirements

This is an active research area with projects like NEAR and Autonolas exploring solutions.`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 48 - 1000 * 60 * 14),
      },
    ],
  },
  {
    chatId: "7",
    messages: [
      {
        id: "7-msg-1",
        role: "user",
        content: "Hey, so, I'm an expert in both crypto and traditional finance. What are the biggest problems at the intersection of these two fields?",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 72 - 1000 * 60 * 20),
      },
      {
        id: "7-msg-2",
        role: "assistant",
        content: `Great question! There are several key friction points:

## 1. Settlement & Custody

**Problem:** Traditional finance settles in T+2, crypto settles instantly
- Banks struggle with 24/7 operations
- Custody solutions are fragmented
- Reconciliation is painful

## 2. Regulatory Arbitrage

**Problem:** Different rules for same activities
- Stablecoins vs. money market funds
- DEX trading vs. securities exchange
- Tokenized assets vs. traditional securities

## 3. On/Off Ramps

**Problem:** Moving between systems is expensive and slow
- Bank wire fees and delays
- KYC/AML friction
- Currency conversion costs

## 4. Risk Assessment

**Problem:** Traditional risk models don't fit crypto
- Volatility patterns differ
- Smart contract risk is novel
- Correlation assumptions break down

## Opportunities

1. **Real-time settlement** for traditional rails
2. **Programmable compliance** using smart contracts
3. **Tokenized treasury products** bridging both worlds
4. **Unified custody** across asset types

What specific area interests you most?`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 72 - 1000 * 60 * 19),
      },
    ],
  },
  {
    chatId: "8",
    messages: [
      {
        id: "8-msg-1",
        role: "user",
        content: "Small businesses already pay $250-$600/mo for communications and reviews software. How can I build something better?",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 96 - 1000 * 60 * 30),
      },
      {
        id: "8-msg-2",
        role: "assistant",
        content: `You've identified a great market! Here's how to approach it:

## Current Pain Points

SMBs typically use fragmented tools:
- **Mailchimp** - Email ($20-300/mo)
- **Podium/Birdeye** - Reviews ($200-400/mo)
- **Zendesk/Intercom** - Support ($50-150/mo)

## Winning Strategy

### 1. Unified Inbox
Combine email, SMS, reviews, and social in one place:
\`\`\`
All Messages → Single Dashboard → AI-powered responses
\`\`\`

### 2. AI-First Approach
- Auto-draft review responses
- Smart routing and prioritization
- Sentiment analysis and alerts

### 3. Vertical Focus
Pick ONE vertical first:
- Restaurants
- Home services
- Medical practices
- Auto dealers

## Pricing Strategy

| Tier | Price | Feature |
|------|-------|---------|
| Starter | $99/mo | Core messaging |
| Pro | $249/mo | + Reviews + AI |
| Enterprise | $499/mo | + API + Analytics |

## Go-to-Market

1. Build for ONE vertical deeply
2. Get 10 design partners
3. Iterate on their feedback
4. Expand horizontally

Would you like help with technical architecture or customer acquisition strategy?`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 96 - 1000 * 60 * 29),
      },
    ],
  },
  {
    chatId: "9",
    messages: [
      {
        id: "9-msg-1",
        role: "user",
        content: "SMBs want recognition, not reflection. Here's what works for bookkeeping automation - can you expand on this?",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 120 - 1000 * 60 * 45),
      },
      {
        id: "9-msg-2",
        role: "assistant",
        content: `Brilliant insight! Let me expand on this principle:

## "Recognition, Not Reflection"

SMB owners want software that:
- ✅ **Recognizes** their transactions automatically
- ❌ **Doesn't ask** them to categorize everything

## Bookkeeping Automation That Works

### Level 1: Transaction Recognition
\`\`\`
"Starbucks $5.42" → Meals & Entertainment
"AMZN MKTPLACE" → Office Supplies or Inventory
"GUSTO" → Payroll
\`\`\`

### Level 2: Pattern Learning
After 3-5 similar transactions, stop asking:
- Vendor recognition
- Amount patterns
- Time-of-month patterns

### Level 3: Proactive Insights
Instead of dashboards, send alerts:
- "Revenue up 23% vs last month"
- "Unusual expense: $2,400 at vendor X"
- "You're tracking for $X profit this quarter"

## Implementation Tips

1. **Pre-categorize 80%** using ML on bank descriptions
2. **Ask once, remember forever** for the remaining 20%
3. **Never show empty states** - always have something useful

## Products Doing This Well
- **Pilot** - Bookkeeping + CFO service
- **Bench** - Human + software hybrid
- **Finta** - Automated categorization

The winner will be whoever requires the least cognitive load.`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 120 - 1000 * 60 * 44),
      },
    ],
  },
  {
    chatId: "10",
    messages: [
      {
        id: "10-msg-1",
        role: "user",
        content: "Give me some unconventional business ideas that seem silly but address serious challenges",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 144 - 1000 * 60 * 60),
      },
      {
        id: "10-msg-2",
        role: "assistant",
        content: `Here are some "silly but serious" business ideas:

## 1. Corporate Excuse Generator
**Sounds silly:** AI that writes professional excuses
**Actually solves:** Workplace communication anxiety

## 2. Meeting Escape Button
**Sounds silly:** Physical button that auto-generates urgent calls
**Actually solves:** Unproductive meeting culture ($37B wasted/year)

## 3. Professional Ghostwriter for Ghosting
**Sounds silly:** Write "it's not you, it's me" for job rejections
**Actually solves:** Companies ghost 75% of applicants

## 4. Subscription Shame Service
**Sounds silly:** Monthly report of unused subscriptions
**Actually solves:** Average person wastes $240/year on forgotten subs

## 5. Reply Debt Collector
**Sounds silly:** Tracks and nudges on unanswered emails
**Actually solves:** Professional relationships dying in inboxes

## 6. Time Zone Translator
**Sounds silly:** "I'll send it EOD" → "3am your time"
**Actually solves:** Remote work miscommunication

## The Pattern

These work because they:
1. Take a taboo topic (ghosting, excuses, avoidance)
2. Remove shame by making it a "tool"
3. Solve real productivity/relationship problems

Want me to develop any of these further?`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 144 - 1000 * 60 * 59),
      },
    ],
  },
  {
    chatId: "11",
    messages: [
      {
        id: "11-msg-1",
        role: "user",
        content: "How do I crack into the government tech market? I hear they hate structure that asks for too much, too often.",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 168 - 1000 * 60 * 90),
      },
      {
        id: "11-msg-2",
        role: "assistant",
        content: `Government tech (GovTech) is a $400B+ market with unique challenges:

## The Core Insight

You're right - government buyers hate:
- Long implementation timelines
- Heavy training requirements
- Frequent updates that break workflows

## Winning Strategies

### 1. Start with SBIR/STTR Grants
- Non-dilutive funding
- Built-in pilot customer
- Credibility for larger contracts

### 2. Target "Shadow IT"
Agencies have discretionary budgets ($10-50K) for tools that:
- Solve immediate problems
- Don't require IT approval
- Work alongside existing systems

### 3. Build for Compliance First
\`\`\`
[ FedRAMP Ready ] + [ 508 Compliant ] + [ FISMA ] = Trust
\`\`\`

### 4. Partner with Primes
Large contractors (Booz Allen, Deloitte) need:
- Modern tech to demo
- Products they can resell
- Innovation for proposals

## Low-Friction Entry Points

| Agency | Pain Point | Opportunity |
|--------|-----------|-------------|
| VA | Patient scheduling | Simple booking tools |
| DOD | Document processing | AI-assisted analysis |
| State/Local | Permit processing | Workflow automation |

## Resources

- **GSA Schedule** - Get on the approved vendor list
- **Challenge.gov** - Compete for contracts via demos
- **18F/USDS** - Connect with government technologists

Would you like specific tactics for any of these paths?`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 168 - 1000 * 60 * 89),
      },
    ],
  },
  {
    chatId: "12",
    messages: [
      {
        id: "12-msg-1",
        role: "user",
        content: "I'm working on my thesis and need help with the structure and formatting. It's about distributed systems.",
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 192 - 1000 * 60 * 120),
      },
      {
        id: "12-msg-2",
        role: "assistant",
        content: `I'd be happy to help with your distributed systems thesis! Here's a recommended structure:

## Standard Thesis Structure

### Front Matter
1. Title Page
2. Abstract (250-300 words)
3. Table of Contents
4. List of Figures/Tables

### Main Body

#### Chapter 1: Introduction
- Problem statement
- Research questions
- Contributions
- Thesis outline

#### Chapter 2: Background & Related Work
- Distributed systems fundamentals
- Existing solutions
- Gap analysis

#### Chapter 3: System Design
- Architecture overview
- Design decisions
- Trade-offs (CAP theorem considerations)

#### Chapter 4: Implementation
- Technology stack
- Key algorithms
- Code architecture

#### Chapter 5: Evaluation
- Experimental setup
- Benchmarks
- Results analysis

#### Chapter 6: Conclusion
- Summary of contributions
- Limitations
- Future work

### Back Matter
- References (IEEE or ACM format)
- Appendices

## Formatting Tips

\`\`\`latex
\\documentclass[12pt]{report}
\\usepackage{setspace}
\\doublespacing
\`\`\`

Would you like help with any specific chapter or section?`,
        createdAt: new Date(BASE_MESSAGE_TIME - 1000 * 60 * 60 * 192 - 1000 * 60 * 119),
        sources: MOCK_SOURCES[2],
      },
    ],
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
