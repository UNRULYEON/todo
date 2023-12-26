import express, { Router } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { z } from 'zod';
import db from 'db';
import { validate } from '../../middleware';

const router: Router = express.Router();

router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  const tasks = await db.task.findMany({
    where: {
      lane: {
        userId: req.auth.userId,
      },
    },
  });

  return res.json(tasks);
});

router.get('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  const task = await db.task.findUnique({
    where: {
      id: req.params.id,
      lane: {
        userId: req.auth.userId,
      },
    },
  });

  if (!task) return res.sendStatus(404);

  return res.json(task);
});

const createTaskSchema = z.object({
  laneId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  previousTaskId: z.string(),
});

router.post(
  '/',
  ClerkExpressRequireAuth(),
  validate(createTaskSchema),
  async (req, res) => {
    const newTask = await db.task.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        lane: {
          connect: {
            id: req.body.laneId,
            userId: req.auth.userId,
          },
        },
      },
    });

    return res.json(newTask);
  }
);

const updateTaskSchema = z.object({
  laneId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

router.patch(
  '/:id',
  ClerkExpressRequireAuth(),
  validate(updateTaskSchema),
  async (req, res) => {
    const subject = await db.task.findUnique({
      where: {
        id: req.params.id,
        lane: {
          userId: req.auth.userId,
        },
      },
    });

    if (!subject) return res.sendStatus(404);

    return res.sendStatus(200);
  }
);

const reorderTaskSchema = z.object({
  targetLaneId: z.string(),
  previousNodeId: z.string().nullable(),
});

router.post(
  '/:id/reorder',
  ClerkExpressRequireAuth(),
  validate(reorderTaskSchema),
  async (req, res) => {
    const node = await db.task.findUnique({
      where: {
        id: req.params.id,
        lane: {
          userId: req.auth.userId,
        },
      },
    });

    if (!node) return res.sendStatus(404);

    const previousNode = node.previousTaskId
      ? await db.task.findUnique({
          where: {
            id: node.previousTaskId,
            lane: {
              userId: req.auth.userId,
            },
          },
        })
      : null;

    const nextNode = await db.task.findUnique({
      where: {
        previousTaskId: node.id,
        lane: {
          userId: req.auth.userId,
        },
      },
    });

    // Get target node
    const targetNode = req.body.previousNodeId
      ? await db.task.findUnique({
          where: {
            id: req.body.previousNodeId,
            lane: {
              id: req.body.targetLaneId,
              userId: req.auth.userId,
            },
          },
        })
      : null;

    // Get targets next node
    const targetNextNode = targetNode
      ? await db.task.findUnique({
          where: {
            previousTaskId: targetNode.id,
            lane: {
              id: req.body.targetLaneId,
              userId: req.auth.userId,
            },
          },
        })
      : null;

    await db.$transaction(async (tx) => {
      console.log('');

      // Get current head node
      const currentHeadNode = await db.task.findFirst({
        where: {
          previousTaskId: null,
          lane: {
            id: req.body.targetLaneId,
            userId: req.auth.userId,
          },
        },
      });

      // Unlink node from previous node if it exists
      if (previousNode !== null) {
        await tx.task.update({
          where: {
            id: node.id,
          },
          data: {
            previousTaskId: null,
          },
        });

        console.log(`Unlinked ${previousNode.id} from ${node.id}`);
      }

      // Unlink next node from node if it exists
      if (nextNode !== null) {
        await tx.task.update({
          where: {
            id: nextNode.id,
          },
          data: {
            previousTaskId: null,
          },
        });

        console.log(`Unlinked ${node.id} from ${nextNode.id}`);
      }

      // Link previous node with next node if they both exist
      if (previousNode !== null && nextNode !== null) {
        await tx.task.update({
          where: {
            id: nextNode.id,
          },
          data: {
            previousTaskId: previousNode.id,
          },
        });

        console.log(`Linked ${previousNode.id} -> ${nextNode.id}`);
      }

      // Set laneId of node to target lane if it's different
      if (node.laneId !== req.body.targetLaneId) {
        await tx.task.update({
          where: {
            id: node.id,
          },
          data: {
            laneId: req.body.targetLaneId,
          },
        });

        console.log(`Moved ${node.id} to ${req.body.targetLaneId}`);
      }

      // Link current head node with node if it exists and previousNodeId is null
      if (currentHeadNode !== null && req.body.previousNodeId === null) {
        await tx.task.update({
          where: {
            id: currentHeadNode.id,
          },
          data: {
            previousTaskId: node.id,
          },
        });

        console.log(`Linked ${currentHeadNode.id} -> ${node.id}`);

        return;
      }

      // Unlink targets next node from target node if it exists
      if (targetNextNode !== null) {
        await tx.task.update({
          where: {
            id: targetNextNode.id,
          },
          data: {
            previousTaskId: null,
          },
        });

        console.log(`Unlinked ${targetNode.id} from ${targetNextNode.id}`);
      }

      // Link node with target node if it exists
      if (targetNode !== null) {
        await tx.task.update({
          where: {
            id: node.id,
          },
          data: {
            previousTaskId: targetNode.id,
          },
        });

        console.log(`Linked ${targetNode.id} -> ${node.id}`);
      }

      // Link targets next node with node if it exists
      if (targetNextNode !== null) {
        await tx.task.update({
          where: {
            id: targetNextNode.id,
          },
          data: {
            previousTaskId: node.id,
          },
        });

        console.log(`Linked ${node.id} -> ${targetNextNode.id}`);
      }
    });

    return res.sendStatus(200);
  }
);

router.delete('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  const existingTask = db.task.delete({
    where: {
      id: req.params.id,
      lane: {
        userId: req.auth.userId,
      },
    },
  });

  if (!existingTask) return res.sendStatus(404);

  await db.task.delete({
    where: {
      id: req.params.id,
      lane: {
        userId: req.auth.userId,
      },
    },
  });

  return res.sendStatus(204);
});

export default router;
