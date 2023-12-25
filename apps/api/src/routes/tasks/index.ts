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
  targetTaskId: z.string().nullable(),
  position: z.string().refine(
    (value) => value === 'before' || value === 'after',
    (_) => ({ message: 'Position must be either before or after' })
  ),
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

    const targetNode = await db.task.findUnique({
      where: {
        id: req.body.targetTaskId,
        lane: {
          id: node.laneId,
          userId: req.auth.userId,
        },
      },
    });

    const targetPreviousNode = targetNode.previousTaskId
      ? await db.task.findUnique({
          where: {
            id: targetNode.previousTaskId,
            lane: {
              userId: req.auth.userId,
            },
          },
        })
      : null;

    const targetNextNode = await db.task.findUnique({
      where: {
        previousTaskId: targetNode.id,
        lane: {
          userId: req.auth.userId,
        },
      },
    });

    console.log(``);

    await db.$transaction(async (tx) => {
      // Unlink node from previous node
      if (previousNode !== null) {
        await tx.task.update({
          where: {
            id: node.id,
          },
          data: {
            previousTaskId: null,
          },
        });

        console.log(`Unlinked ${node.id} from ${previousNode.id}`);
      }

      // Unlink next node from node
      if (nextNode !== null) {
        await tx.task.update({
          where: {
            id: nextNode.id,
          },
          data: {
            previousTaskId: null,
          },
        });

        console.log(`Unlinked ${nextNode.id} from ${node.id}`);
      }

      // Link previous node with next node
      if (previousNode !== null && nextNode !== null) {
        await tx.task.update({
          where: {
            id: nextNode.id,
          },
          data: {
            previousTaskId: previousNode.id,
          },
        });

        console.log(`Linked ${nextNode.id} -> ${previousNode.id}`);
      }

      if (targetNextNode === null) {
        // Set node as tail
        await tx.task.update({
          where: {
            id: node.id,
          },
          data: {
            previousTaskId: targetNode.id,
          },
        });

        console.log(`Set ${node.id} as tail`);
      } else if (targetPreviousNode === null) {
        // Set node as head
        await tx.task.update({
          where: {
            id: node.id,
          },
          data: {
            previousTaskId: null,
          },
        });

        await tx.task.update({
          where: {
            id: targetNode.id,
          },
          data: {
            previousTaskId: node.id,
          },
        });

        console.log(`Set ${node.id} as head`);
      } else if (node.id === targetNode.previousTaskId) {
        console.log(`Switching ${node.id} -> ${targetNode.id}`);

        // Link node with target's next node
        await tx.task.update({
          where: {
            id: targetNextNode.id,
          },
          data: {
            previousTaskId: node.id,
          },
        });

        console.log(`Linked ${targetNextNode.id} -> ${node.id}`);

        // Set target as previous node of node
        await tx.task.update({
          where: {
            id: node.id,
          },
          data: {
            previousTaskId: targetNode.id,
          },
        });

        console.log(`Linked ${node.id} -> ${targetNode.id}`);
      } else if (targetNode.id === node.previousTaskId) {
        console.log(`Switching ${node.id} -> ${targetNode.id}`);

        // Set node as previous node of target
        await tx.task.update({
          where: {
            id: targetNode.id,
          },
          data: {
            previousTaskId: node.id,
          },
        });

        console.log(`Linked ${targetNode.id} -> ${node.id}`);

        // Link target's previous node with node
        await tx.task.update({
          where: {
            id: node.id,
          },
          data: {
            previousTaskId: targetNode.previousTaskId,
          },
        });

        console.log(`Linked ${node.id} -> ${targetNode.previousTaskId}`);
      } else {
        if (req.body.position === 'before') {
          // Set targets previous node to null
          await tx.task.update({
            where: {
              id: targetNode.id,
            },
            data: {
              previousTaskId: null,
            },
          });

          console.log(
            `Unlinked ${targetNode.id} from ${targetNode.previousTaskId}`
          );

          // Link target node with node
          await tx.task.update({
            where: {
              id: targetNode.id,
            },
            data: {
              previousTaskId: node.id,
            },
          });

          console.log(`Linked ${targetNode.id} -> ${node.id}`);

          // Link node with target's previous node
          await tx.task.update({
            where: {
              id: node.id,
            },
            data: {
              previousTaskId: targetPreviousNode.id,
            },
          });

          console.log(`Linked ${node.id} -> ${targetPreviousNode.id}`);
        } else {
          // Set previous node of targets next node to null
          await tx.task.update({
            where: {
              id: targetNextNode.id,
            },
            data: {
              previousTaskId: null,
            },
          });

          console.log(
            `Unlinked ${targetNextNode.id} from ${targetNextNode.previousTaskId}`
          );

          // Link targets next node with node
          await tx.task.update({
            where: {
              id: targetNextNode.id,
            },
            data: {
              previousTaskId: node.id,
            },
          });

          console.log(`Linked ${targetNextNode.id} -> ${node.id}`);

          // Link node with target node
          await tx.task.update({
            where: {
              id: node.id,
            },
            data: {
              previousTaskId: targetNode.id,
            },
          });

          console.log(`Linked ${node.id} -> ${targetNode.id}`);
        }
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
