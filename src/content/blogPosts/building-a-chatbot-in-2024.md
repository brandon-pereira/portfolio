---
title: Building a Chatbot like it's 2024
datePosted: '2024-06-30T07:00:00.000Z'
---

Today I wanted to go over how to build a chatbot in 2024. Chatbot's have been around for a while now, but with the advancements in AI and machine learning, they are becoming more and more sophisticated.

## My previous experience building chatbots

I started building chatbots back in 2018. At the time, the technology was still in its infancy. I remember spending hours trying to get my chatbot to understand simple commands (called small talk back in the day).

My experience building chat bots was for three unique bots:

1. [Infiniti Speedbot](https://branclon.com/projects/infiniti-q60-speedbot/)
2. [Infiniti Idris](https://branclon.com/projects/infiniti-idris/)
3. [Urban Dictionary Chatbot](https://branclon.com/projects/urban-dictionary-bot/)

Since then, things have improved significantly. The tools and libraries available today make building chatbots much easier.

## Choosing a model & platform

The first thing you need to do when building a chatbot is to choose a model and platform. There are many different models and platforms available, each with its own strengths and weaknesses.

The most popular models for building chatbots are:

1. [OpenAI](https://openai.com/)
2. [Gemini](https://gemini.google.com/)
3. [Anthropic](https://www.anthropic.com/api)

Each of these models has its own strengths and weaknesses, so it's important to choose the one that best fits your needs.

**I recommend using OpenAI.** They have a great API that is easy to use and has a lot of features. On-top of the core model, they have a lot of tools to make building chat bots easier.

**For the rest of the article, I will be using OpenAI.**

## Glossary

There are a few concepts you need to understand when building a chatbot:

1. **User Input** - This is the text that the user sends to the chatbot.
2. **Model** - This is the AI model that processes the user input and generates a response.
3. **Streaming** - This is the process of sending the user input to the model and getting the response back in real time.
4. **Response** - This is the response that the chatbot sends back to the user. It can be text, images, or any other type of content.
5. **Context** - This is the information that the chatbot uses to generate the response. It can be the user's previous messages, the current conversation, or any other relevant information.
6. **Instructions** - This is the information that the chatbot uses to know how to respond. You can think of it like a message sent by the user before the conversation saying "Only talk in all caps" as an example.

## The architecture

Here's a high-level overview of the architecture:

1. **User sends a message** - The user sends a message to the chatbot.
2. **Backend receives the message** - The backend receives the message through a REST API endpoint.
3. **Backend sends the message to OpenAI** - The backend sends the message to the OpenAI API. We will expand on this in the next section.
4. **Backend processes OpenAI Stream** - The backend processes the OpenAI stream and passes the stream back to the user after formatting it.
5. **User receives the response** - The user receives the stream response from the chatbot.

## OpenAI Tools & Libraries

1. [**OpenAI API**](https://platform.openai.com/docs/overview) - This is the core API that you will use to interact with the OpenAI model.
2. [**OpenAI Assistants**](https://platform.openai.com/docs/assistants/overview) - This is a wrapper on-top of the model that provides some nice abstractions for things like thread management, context management, and more. It's technically in beta, but I've found it to be very useful.
3. [**OpenAI Embeddings**](https://platform.openai.com/docs/guides/embeddings) - This is a tool that takes in a piece of text and returns a vector representation of that text. This is useful for things like similarity checks, clustering, and more. See [the RAG section](#rag) for more information.

Some things I learned about OpenAI / OpenAI Assistants:

1. **OpenAI Assistant Files are Buggy** - There are tons of limitations with the files feature. A couple notable ones:

   - You can't upload files larger than 512MB.
   - You can't upload more than 20 files at a time across all assistants (or else it deletes the oldest one.. wtf?). This broke my production assistant once and I had to manually re-upload all the files.
   - You can't upload files with certain extensions ([see here for the list](https://platform.openai.com/docs/assistants/tools/file-search/vector-stores)).
   - If the file type is supported, it might not support retrieval on that file type. If it doesn't support retrieval, it will fall back on code interpreter. This will result in a significantly slower response time.

2. **OpenAI Code Interpreter is slow** - The OpenAI code interpreter can be very useful for processing files and performing actions on them. However, it is very slow. I recommend using it sparingly. Not only is it slow, but it also shows the limits of the current AI models. An example of this is if I asked the assistant to read the 2 provided files and stick them together, it would not do this in a logical way. It would read the files, but it would not understand the context of the files. This is a limitation of the current models.
3. **Streaming is the future** - Streaming is the process of sending the user input to the model and getting the response back in real time. This is the future of chatbots. It allows for a much more interactive experience and can be used for things like voice chat, video chat, and more.

## Retrieval Augmented Generation (RAG)

As discussed above, I tried very hard originally to **not use** a vector store. I wanted to build a system that (originally) used static data so building a vector store felt extra. However, I quickly realized that the existing limitations above would limit my success. I also soon needed to store information that was not static, which made it a no-brainer to use a vector store.

Models are trained on a point in time with limited data. This means that they don't know everything, especially not new information. Retrieval Augmented Generation (RAG) is a technique that combines the best of both worlds. It uses a vector store to store information and then uses a model to generate responses based on that information. This allows for much more flexible and powerful chatbots.

I upgraded to a system that used RAG. The system was as follows:

1. **Generating Embeddings** - I generated embeddings for each piece of information that I wanted to store.
2. **Storing Embeddings** - I stored the embeddings in a vector database.
3. **Create a Assistant Function** - I created a function in the assistant that essentially said "When the user asks for this information, call this function with a parameter that is the users query (simplified").
4. **Handle the function request** - When called, it would receive the query, generate the embeddings for the query, and then search the vector database for the most similar embeddings. It would then return the information associated with those embeddings.

The hardest part of this system is definitely the initial seeding (if the dataset is very large) as well as the retrieval performance. I found that the retrieval performance was not as good as I would have liked.

## Building a UI

We originally built the logic for our chatbot using [Vercel's AI SDK](https://sdk.vercel.ai/docs/introduction). This allowed us to quickly build the chatbot and test it out.

However, we quickly realized that we needed more control over the UI. We decided to build our own UI and logic, but we heavily leveraged the way that the Vercel AI streams the responses and the hook architecture of the [useAssistant](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-assistant) hook.

## Conclusion

Building a chatbot in 2024 is much easier than it was in 2018. The tools and libraries available today make building chatbots much easier. I hope this article has given you a good overview of how to build a chatbot in 2024. If you have any questions, feel free to reach out to me!
