---
title: Sprinkling AI in your Projects as a Developer
datePosted: '2024-12-20T00:00:00.000Z'
---

This post is a quick recap of how you can easily leverage AI in your application. I have been using this for a while now and it has been very helpful. I hope you find it useful too.

The core idea is to **sprinkle AI in places where it can help the user**. I call this the "progressive enhancement" of AI. You can use AI to generate additional details from a simple input. This can be very helpful in generating content, generating ideas, or doing any other task that requires creativity.

## The Setup

To get started, you will need an API key from [OpenAI](https://openai.com). You will also need a library that can help you interact with the API. I use the [openai](https://www.npmjs.com/package/openai) library for this. You will also need a library to validate the output. I use [zod](https://www.npmjs.com/package/zod) for this.

```bash
npm install openai zod
```

## Example Usage

Let's say you want to take a user's to-do task title and generate some additional details.

```typescript
import { z } from 'zod';
// Keep reading to see the implementation of this method
import getStructuredOutput from './getStructuredOutput.js';

const systemMessage =
  'Generate additional details for the todo task. The user will provide you with what they want to do, and your job is to enrich the todo task with more context, subtasks, and an emoji.';

const schema = z.object({
  title: z.string(),
  description: z.string(),
  subtasks: z
    .array(z.string())
    .optional()
    .describe(
      'List of subtasks to complete the main task. Keep it limited to 3-5 subtasks.'
    ),
  emoji: z.string().describe('Emoji which best represents the task.')
});

const result = await getStructuredOutput({
  schema,
  systemMessage,
  input: 'Write a blog post'
});

console.log(result);
/**
{
  title: 'Write a Blog Post',
  description: 'Craft an engaging and informative blog post that captivates your audience and effectively communicates your message. This task involves brainstorming ideas, conducting research, drafting, editing, and finally publishing the post on your chosen platform.',
  subtasks: [
    'Brainstorm and outline the main ideas and structure of the blog post.',
    'Conduct research to gather relevant information and data to support your points.',
    'Write the first draft, focusing on clarity and flow of ideas.',
    'Edit and proofread the draft to ensure it is free of grammatical errors and typos.',
    'Publish the blog post on your platform and promote it through social media channels.'
  ],
  emoji: '📝'
}
 */
const result2 = await getStructuredOutput({
  schema,
  systemMessage,
  input: 'Remember to get the wife flowers for her birthday'
});

console.log(result2);
/**
{
  title: 'Buy Birthday Flowers for Wife',
  description: "Make your wife's birthday extra special by surprising her with a beautiful bouquet of her favorite flowers. This thoughtful gesture will show her how much you care and appreciate her.",
  subtasks: [
    'Research her favorite flowers and colors to ensure you choose the perfect bouquet.',
    'Visit a local florist or order online to find a fresh and beautiful arrangement.',
    'Consider adding a personalized note or card to accompany the flowers.',
    'Plan the timing of the delivery or pick-up to ensure she receives them on her birthday.',
    'Arrange a special spot at home to display the flowers, enhancing the surprise.'
  ],
  emoji: '💐'
}
 */
```

## The Implementation

The implementation is simple. I use a method that takes a system message and an input message, and returns a [structured output](https://platform.openai.com/docs/guides/structured-outputs). OpenAI has a helper which takes a Zod schema and converts it to the format that OpenAI expects.

The core method is shown below. This method uses OpenAI's API to generate the structured output. The method takes a system message, an input message, and a JSON schema. The schema defines the format of the response. The method then returns the structured output.

```typescript
import { ZodType } from 'zod';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

interface Args<Schema extends ZodType> {
  systemMessage: string;
  input: string;
  schema: Schema;
}

export default async function getStructuredOutput<Schema extends ZodType>({
  systemMessage,
  input,
  schema
}: Args<Schema>) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: systemMessage
      },
      { role: 'user', content: input }
    ],
    response_format: zodResponseFormat(schema, 'response')
  });
  const result = response.choices[0].message.parsed;
  if (!result) {
    if (!result) {
      throw new Error('Failed to generate structured output');
    }
  }
  return result;
}
```

## Considerations

- **Cost**: Be mindful of the cost. OpenAI charges per request, so make sure you are aware of the costs.
- **Model**: The model used in the example is `gpt-4o`. You can use other models as well, but make sure you are aware of the capabilities and limitations of the model. The main ones to consider are the speed, quality, and cost.
- **Error Handling**: The method does not handle errors well. I typically try to call OpenAI, and if it fails, I retry several times before giving up. The OpenAI response is usually optional (a progressive enhancement), so if it fails, I can still show the user the original input.
- **Large Inputs**: In the above example, reaching the token limit is unlikely. However, if you are dealing with large inputs, you may need to split the input into smaller chunks or ensure you're only sending the necessary information.
- **An Introduction to Prompt Engineering**: The system message is a key part of the prompt. You can experiment with different system messages to see how it affects the output, this is a whole field called prompt engineering, and it can be tricky to get right.

## Conclusion

I hope you can see just how easy it is to use AI as a developer. The implementation is simple, and the benefits are great. I have been using this in my projects, and it has been very helpful!
