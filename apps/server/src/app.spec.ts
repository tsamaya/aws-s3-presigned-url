import { afterAll, describe, expect, test } from 'vitest';
import supertest from 'supertest';
import app from './app';

describe('app', async () => {
  afterAll(async () => {
    await app.close();
  });

  test('server root', async () => {
    await app.ready();
    const response = await supertest(app.server).get('/').expect(200);
    //   console.log(JSON.stringify(response));
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    expect(response.text).toEqual('Server');
  });

  test('server ping', async () => {
    await app.ready();
    const response = await supertest(app.server).get('/ping').expect(200);
    // console.log(JSON.stringify(response));
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    expect(JSON.parse(response.text)).toEqual({ pong: 'it worked!' });
  });

  test('missing param filename on /download', async () => {
    await app.ready();
    const error = { error: 'Missing key' };
    const response = await supertest(app.server).get('/download').expect(400);
    // console.log(JSON.stringify(response));
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    expect(JSON.parse(response.text)).toEqual(error);
  });

  test('missing param filename on /uploadPUT', async () => {
    await app.ready();
    const error = { error: 'Missing filename' };
    const response = await supertest(app.server).get('/uploadPUT').expect(400);
    // console.log(JSON.stringify(response));
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    expect(JSON.parse(response.text)).toEqual(error);
  });
  test('missing param filetype on /uploadPUT', async () => {
    await app.ready();
    const error = { error: 'Missing filetype' };
    const response = await supertest(app.server)
      .get('/uploadPUT?filename=Eureka1.jpg')
      .expect(400);
    // console.log(JSON.stringify(response));
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    expect(JSON.parse(response.text)).toEqual(error);
  });
  test('missing param filename on /uploadPOST', async () => {
    await app.ready();
    const error = { error: 'Missing filename' };
    const response = await supertest(app.server).get('/uploadPOST').expect(400);
    // console.log(JSON.stringify(response));
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    expect(JSON.parse(response.text)).toEqual(error);
  });
  test('missing param filetype on /uploadPOST', async () => {
    await app.ready();
    const error = { error: 'Missing filetype' };
    const response = await supertest(app.server)
      .get('/uploadPOST?filename=Eureka1.jpg')
      .expect(400);
    // console.log(JSON.stringify(response));
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    expect(JSON.parse(response.text)).toEqual(error);
  });

  test('sunny on /uploadPUT', async () => {
    await app.ready();
    const response = await supertest(app.server)
      .get('/uploadPUT?filename=Eureka1.jpg&filetype=image/jpeg')
      .expect(200);
    // console.log(JSON.stringify(response));
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    const result = JSON.parse(response.text);
    expect(result).toBeDefined();
    expect(result.url).toBeDefined();
  });

  test('sunny on /uploadPOST', async () => {
    await app.ready();
    const response = await supertest(app.server)
      .get('/uploadPOST?filename=Eureka1.jpg&filetype=image/jpeg')
      .expect(200);
    // console.log(JSON.stringify(response));
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    const result = JSON.parse(response.text);
    expect(result).toBeDefined();
    expect(result.url).toBeDefined();
  });

  test('sunny on /download', async () => {
    await app.ready();
    const response = await supertest(app.server)
      .get('/download?key=Eureka1.jpg')
      .expect(200);
    // console.log(JSON.stringify(response));
    expect(response).toBeDefined();
    expect(response.text).toBeDefined();
    const result = JSON.parse(response.text);
    expect(result).toBeDefined();
    expect(result.url).toBeDefined();
  });
});
