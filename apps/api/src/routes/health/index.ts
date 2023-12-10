import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/health', (_, res) => res.status(200).send('OK'));

export default router;
