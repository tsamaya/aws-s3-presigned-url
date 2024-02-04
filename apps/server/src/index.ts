import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import app from './app';
// import cors from '@fastify/cors';

const port = Number(process.env.PORT || 3001);

const start = async () => {
  try {
    // await app.register(cors, {
    //   origin: /\*/,
    //   methods: ['GET', 'PUT', 'POST'],
    // });

    await app.listen({ port });

    console.log(`Server started successfully http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
process.on('uncaughtException', (error) => {
  console.error(error);
});
process.on('unhandledRejection', (error) => {
  console.error(error);
});

start();
