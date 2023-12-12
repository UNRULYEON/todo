import express, { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import db from 'db';

const router: Router = express.Router();

router.get('/me', ClerkExpressRequireAuth(), async (req, res) => {
  const lanes = await db.lane.findMany({
    where: {
      userId: req.auth.userId,
    },
  });

  res.json({
    id: req.auth.userId,
    lanes: lanes,
  });
});

export default router;
