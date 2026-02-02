import type { WorkflowDetail, WorkflowStep } from "@/components/workflows/types";

const BASE_WORKFLOW_TIME = Date.parse("2024-02-01T12:00:00Z");

// Mock conversation history for each workflow
export interface WorkflowConversation {
  workflowId: string;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
  }>;
}

export const MOCK_WORKFLOW_CONVERSATIONS: WorkflowConversation[] = [
  {
    workflowId: "code-review",
    messages: [
      {
        id: "cr-msg-1",
        role: "user",
        content: "Create a workflow that reviews code for best practices and security issues",
        createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 7),
      },
      {
        id: "cr-msg-2",
        role: "assistant",
        content: "I've created a Code Review workflow with 4 steps:\n\n1. **Parse Code Structure** - Analyzes the code organization\n2. **Check Best Practices** - Reviews against coding standards\n3. **Security Analysis** - Scans for vulnerabilities\n4. **Generate Review Report** - Compiles findings\n\nEach step uses specialized tools for thorough analysis.",
        createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 7 + 1000 * 60),
      },
      {
        id: "cr-msg-3",
        role: "user",
        content: "Add a dependency checker to the security step",
        createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 30),
      },
      {
        id: "cr-msg-4",
        role: "assistant",
        content: "Done! I've added the **Dependency Checker** tool to the Security Analysis step. This tool will check for vulnerable dependencies in the codebase, complementing the existing Security Scanner.",
        createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 29),
      },
    ],
  },
  {
    workflowId: "summarize",
    messages: [
      {
        id: "sum-msg-1",
        role: "user",
        content: "I need a workflow to summarize long documents",
        createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 14),
      },
      {
        id: "sum-msg-2",
        role: "assistant",
        content: "I've built a document summarization workflow with 3 steps:\n\n1. **Extract Document Content** - Parses PDFs and other formats\n2. **Identify Key Themes** - Finds main topics and arguments\n3. **Generate Summary** - Creates a concise summary\n\nThe workflow handles various document formats automatically.",
        createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 14 + 1000 * 60),
      },
    ],
  },
];

export const MOCK_WORKFLOW_DETAILS: WorkflowDetail[] = [
  {
    id: "code-review",
    name: "Code Review",
    description: "Automatically review code for best practices, potential bugs, and security issues",
    version: 3,
    lastEditedAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 30),
    createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 7),
    steps: [
      {
        id: "cr-1",
        name: "Parse Code Structure",
        prompt: "Analyze the provided code and identify its structure, including functions, classes, imports, and dependencies. Output a structured representation of the code organization.",
        order: 1,
        tools: [
          { id: "ast-parser", name: "AST Parser", description: "Parses code into abstract syntax tree" },
          { id: "file-reader", name: "File Reader", description: "Reads file contents" },
        ],
      },
      {
        id: "cr-2",
        name: "Check Best Practices",
        prompt: "Review the code against language-specific best practices and coding standards. Check for naming conventions, code organization, and design patterns.",
        order: 2,
        tools: [
          { id: "linter", name: "Linter", description: "Static code analysis tool" },
        ],
      },
      {
        id: "cr-3",
        name: "Security Analysis",
        prompt: "Scan the code for potential security vulnerabilities including injection attacks, authentication issues, and data exposure risks.",
        order: 3,
        tools: [
          { id: "security-scanner", name: "Security Scanner", description: "Scans for security vulnerabilities" },
          { id: "dependency-checker", name: "Dependency Checker", description: "Checks for vulnerable dependencies" },
        ],
      },
      {
        id: "cr-4",
        name: "Generate Review Report",
        prompt: "Compile all findings into a comprehensive code review report with severity levels, specific line references, and actionable recommendations.",
        order: 4,
        tools: [
          { id: "report-generator", name: "Report Generator", description: "Generates formatted reports" },
        ],
      },
    ],
  },
  {
    id: "summarize",
    name: "Summarize Document",
    description: "Extract key points and generate concise summaries from long documents",
    version: 2,
    lastEditedAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 2),
    createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 14),
    steps: [
      {
        id: "sum-1",
        name: "Extract Document Content",
        prompt: "Parse the document and extract all text content, preserving structure like headings, sections, and paragraphs.",
        order: 1,
        tools: [
          { id: "pdf-parser", name: "PDF Parser", description: "Extracts text from PDF documents" },
          { id: "doc-parser", name: "Document Parser", description: "Parses various document formats" },
        ],
      },
      {
        id: "sum-2",
        name: "Identify Key Themes",
        prompt: "Analyze the document content to identify main themes, topics, and key arguments presented in the text.",
        order: 2,
        tools: [],
      },
      {
        id: "sum-3",
        name: "Generate Summary",
        prompt: "Create a concise summary that captures the essential points, maintaining the original document's intent and key conclusions.",
        order: 3,
        tools: [],
      },
    ],
  },
  {
    id: "translate",
    name: "Translate",
    description: "Translate text between languages while preserving meaning and context",
    version: 1,
    lastEditedAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24),
    createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 30),
    steps: [
      {
        id: "tr-1",
        name: "Detect Source Language",
        prompt: "Identify the language of the input text and any specialized terminology or domain-specific content.",
        order: 1,
        tools: [
          { id: "lang-detector", name: "Language Detector", description: "Detects language of text" },
        ],
      },
      {
        id: "tr-2",
        name: "Translate Content",
        prompt: "Translate the text to the target language, preserving meaning, tone, and any cultural context or idioms.",
        order: 2,
        tools: [
          { id: "translator", name: "Translation Engine", description: "Neural machine translation" },
          { id: "glossary", name: "Glossary Lookup", description: "Domain-specific term translations" },
        ],
      },
      {
        id: "tr-3",
        name: "Quality Check",
        prompt: "Review the translation for accuracy, fluency, and consistency. Flag any uncertain translations or potential issues.",
        order: 3,
        tools: [
          { id: "spell-checker", name: "Spell Checker", description: "Checks spelling in target language" },
        ],
      },
    ],
  },
  {
    id: "debug",
    name: "Debug Code",
    description: "Systematically identify and fix bugs in code with detailed analysis",
    version: 5,
    lastEditedAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 6),
    createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 21),
    steps: [
      {
        id: "db-1",
        name: "Reproduce Issue",
        prompt: "Analyze the bug report and code to understand the expected vs actual behavior. Identify the conditions under which the bug occurs.",
        order: 1,
        tools: [
          { id: "test-runner", name: "Test Runner", description: "Runs test cases" },
        ],
      },
      {
        id: "db-2",
        name: "Trace Execution",
        prompt: "Trace the code execution path to identify where the behavior diverges from expectations. Examine variable states and function outputs.",
        order: 2,
        tools: [
          { id: "debugger", name: "Debugger", description: "Step-through code debugger" },
          { id: "logger", name: "Logger", description: "Adds logging statements" },
        ],
      },
      {
        id: "db-3",
        name: "Identify Root Cause",
        prompt: "Based on the execution trace, determine the root cause of the bug. Identify the specific code that needs to be modified.",
        order: 3,
        tools: [],
      },
      {
        id: "db-4",
        name: "Propose Fix",
        prompt: "Generate a code fix that addresses the root cause. Ensure the fix doesn't introduce new issues or break existing functionality.",
        order: 4,
        tools: [
          { id: "code-generator", name: "Code Generator", description: "Generates code patches" },
        ],
      },
      {
        id: "db-5",
        name: "Verify Fix",
        prompt: "Test the proposed fix to ensure it resolves the bug and doesn't cause regressions. Run relevant test cases.",
        order: 5,
        tools: [
          { id: "test-runner", name: "Test Runner", description: "Runs test cases" },
        ],
      },
    ],
  },
  {
    id: "data-analysis",
    name: "Data Analysis Pipeline",
    description: "Analyze datasets to extract insights, detect patterns, and generate visualizations",
    version: 2,
    lastEditedAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 12),
    createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 10),
    steps: [
      {
        id: "da-1",
        name: "Load and Validate Data",
        prompt: "Load the dataset and validate its structure, checking for missing values, data types, and potential quality issues.",
        order: 1,
        tools: [
          { id: "csv-parser", name: "CSV Parser", description: "Parses CSV and tabular data" },
          { id: "data-validator", name: "Data Validator", description: "Validates data quality" },
        ],
      },
      {
        id: "da-2",
        name: "Statistical Analysis",
        prompt: "Perform statistical analysis including descriptive statistics, correlations, and distribution analysis.",
        order: 2,
        tools: [
          { id: "stats-engine", name: "Statistics Engine", description: "Computes statistical measures" },
        ],
      },
      {
        id: "da-3",
        name: "Generate Insights",
        prompt: "Identify key patterns, trends, and anomalies in the data. Provide actionable insights based on the analysis.",
        order: 3,
        tools: [],
      },
    ],
  },
  {
    id: "content-moderation",
    name: "Content Moderation",
    description: "Review and moderate user-generated content for policy compliance",
    version: 4,
    lastEditedAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 48),
    createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 45),
    steps: [
      {
        id: "cm-1",
        name: "Content Classification",
        prompt: "Classify the content type and identify its primary category (text, image, video, etc.).",
        order: 1,
        tools: [
          { id: "content-classifier", name: "Content Classifier", description: "Classifies content types" },
        ],
      },
      {
        id: "cm-2",
        name: "Policy Check",
        prompt: "Check the content against platform policies including prohibited content, spam, and misinformation.",
        order: 2,
        tools: [
          { id: "policy-engine", name: "Policy Engine", description: "Checks content against policies" },
          { id: "toxicity-detector", name: "Toxicity Detector", description: "Detects harmful content" },
        ],
      },
      {
        id: "cm-3",
        name: "Generate Decision",
        prompt: "Make a moderation decision (approve, flag for review, or reject) with detailed reasoning.",
        order: 3,
        tools: [],
      },
    ],
  },
  {
    id: "api-documentation",
    name: "API Documentation Generator",
    description: "Automatically generate comprehensive API documentation from code",
    version: 1,
    lastEditedAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 72),
    createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 5),
    steps: [
      {
        id: "api-1",
        name: "Parse API Endpoints",
        prompt: "Extract all API endpoints, their methods, parameters, and response schemas from the codebase.",
        order: 1,
        tools: [
          { id: "openapi-parser", name: "OpenAPI Parser", description: "Parses OpenAPI/Swagger specs" },
          { id: "code-analyzer", name: "Code Analyzer", description: "Analyzes route definitions" },
        ],
      },
      {
        id: "api-2",
        name: "Generate Descriptions",
        prompt: "Generate human-readable descriptions for each endpoint, parameter, and response field.",
        order: 2,
        tools: [],
      },
      {
        id: "api-3",
        name: "Create Examples",
        prompt: "Generate example requests and responses for each endpoint based on the schema.",
        order: 3,
        tools: [
          { id: "example-generator", name: "Example Generator", description: "Generates API examples" },
        ],
      },
      {
        id: "api-4",
        name: "Format Documentation",
        prompt: "Format the documentation in the specified output format (Markdown, HTML, or OpenAPI spec).",
        order: 4,
        tools: [
          { id: "doc-formatter", name: "Doc Formatter", description: "Formats documentation output" },
        ],
      },
    ],
  },
  {
    id: "email-response",
    name: "Email Response Assistant",
    description: "Draft professional email responses based on context and tone requirements",
    version: 3,
    lastEditedAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 96),
    createdAt: new Date(BASE_WORKFLOW_TIME - 1000 * 60 * 60 * 24 * 60),
    steps: [
      {
        id: "em-1",
        name: "Analyze Email Context",
        prompt: "Analyze the incoming email to understand its intent, urgency, and required response type.",
        order: 1,
        tools: [
          { id: "email-parser", name: "Email Parser", description: "Parses email content and metadata" },
          { id: "sentiment-analyzer", name: "Sentiment Analyzer", description: "Analyzes email tone" },
        ],
      },
      {
        id: "em-2",
        name: "Draft Response",
        prompt: "Draft an appropriate response based on the context, maintaining professional tone and addressing all points raised.",
        order: 2,
        tools: [],
      },
      {
        id: "em-3",
        name: "Review and Polish",
        prompt: "Review the draft for clarity, professionalism, and completeness. Suggest improvements if needed.",
        order: 3,
        tools: [
          { id: "grammar-checker", name: "Grammar Checker", description: "Checks grammar and style" },
        ],
      },
    ],
  },
];

// Helper function to generate a new step based on user input
export function generateMockStep(stepNumber: number): WorkflowStep {
  const stepTemplates = [
    { name: "Validate Input", prompt: "Validate the input data for correctness and completeness before processing.", tools: [{ id: "validator", name: "Input Validator", description: "Validates input data" }] },
    { name: "Transform Data", prompt: "Transform the data into the required format for the next processing stage.", tools: [{ id: "transformer", name: "Data Transformer", description: "Transforms data formats" }] },
    { name: "Apply Business Rules", prompt: "Apply the configured business rules to process the data according to requirements.", tools: [] },
    { name: "Generate Output", prompt: "Generate the final output in the specified format with all required fields.", tools: [{ id: "formatter", name: "Output Formatter", description: "Formats output data" }] },
    { name: "Send Notifications", prompt: "Send notifications to relevant stakeholders about the processing results.", tools: [{ id: "notifier", name: "Notification Service", description: "Sends notifications" }] },
  ];

  const template = stepTemplates[Math.floor(Math.random() * stepTemplates.length)];
  return {
    id: `new-step-${Date.now()}-${stepNumber}`,
    name: template.name,
    prompt: template.prompt,
    order: stepNumber,
    tools: template.tools,
  };
}
