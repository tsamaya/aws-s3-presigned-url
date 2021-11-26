require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

if (!process.env.S3_REGION)
  throw new Error('Missing environment variable `S3_REGION`');
if (!process.env.S3_ACCESS_KEY_ID)
  throw new Error('Missing environment variable `S3_ACCESS_KEY_ID`');
if (!process.env.S3_SECRET_ACCESS_KEY)
  throw new Error('Missing environment variable `S3_SECRET_ACCESS_KEY`');
if (!process.env.S3_BUCKET_NAME)
  throw new Error('Missing environment variable `S3_BUCKET_NAME`');

const s3 = new AWS.S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const app = express();
const port = 3001;

function generateId() {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!-.*()';
  const length = 10;

  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return `${date}_${result}`;
}

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/getputurl', async (req, res) => {
  console.info(`[getputurl] with key=${req.query.key}, type=${req.query.type}`);
  const presignedS3Url = s3.getSignedUrl('putObject', {
    Bucket: process.env.BUCKET_NAME,
    Key: req.query.key,
    // ContentType: 'application/octet-stream',
    ContentType: req.query.type,
    // ContentType: 'multipart/form-data',
    Expires: 300,
  });
  console.info(presignedS3Url);
  res.send({ url: presignedS3Url });
});

app.get('/getuploadurl', (req, res) => {
  console.info(
    `[getuploadurl] with key=${req.query.key}, type=${req.query.type}`
  );
  const fileType = req.query.type;
  const filePath = generateId();
  const params = {
    Bucket: process.env.BUCKET_NAME,
    // Fields: { key: filePath, acl: 'public-read' },
    Fields: { key: filePath, acl: 'private' },
    Conditions: [
      // content length restrictions: 0-1MB]
      ['content-length-range', 0, 1000000],
      // specify content-type to be more generic- images only
      // ['starts-with', '$Content-Type', 'image/'],
      ['eq', '$Content-Type', fileType],
    ],
    // number of seconds for which the presigned policy should be valid
    Expires: 15,
  };
  s3.createPresignedPost(params, (err, data) => {
    if (err) {
      console.error('Failed', err);
      res.status(500).send(err);
    }
    const result = data;
    // const result = { ...data, filePath };
    console.info(result);
    res.send(result);
  });
});

app.get('/geturl', (req, res) => {
  const presignedS3Url = s3.getSignedUrl('getObject', {
    Bucket: process.env.BUCKET_NAME,
    Key: req.query.key,
    Expires: req.query.expires || 2 * 24 * 60 * 60,
  });
  console.info(presignedS3Url);
  res.send({ url: presignedS3Url });
});

app.listen(port, () => {
  console.log(`Upload microservice listening at http://localhost:${port}`);
});
