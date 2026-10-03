import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../src/aws/clients.js';

const content = `
Jordan Lee has an upcoming annual review.

The account transfer from the client's previous institution is still pending.

Beneficiary information has not yet been provided.

The client previously asked for a clearer explanation of how the current portfolio is allocated.
`.trim();

const key = 'clients/demo-001/documents/client-notes.txt';

await s3.send(
  new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: content,
    ContentType: 'text/plain',
  }),
);

console.log(`Uploaded: ${key}`);