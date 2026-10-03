import { ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrock } from '../src/aws/clients.js';

const response = await bedrock.send(
  new ConverseCommand({
    modelId: process.env.BEDROCK_MODEL_ID,
    messages: [
      {
        role: 'user',
        content: [
          {
            text: 'Reply with exactly: Bedrock is working',
          },
        ],
      },
    ],
    inferenceConfig: {
      maxTokens: 50,
    },
  }),
);

console.log(response.output.message.content[0].text);