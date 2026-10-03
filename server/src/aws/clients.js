import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { S3Client } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION ?? 'us-east-1';

export const bedrock = new BedrockRuntimeClient({ region });
export const s3 = new S3Client({ region });