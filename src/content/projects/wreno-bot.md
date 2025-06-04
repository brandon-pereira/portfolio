---
id: 'wreno-bot'
title: 'Wreno: Wylie Bot'
date: '2024-06-01T10:00:00.000Z'
languages: 'NodeJS, TypeScript, React, Postgres, Vector Database, Embeddings, OpenAI, ChatGPT'
description: "Developed Wylie, an AI bot for property managers, using NodeJS, TypeScript, React, and OpenAI's ChatGPT-4o. Improved response times from 2 minutes to 1-2 seconds with RAG and performance optimizations."
type: 'External'
isPinned: true
pinPriority: 'low'
status: 'Live'
media:
  [
    {
      title: 'App Home Screen',
      url: '../../assets/projects/wreno-bot/0.png',
      contentType: 'image/png'
    },
    {
      title: 'App Job Details Screen',
      url: '../../assets/projects/wreno-bot/1.png',
      contentType: 'image/png'
    }
  ]
link: 'https://vendorease.wreno.io/'
color: '#E0FE7F'
---

**Project Overview:**

At Wreno, we aimed to explore the potential of artificial intelligence by developing a bot to assist property managers with obtaining quotes for maintenance jobs and connecting them with suitable contractors. We named this bot Wylie.

**Technical Overview:**

Initially, we built Wylie using the OpenAI code interpreter. However, we quickly encountered limitations, particularly with handling complex conversations. The most significant issue was the response time, which averaged around 2 minutes.

To address this, we upgraded to Retrieval Augmented Generation (RAG). This significantly improved response times by eliminating the need to run Python scripts to read CSV files. Instead, we leveraged vector embeddings to identify the most relevant responses. After several iterations, we reduced the response time to about 3 seconds. Most of this time was attributed to OpenAI processing our requests, which was beyond our control.

Subsequently, OpenAI released a new model called ChatGPT-4o. We transitioned to this model due to its enhanced speed and accuracy. This upgrade further reduced the response time to an average of 1-2 seconds.

In addition to developing the backend and RAG systems, we built the interface for Wylie from scratch using React. The backend was constructed with NodeJS and TypeScript. We utilized Postgres and PGVector for our database, and OpenAI embeddings for creating embeddings of our data and the user's messages.

**Roles and Responsibilities:**

- **Backend Development:** Designed and implemented the backend infrastructure using NodeJS and TypeScript. Upgraded the initial system to use Retrieval Augmented Generation (RAG) for improved response times.
- **Database Management:** Managed the database using Postgres and PGVector, ensuring efficient storage and retrieval of vector embeddings.
- **AI Integration:** Integrated OpenAI models, transitioning from the initial code interpreter to the ChatGPT-4o model for enhanced performance.
- **Frontend Development:** Developed the user interface from scratch using React, ensuring a seamless and intuitive user experience.
- **Performance Optimization:** Conducted multiple iterations to optimize response times, achieving significant improvements from 2 minutes to 1-2 seconds.
- **System Architecture:** Designed a scalable architecture to handle complex conversations and large datasets efficiently.

Through this project, I gained valuable experience in AI integration, backend development, and performance optimization, all of which contributed to the successful launch of Wylie.
