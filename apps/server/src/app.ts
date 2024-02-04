import Fastify from 'fastify';
// import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import pino from 'pino';

// import { Server, IncomingMessage, ServerResponse } from 'http';

import dotenv from 'dotenv';
import {
  createDownloadURL,
  createPOSTSignedURL,
  createPUTSignedURL,
} from './s3';
dotenv.config(); // Load environment variables from .env file

const app = Fastify({
  logger: pino({ level: 'info' }),
});

app.register(cors);

// const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
//   Fastify({});

app.get('/', async (request, reply) => {
  return 'Server';
});

app.get('/ping', async (request, reply) => {
  return { pong: 'it worked!' };
});

app.get('/uploadPUT', async (request, reply) => {
  // @ts-ignore ts(18046)
  const { filename, filetype } = request?.query;
  if (!filename) {
    return reply.status(400).send({ error: 'Missing filename' });
  }
  if (!filetype) {
    return reply.status(400).send({ error: 'Missing filetype' });
  }
  const result = await createPUTSignedURL({ filename, filetype });
  return result;
});

app.get('/uploadPOST', async (request, reply) => {
  // @ts-ignore ts(18046)
  const { filename, filetype } = request?.query;
  if (!filename) {
    return reply.status(400).send({ error: 'Missing filename' });
  }
  if (!filetype) {
    return reply.status(400).send({ error: 'Missing filetype' });
  }
  const result = await createPOSTSignedURL({ filename, filetype });
  return result;
});

app.get('/download', async (request, reply) => {
  // @ts-ignore ts(18046)
  const { key } = request?.query;
  if (!key) {
    return reply.status(400).send({ error: 'Missing key' });
  }
  const result = await createDownloadURL(key);
  return result;
});

export default app;
