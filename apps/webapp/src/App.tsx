// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState } from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';

import './App.css';

function App() {
  const [error, setError] = useState({});
  const [status, setStatus] = useState({});
  const [url, setUrl] = useState({});

  const handleReset = () => {
    setError({});
    setStatus({});
    setUrl({});
  };

  const handleSubmitforPUT = async ({ file }) => {
    handleReset();
    console.log(`Selected file ${file}`);
    const reader = new FileReader();
    reader.onload = async (e) => {
      console.log('--reader.onLoad()');
      const image = e.target.result;
      const binary = atob(image.split(',')[1]);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blobData = new Blob([new Uint8Array(array)], { type: file.type });

      try {
        console.log('--s3.getSignedUrl putObject');
        const { data: presignedPutUrl } = await axios.get(
          `http://localhost:3001/uploadPUT?filename=${file.name}&filetype=${file.type}`
        );
        console.log('data: ', presignedPutUrl);
        console.log('URL', presignedPutUrl.url);

        console.log('--fetch.put');
        const result = await fetch(presignedPutUrl.url, {
          method: 'PUT',
          body: blobData,
        });
        setStatus(result);

        console.log('--s3.getSignedUrl getObject');
        const { data: downloadURL } = await axios.get(
          `http://localhost:3001/download?key=${file.name}`
        );
        console.log(`URL to Download file ${downloadURL.url}`);
        setUrl(downloadURL);
      } catch (error) {
        setError(error);
        console.error(error);
      }
    };
    reader.readAsDataURL(file);
  };
  const handleSubmitfoPOST = async ({ file }) => {
    handleReset();
    console.log(`Selected file ${file}`);

    try {
      console.log('--s3.createPresignedPost');
      const { data: presignedPostUrl } = await axios.get(
        `http://localhost:3001/uploadPOST?filename=${file.name}&filetype=${file.type}`
      );
      console.log('data: ', presignedPostUrl);
      console.log('URL', presignedPostUrl.url);

      const key = presignedPostUrl.fields?.key;

      const formData = new FormData();
      formData.append('Content-Type', file.type);
      Object.entries(presignedPostUrl.fields).forEach(([k, v]) => {
        formData.append(k, v);
      });
      formData.append('file', file); // The file has be the last element

      const response = await axios.post(presignedPostUrl.url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.info(response.status);
      console.info(response.statusText);
      setStatus(response);
      console.log('--fetch.getUrl');
      const { data: downloadURL } = await axios.get(
        `http://localhost:3001/download?key=${key}`
      );
      console.log(`URL to Download file ${downloadURL.url}`);
      setUrl(downloadURL);
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Upload file to S3</h1>
      <h2>Using PUT</h2>
      <FileUpload onSubmit={handleSubmitforPUT} reset={handleReset} />
      <hr />
      <h2>Using POST</h2>
      <FileUpload onSubmit={handleSubmitfoPOST} reset={handleReset} />
      <hr />
      {status && status.status && (
        <div>
          <h2 style={{ color: 'green' }}>Response</h2>
          <h4>Status: {status.status}</h4>
          <h4>StatusText: {status.statusText}</h4>
        </div>
      )}
      {url && url.url && (
        <div>
          <a href={url.url}>{url.url}</a>
        </div>
      )}
      {error && error.message && (
        <div>
          <h2 style={{ color: 'red' }}>Error</h2>
          <h4>Message: {error.message}</h4>
        </div>
      )}
    </div>
  );
}

export default App;
