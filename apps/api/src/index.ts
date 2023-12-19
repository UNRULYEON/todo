import 'dotenv/config';
import express from 'express';

import { healthRouter, helloRouter, userRouter, laneRouter } from './routes';

const port = process.env.PORT || 3000;
const app = express();

app.enable('trust proxy');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((_, res, next) => {
  res.setHeader('x-powered-by', 'your mom :)');
  next();
});

app.use('/api/hello', helloRouter);
app.use('/api/health', healthRouter);
app.use('/api/user', userRouter);
app.use('/api/lanes', laneRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.sendStatus(401);
});

app.listen(port, () => console.log(`🚀 Listening on http://localhost:${port}`));
