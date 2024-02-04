import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import {
  S3Client,
  S3ClientConfig,
  GetObjectCommand,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';

export async function createDownloadURL(key: string) {
  const region = process.env.AWS_REGION || 'eu-west-1';
  const s3Configuration: S3ClientConfig = {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    region,
  };

  const getObjectParams: GetObjectCommandInput = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };
  const client = new S3Client(s3Configuration);
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: 60 * 10 });
  // console.log({ url });
  return { url };
}
