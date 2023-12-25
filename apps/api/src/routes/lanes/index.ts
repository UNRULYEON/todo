import express, { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { z } from 'zod';
import db from 'db';
import { validate } from '../../middleware';

const router: Router = express.Router();

router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  const lanes = await db.lane.findMany({
    where: {
      userId: req.auth.userId,
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });

  return res.json(lanes);
});

router.get('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  const lane = await db.lane.findUnique({
    where: {
      id: req.params.id,
      userId: req.auth.userId,
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });

  return res.json(lane);
});

router.get('/:id/tasks', ClerkExpressRequireAuth(), async (req, res) => {
  const tasks = await db.task.findMany({
    where: {
      laneId: req.params.id,
      lane: {
        userId: req.auth.userId,
      },
    },
    select: {
      id: true,
      previousTaskId: true,
    },
  });

  return res.json(tasks);
});

const createLaneSchema = z.object({
  name: z.string(),
  color: z.string(),
});

router.post(
  '/',
  ClerkExpressRequireAuth(),
  validate(createLaneSchema),
  async (req, res) => {
    const newLane = await db.lane.create({
      data: {
        name: req.body.name,
        color: req.body.color,
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
    color: z.string(),
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
        userId: req.auth.userId,
      },
    });

    if (!existingLane) return res.sendStatus(404);

    const lane = await db.lane.update({
      where: {
        id: req.params.id,
        userId: req.auth.userId,
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
      userId: req.auth.userId,
    },
  });

  if (!existingLane) return res.sendStatus(404);

  await db.lane.delete({
    where: {
      id: req.params.id,
      userId: req.auth.userId,
    },
  });

  return res.sendStatus(200);
});

export default router;
