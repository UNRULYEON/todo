import { useLane } from '@/api';
import { cn, hexToRgba } from '@/utils';
import { Typography, SortableTask } from '@/components';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { TaskType } from '@/types';

const DEFAULT_COLOR = '#808080';

type LaneProps = {
  id: string;
};

const Lane = ({ id }: LaneProps) => {
  const { lane } = useLane.get(id);
  const { laneTasks, laneTasksUpdatedAt } = useLane.getTasks(id);
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const [items, setItems] = useState(laneTasks ?? []);

  useEffect(() => {
    setItems(laneTasks ?? []);
  }, [laneTasksUpdatedAt]);

  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;

      const current = (active.data.current as { task: TaskType }).task;
      const target = (over!.data.current as { task: TaskType }).task;

      if (current.id === target.id) return;

      const node = items?.find((t) => t.id === current.id);
      const targetNode = items?.find((t) => t.id === target.id);

      if (!node || !targetNode) return items;

      const oldIndex = items.indexOf(node);
      const newIndex = items.indexOf(targetNode);

      setItems((i) => arrayMove(i, oldIndex, newIndex));
    },
  });

  return (
    <div ref={setNodeRef} className="flex flex-col">
      {lane && (
        <>
          <div className="flex gap-2 items-center">
            <div
              className={`pl-2 pr-3 py-1 rounded-full flex flex-row items-center gap-2`}
              style={{
                backgroundColor: hexToRgba(
                  lane.color ?? DEFAULT_COLOR,
                  0.3
                ).toString(),
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: hexToRgba(
                    lane.color ?? DEFAULT_COLOR
                  ).toString(),
                }}
              />
              <span className="font-bold">{lane.name}</span>
            </div>
            <Typography.small className="font-medium text-stone-300 dark:text-stone-600">
              {laneTasks?.length}
            </Typography.small>
          </div>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div
              className={cn(
                'flex flex-col gap-2 mt-4 h-[-webkit-fill-available] rounded bg-stone-100 dark:bg-stone-800/30 p-2 transition-all',
                isOver && 'bg-stone-300 dark:bg-stone-800/80'
              )}
            >
              {items.map(({ id }) => (
                <SortableTask key={id} id={id} />
              ))}
            </div>
          </SortableContext>
        </>
      )}
    </div>
  );
};

export default Lane;
