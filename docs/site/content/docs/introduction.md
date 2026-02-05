# Introduction

Welcome to the HardWire API documentation. HardWire is a powerful platform for building AI-powered workflows and chat applications.

---

## Overview

The HardWire platform provides two main API services:

### Backend API

The main backend API (`/api`) provides endpoints for:

- **Authentication** - User authentication via Better Auth
- **Chats** - Create and manage chat conversations
- **Messages** - Send and receive messages within chats
- **Workflows** - Create and manage automated workflows
- **Workflow Chat Messages** - Interact with workflow assistants
- **Workflow Runs** - Execute and monitor workflow runs
- **Tools** - Access available MCP tools
- **Models** - List available AI models
- **Users** - Manage user preferences and resources

### MCP Tools Server

A dedicated server for Model Context Protocol (MCP) tool execution that provides:

- Tool listing and search
- Tool execution with proper authentication
- Standardized MCP protocol support

---

## Base URLs

| Environment | Backend API | MCP Tools Server |
|-------------|-------------|------------------|
| Development | `http://localhost:3026/api` | `http://localhost:3027` |
| Production | `https://api.hardwire.dev/api` | `https://tools.hardwire.dev` |

---

## Key Concepts

### Chats

Chats are conversation threads that contain messages. Each chat is owned by a user and can optionally be associated with a workflow.

### Workflows

Workflows are automated processes that can be triggered by user messages. They consist of steps (DAG nodes) that execute tools to accomplish tasks.

### Messages

Messages are the individual entries in a chat conversation. They can be from users or AI assistants, and may trigger workflow executions.

### Tools

Tools are MCP-compatible functions that can be executed by the AI assistant or workflow steps. They provide capabilities like web search, file operations, and more.

---

## Getting Started

1. [Set up authentication](getting-started/authentication.md)
2. [Make your first API call](getting-started/api-calls.md)
3. Explore the [Backend API endpoints](endpoints/backend/overview.md)
4. Learn about the [MCP Tools Server](endpoints/mcp-tools-server/overview.md)
