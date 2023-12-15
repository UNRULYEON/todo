import express, { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import db from 'db';

const router: Router = express.Router();

router.get('/me', ClerkExpressRequireAuth(), async (req, res) => {
  let user = await db.user.findUnique({
    where: {
      id: req.auth.userId,
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        id: req.auth.userId,
      },
    });
  }

  const lanes = await db.lane.findMany({
    where: {
      userId: req.auth.userId,
    },
  });

  res.json({
    id: req.auth.userId,
    onboarded: user.onboarded,
    hasSeenOnboarding: user.hasSeenOnboarding,
    lanes: lanes.length,
  });
});

export default router;
