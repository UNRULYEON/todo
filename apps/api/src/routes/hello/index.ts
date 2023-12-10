import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/hello', (_, res) => res.send('world'));

export default router;
