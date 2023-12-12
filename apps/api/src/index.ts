import 'dotenv/config';
import express from 'express';

import { healthRouter, helloRouter, meRouter } from './routes';

const port = process.env.PORT || 3000;
const app = express();

app.use((_, res, next) => {
  res.setHeader('x-powered-by', 'your mom :)');
  next();
});

app.use('/hello', helloRouter);
app.use('/health', healthRouter);
app.use('/auth', meRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.sendStatus(401);
});

app.listen(port, () => console.log(`🚀 Listening on http://localhost:${port}`));
