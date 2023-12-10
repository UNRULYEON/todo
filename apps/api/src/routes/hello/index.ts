import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/', (_, res) => res.send('world'));

export default router;
