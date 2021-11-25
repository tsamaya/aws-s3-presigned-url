const axios = require('axios');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({});

const fs = require('fs');
const readFile = require('util').promisify(fs.readFile);

const run = async () => {
  const filename = 'idea1.jpg';
  const params = {
    Bucket: 'test-upload-v663vr6',
    Fields: {
      key: filename,
    },
    Expires: 3600,
    Conditions: [
      ['content-length-range', 0, 10000000], // 10 Mb
      { acl: 'public-read' },
    ],
  };
  s3.createPresignedPost(params, async (err, data) => {
    console.log(JSON.stringify(data, null, 2));
    // data.method = 'POST';
    try {
      const file = await readFile(filename);
      data.data = file;

      const axiosResponse = await axios.post(
        {
          ...data,
          data: file,
        }
        // {
        //   headers: {
        //     'Content-Type': 'application/octet-stream',
        //   },
        // }
      );
      console.log(axiosResponse);
      console.info(axiosResponse.status);
      console.info(axiosResponse.statusText);
    } catch (e) {
      console.log(e);
      console.error(e.response.status);
      console.error(e.response.statusText);
    }
  });
};

run();
