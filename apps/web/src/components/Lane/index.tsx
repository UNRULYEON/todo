import { useLane } from '@/api';
import { cn, hexToRgba } from '@/utils';
import { Typography, useLanes, Task } from '@/components';
import { Droppable } from '@hello-pangea/dnd';
import { useEffect } from 'react';

const DEFAULT_COLOR = '#808080';

type LaneProps = {
  id: string;
};

const Lane = ({ id }: LaneProps) => {
  const { lane } = useLane.get(id);
  const { laneTasks, laneTasksUpdatedAt } = useLane.getTasks(id);
  const { lanes, addLane } = useLanes();

  useEffect(() => {
    if (!laneTasks) return;

    addLane(id, laneTasks);
  }, [laneTasksUpdatedAt]);

  return (
    <div className="flex flex-col">
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
              {lanes[id] && lanes[id].length}
            </Typography.small>
          </div>
          {lanes[id] && (
            <Droppable droppableId={id} type="lane">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className={cn(
                    'flex flex-col mt-4 h-[-webkit-fill-available] rounded bg-stone-100 dark:bg-stone-800/30 p-2 transition-all',
                    snapshot.isDraggingOver &&
                      'bg-stone-300 dark:bg-stone-800/80'
                  )}
                  {...provided.droppableProps}
                >
                  {lanes[id].map(({ id }, i) => (
                    <Task key={id} id={id} index={i} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </>
      )}
    </div>
  );
};

export default Lane;
