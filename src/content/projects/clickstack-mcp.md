---
id: 'clickstack-mcp'
title: 'Building the ClickStack MCP Server'
date: '2025-11-15T00:00:00.000Z'
languages: 'TypeScript, AI, Mongo, React'
description: "Built ClickStack's MCP server from scratch: dual auth, an eval framework benchmarking it against raw SQL, and a Notebooks rewrite to run on it. Presented at OpenHouse."
type: 'External'
status: 'Live'
isPinned: true
media:
  [
    {
      title: 'Marketing material showing how the ClickStack MCP has been optimized over raw SQL Queries',
      url: '../../assets/projects/clickstack-mcp/1.jpg',
      contentType: 'image/jpeg'
    },
    {
      title: 'Picture of me presenting the product at the annual ClickHouse OpenHouse conference',
      url: '../../assets/projects/clickstack-mcp/0.jpg',
      contentType: 'image/png'
    },
    {
      title: 'Example of the MCP working on a problem with a user',
      url: '../../assets/projects/clickstack-mcp/2.png',
      contentType: 'image/png'
    }
  ]
link: 'https://clickhouse.com/docs/use-cases/observability/clickstack/mcp'
color: '#FAFF69'
gitUrl: 'https://github.com/hyperdxio/hyperdx/tree/main/packages/api/src/mcp'
---

## Project Overview

ClickHouse built an MCP server of its own and saw fast adoption across the community. Leadership set a company-wide goal: bring agentic workflows to every product, including ClickStack, our SRE observability platform. I took on the task of building an MCP server for ClickStack, one built to help AI agents investigate and resolve SRE incidents faster than traditional methods.

The project touched our backend architecture directly. We already had internal REST endpoints and OpenAPI endpoints. I wanted to add a new MCP endpoint, all working side by side.

Before writing code, I researched what separates a strong MCP server from a weak one. A common mistake ties the MCP endpoint directly to existing backend services. The better approach builds a dedicated MCP tools layer sitting between agents and the backend. This layer lets agents request and process data more efficiently, by leveraging useful descriptions, providing helpful hints, and ensuring responses are useful and relevant to agents without bloating context windows.

## Technical Overview

The Event Patterns tool shows this approach in practice. The tool lets agents search for common patterns across logs and traces, a task that's hard for SQL alone. A typical SQL approach groups by log message and counts occurrences. This method runs slowly, scales poorly, and struggles with high-cardinality data. Instead, our tool runs two queries: one pulls a random sample of the data, the other counts the total. A draining algorithm then finds the most common patterns in the sample and extrapolates them across the full count. Agents identify common issues quickly, without the cost or fragility of a raw SQL query.

Another complexity is that ClickStack ships as open source software. The MCP server needed to work for both open source and enterprise customers. OSS users authenticate with bearer tokens, reusing our existing OpenAPI auth mechanism. Enterprise customers needed OAuth 2.0, which took additional configuration and setup. Getting both models working took real effort, and the result serves each customer type well. Beyond auth, we worked through the usual list of cloud offering concerns: security review, infrastructure configuration, feature flags, and monitoring. We later announced managed support for the ClickStack MCP server, and covered it in more detail in the [announcement post](https://clickhouse.com/blog/announcing-managed-clickstack-mcp-server).

One additional improvement from the MCP server was inside our in-app SRE investigation tool called Notebooks. Previously, it had its own set of basic investigation tools. Once the MCP server existed, we saw potential to power investigations far beyond what Notebooks handled on its own. So we rewrote Notebooks to run on the MCP server behind the scenes. The change required real work across the existing codebase, and the payoff followed. Notebooks gained access to the full set of MCP tools, users got a more capable investigation tool, and our team cut duplicate code across two products down to one shared codebase.

We wanted the MCP server to deliver more than a light wrapper around SQL queries. To prove this, I built an evaluation framework measuring MCP server performance against plain SQL queries. The framework runs two test setups side by side, each with blind access to only the MCP server under test and its tools. Both setups get the same prompt and investigate independently. A separate LLM then grades which setup produced the better result. I wrote up the full framework and findings in a post on the [ClickHouse blog](https://clickhouse.com/blog/benchmarking-the-clickstack-mcp-server-with-hdx-evals). We later expanded the framework to compare changes across versions, so the framework keeps improving the MCP server rather than only measuring performance once.

This evaluation work turned out to be one of the most important parts of the project. The framework kept us honest about whether we were building real value, rather than a convenient interface alone.

## Roles and Responsibilities

- Researched MCP server design patterns and best practices before writing code
- Architected the standalone MCP service sitting between agents and backend services
- Designed and built the majority of the MCP tools
- Implemented dual authentication: bearer tokens for OSS, OAuth 2.0 for enterprise
- Worked through cloud offering requirements: security review, infrastructure setup, feature flags, monitoring
- Led the rewrite of Notebooks to run on the new MCP service
- Built an evaluation framework to benchmark MCP tools against SQL queries, and expanded the framework to track improvements over time
- Wrote a blog post on the ClickHouse blog detailing the evaluation framework
- Announced and presented the ClickStack MCP server at ClickHouse's annual OpenHouse conference

Building the ClickStack MCP server took real effort from the whole team, and ranks among the more demanding projects I have worked on. Additionally, announcing the product at [our annual conference OpenHouse](https://youtu.be/jFMuS21tKfk?si=3_kz0EAi1eopf0pz&t=55), and engaging with the community, made the work worthwhile.

## References

- Blog post: [Benchmarking the ClickStack MCP Server with HDX Evals](https://clickhouse.com/blog/benchmarking-the-clickstack-mcp-server-with-hdx-evals)
- Conference talk: [ClickStack MCP Server at OpenHouse](https://youtu.be/jFMuS21tKfk?si=3_kz0EAi1eopf0pz&t=55)
- Announcement: [Announcing Managed ClickStack MCP Server](https://clickhouse.com/blog/announcing-managed-clickstack-mcp-server)
