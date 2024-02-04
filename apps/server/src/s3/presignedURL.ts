import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';

export async function createPUTSignedURL({
  filename,
  filetype,
}: {
  filename: string;
  filetype: string;
}) {
  const region = process.env.AWS_REGION || 'eu-west-1';
  const s3Configuration: S3ClientConfig = {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    region,
  };

  const putObjectParams: PutObjectCommandInput = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    ContentType: filetype,
  };
  const client = new S3Client(s3Configuration);
  const command = new PutObjectCommand(putObjectParams);
  const url = await getSignedUrl(client, command, { expiresIn: 60 * 10 });
  // console.log({ url });
  return { url };
}

export async function createPOSTSignedURL({
  filename,
  filetype,
}: {
  filename: string;
  filetype: string;
}) {
  const region = process.env.AWS_REGION || 'eu-west-1';
  const s3Configuration: S3ClientConfig = {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    region,
  };

  const client = new S3Client(s3Configuration);

  const Bucket = process.env.S3_BUCKET_NAME || '';
  const Key = filename;
  const Fields = {
    acl: 'private',
  };

  const { url, fields } = await createPresignedPost(client, {
    Bucket,
    Key,
    Conditions: [['eq', '$Content-Type', filetype]],
    Fields,
    Expires: 60 * 10, //Seconds before the presigned post expires. 3600 by default.
  });
  console.log({ url, fields });
  return { url, fields };
}
