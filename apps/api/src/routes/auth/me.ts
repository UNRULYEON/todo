import express, { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router: Router = express.Router();

router.get('/me', ClerkExpressRequireAuth(), (req, res) => {
  res.json(req.auth);
});

export default router;
