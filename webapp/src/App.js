import React, { useState } from 'react';

import './App.css';
import axios from 'axios';
import FileUpload from './FileUpload';

const App = () => {
  const [error, setError] = useState({});
  const [status, setStatus] = useState({});

  const handleReset = () => {
    setError({});
    setStatus({});
  };

  const handleSubmitforPUT = async ({ file }) => {
    handleReset();
    console.log(file);
    let reader = new FileReader();
    reader.onload = async (e) => {
      console.log('length: ', e.target.result.includes('data:image/jpeg'));
      const image = e.target.result;
      let binary = atob(image.split(',')[1]);
      let array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      let blobData = new Blob([new Uint8Array(array)], { type: file.type });

      try {
        console.log('--s3.getSignedUrl putObject');
        const { data: presignedPutUrl } = await axios.get(
          `http://localhost:3001/getputurl?key=${file.name}&type=${file.type}`
        );
        console.log('data: ', presignedPutUrl);
        console.log('URL', presignedPutUrl.url);
        // console.log('--axios.put');
        // const axiosResponse = await axios.put(presignedPutUrl.url, blobData, {
        //   headers: {
        //     'Content-Type': file.type,
        //   },
        // });
        // console.info(axiosResponse.status);
        // console.info(axiosResponse.statusText);
        // setStatus(axiosResponse);
        console.log('--fetch.put');
        const result = await fetch(presignedPutUrl.url, {
          method: 'PUT',
          body: blobData,
        });
        setStatus(result);
      } catch (error) {
        setError(error);
        console.error(error);
      }
    };
    reader.readAsDataURL(file);
  };
  const handleSubmitfoPOST = async ({ file }) => {
    handleReset();
    console.log(file);

    try {
      const { data: presignedPostUrl } = await axios.get(
        `http://localhost:3001/getuploadurl?key=${file.name}&type=${file.type}`
      );
      console.log(presignedPostUrl);
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
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Using PUT</h1>
      <FileUpload onSubmit={handleSubmitforPUT} reset={handleReset} />
      <hr />
      <h1>Using POST</h1>
      <FileUpload onSubmit={handleSubmitfoPOST} reset={handleReset} />
      <hr />
      {status && status.status && (
        <div>
          <h1 style={{ color: 'green' }}>Response</h1>
          <h4>Status: {status.status}</h4>
          <h4>StatusText: {status.statusText}</h4>
        </div>
      )}
      {error && error.message && (
        <div>
          <h1 style={{ color: 'red' }}>Error</h1>
          <h4>Message: {error.message}</h4>
        </div>
      )}
    </div>
  );
};

export default App;
