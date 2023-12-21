import express, { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { z } from 'zod';
import db from 'db';
import { validate } from '../../middleware';

const router: Router = express.Router();

router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
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

const updateUserSchema = z
  .object({
    onboarded: z.boolean(),
    hasSeenOnboarding: z.boolean(),
  })
  .partial();

router.patch(
  '',
  ClerkExpressRequireAuth(),
  validate(updateUserSchema),
  async (req, res) => {
    const existingUser = await db.user.findUnique({
      where: {
        id: req.auth.userId,
      },
    });

    if (!existingUser) {
      return res.sendStatus(404);
    }

    const user = await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        ...existingUser,
        ...req.body,
      },
    });

    res.json({
      id: req.auth.userId,
      onboarded: user.onboarded,
      hasSeenOnboarding: user.hasSeenOnboarding,
    });
  }
);

router.get('/reset', ClerkExpressRequireAuth(), async (req, res) => {
  await db.lane.deleteMany({
    where: {
      userId: req.auth.userId,
    },
  });

  await db.user.update({
    where: {
      id: req.auth.userId,
    },
    data: {
      onboarded: false,
      hasSeenOnboarding: false,
    },
  });

  res.sendStatus(200);
});

router.get('/delete', ClerkExpressRequireAuth(), async (req, res) => {
  await db.user.delete({
    where: {
      id: req.auth.userId,
    },
  });

  res.sendStatus(200);
});

export default router;
