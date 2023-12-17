import express, { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { z } from 'zod';
import db from 'db';
import { validate } from '../../middleware';

const router: Router = express.Router();

router.get('/', ClerkExpressRequireAuth(), (req, res) => {
  const lanes = db.lane.findMany({
    where: {
      userId: req.auth.userId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return res.json(lanes);
});

router.get('/:id', ClerkExpressRequireAuth(), (req, res) => {
  const lane = db.lane.findUnique({
    where: {
      id: req.params.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return res.json(lane);
});

const createLaneSchema = z.object({
  name: z.string(),
});

router.post(
  '/',
  ClerkExpressRequireAuth(),
  validate(createLaneSchema),
  async (req, res) => {
    const newLane = await db.lane.create({
      data: {
        name: req.body.name,
        user: {
          connect: {
            id: req.auth.userId,
          },
        },
      },
    });

    return res.json(newLane);
  }
);

const updateLaneSchema = z
  .object({
    name: z.string(),
  })
  .partial();

router.patch(
  '/:id',
  ClerkExpressRequireAuth(),
  validate(updateLaneSchema),
  async (req, res) => {
    const existingLane = await db.lane.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!existingLane) return res.sendStatus(404);

    const lane = await db.lane.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...existingLane,
        name: req.body.name,
        id: existingLane.id,
        userId: existingLane.userId,
      },
    });

    return res.json(lane);
  }
);

router.delete('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  const existingLane = await db.lane.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!existingLane) return res.sendStatus(404);

  await db.lane.delete({
    where: {
      id: req.params.id,
    },
  });

  return res.sendStatus(200);
});

export default router;
