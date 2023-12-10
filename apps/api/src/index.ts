import express, { NextFunction, Request, Response } from 'express';

import { healthRouter, helloRouter } from './routes';

const app = express();

app.use((_, res, next) => {
  res.setHeader('x-powered-by', 'your mom :)');
  next();
});

app.use('/', helloRouter);
app.use('/', healthRouter);

app.listen(3000, () => console.log('🚀 Listening on http://localhost:3000'));
