---
id: 'clickstack-notebooks'
title: 'ClickHouse: ClickStack AI Notebooks'
date: '2025-11-15T00:00:00.000Z'
languages: 'TypeScript, AI, Mongo, React'
description: "Led ClickStack's AI Notebooks from concept to launch: an agentic AI SRE tool combining AI investigation with manual analysis of logs, traces, and metrics. Presented it at ClickHouse's conference."
type: 'External'
status: 'Live'
isPinned: true
media:
  [
    {
      title: 'Picture of me presenting the product at the annual ClickHouse OpenHouse conference',
      url: '../../assets/projects/clickstack-notebooks/1.jpg',
      contentType: 'image/jpeg'
    },
    {
      title: 'Example of the AI Notebooks interface reaching a root cause for an issue',
      url: '../../assets/projects/clickstack-notebooks/0.png',
      contentType: 'image/png'
    },
    {
      title: 'Example of the AI Notebooks listing page showing multiple investigations',
      url: '../../assets/projects/clickstack-notebooks/2.png',
      contentType: 'image/png'
    }
  ]
link: 'https://clickhouse.com/docs/use-cases/observability/clickstack/notebooks'
color: '#4EFA7B'
gitUrl: 'https://github.com/hyperdxio/hyperdx'
---

## Project Overview

AI Notebooks are an interactive AI SRE investigation tool in ClickStack that combines an AI agent with manual analysis. You describe an issue in plain language, and the AI agent queries logs, traces, and metrics on your behalf, surfacing relevant data, charts, and summaries as a series of tiles. You can also add your own tiles - charts, tables, searches, and markdown notes - alongside the AI-generated output, so you end up with a complete record of the investigation.

This turns ClickStack into more of an agentic investigation tool, something that actually helps SREs and developers identify and resolve issues day to day instead of just displaying data.

I was given a high level concept for the product and led development on it. I worked closely with the product team to define the requirements and scope, and took the project from start to finish.

Some of the biggest challenges were designing an interface that could handle both AI-generated and user-generated content without feeling disjointed, and getting the AI agent to actually land on the correct root cause, which took a lot of work on the system prompt and the tools we gave it. I also had to make sure the product was scalable and performant, since it would be used by a large number of users across multiple teams.

This was also the first time we introduced AI into the core of ClickStack, so a good chunk of the work was researching AI techniques and figuring out how to integrate them into the existing architecture. We open sourced part of the feature as well, so I led that piece too, making sure it was documented and easy for other developers to pick up.

Lastly, I managed the rollout in our Cloud offering - wiring up the right AI providers (Anthropic, AWS Bedrock, etc), setting up feature flags for a gradual rollout, and making sure the product was properly monitored for performance and errors.

I also got to help announce the public launch at ClickHouse's annual conference, where I gave a demo and answered questions from attendees. [Watch the demo](https://youtu.be/HLrJEJrst0Q?si=n6mhpvUjhCtXy-Zm&t=191).
