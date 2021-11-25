require('dotenv').config();
const axios = require('axios');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  // region: 'eu-west-1', // Put your aws region here
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const fs = require('fs');
const readFile = require('util').promisify(fs.readFile);

const run = async () => {
  const filename = 'Eureka1.png';
  try {
    console.log('--s3.getSignedUrl putObject');
    const putPresignedS3Url = s3.getSignedUrl('putObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      ContentType: 'application/octet-stream',
      Expires: 300,
    });
    console.log('URL for PUT is', putPresignedS3Url);

    // reads the file
    const file = await readFile(filename);

    // PUT
    console.log('--axios.put');
    const axiosResponse = await axios.put(putPresignedS3Url, file, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
    console.info(axiosResponse.status, axiosResponse.statusText);
    console.info(axiosResponse);

    // Get back
    console.log('--s3.getSignedUrl getObject');
    const getPresignedS3Url = s3.getSignedUrl('getObject', {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Expires: 24 * 60 * 60,
    });
    console.log('URL for GET is', getPresignedS3Url);
  } catch (e) {
    if (e.response) {
      console.error(e.response.status);
      console.error(e.response.statusText);
      return;
    }
    console.error(e);
  }
};

run();
