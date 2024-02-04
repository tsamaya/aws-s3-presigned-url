import { describe, expect, test, afterAll, beforeAll } from 'vitest';
import { createDownloadURL } from './signedDownloadURL';

describe('signedDownloadURL', async () => {
  let accessKeyId: string | undefined = '';
  let secretAccessKey: string | undefined = '';
  let bucket: string | undefined = '';

  beforeAll(async () => {
    accessKeyId = process.env.S3_ACCESS_KEY_ID;
    secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    bucket = process.env.S3_BUCKET_NAME;

    process.env.S3_ACCESS_KEY_ID = '123';
    process.env.S3_SECRET_ACCESS_KEY = '123';
    process.env.S3_BUCKET_NAME = 'bucket';
  });

  afterAll(async () => {
    process.env.S3_ACCESS_KEY_ID = accessKeyId;
    process.env.S3_SECRET_ACCESS_KEY = secretAccessKey;
    process.env.S3_BUCKET_NAME = bucket;
  });

  test('Creates a Download URL from S3', async () => {
    const result = await createDownloadURL('Eureka1.jpg');
    expect(result).toBeDefined();
    expect(result.url).toBeDefined();
  });
});
