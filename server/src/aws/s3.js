import {
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

import { s3 } from './clients.js';

const ALLOWED_EXTENSIONS = ['.txt', '.md', '.json'];

export async function getClientDocumentContext(clientId) {
  const bucket = process.env.AWS_S3_BUCKET;

  if (!bucket) {
    return [];
  }

  const prefix = `clients/${clientId}/documents/`;

  const listed = await s3.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: 5,
    }),
  );

  const objects = (listed.Contents ?? []).filter((object) =>
    ALLOWED_EXTENSIONS.some((extension) =>
      object.Key?.toLowerCase().endsWith(extension),
    ),
  );

  const documents = [];

  for (const object of objects) {
    if (!object.Key) continue;

    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: object.Key,
      }),
    );

    const text = await response.Body.transformToString();

    documents.push({
      source: object.Key,
      content: text.slice(0, 8000),
    });
  }

  return documents;
}