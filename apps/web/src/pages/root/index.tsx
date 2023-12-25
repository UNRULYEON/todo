import { queryClient, useLane, useTask } from '@/api';
import { Lane, Task } from '@/components';
import { TaskType } from '@/types';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const RootPage = () => {
  const { lanes } = useLane.getAll();
  const { reorderTask } = useTask.reorder();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [changedLaneIds, setChangedLaneIds] = useState<string[]>([]);

  useEffect(() => {
    if (changedLaneIds.length === 0) return;

    const timeout = setTimeout(() => {
      changedLaneIds.forEach((id) =>
        queryClient.invalidateQueries({
          queryKey: ['lane', id, 'tasks'],
        })
      );

      setChangedLaneIds([]);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [changedLaneIds]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const current = (active.data.current as { task: TaskType }).task;
    const target = (over!.data.current as { task: TaskType }).task;

    if (current.id === target.id) return;

    reorderTask(
      {
        id: current.id,
        payload: {
          currentLaneId: current.laneId,
          targetLaneId: target.laneId,
          targetTaskId: target.id,
          position: event.delta.y > 0 ? 'after' : 'before',
        },
      },
      {
        onSettled: () => {
          setChangedLaneIds(() =>
            current.laneId !== target.laneId
              ? [current.laneId, target.laneId]
              : [current.laneId]
          );
        },
      }
    );

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-4 gap-3 w-full">
        {lanes
          ?.filter((l) => !['Backlog', 'Archive'].includes(l.name))
          .map((lane) => <Lane key={lane.id} id={lane.id} />)}
      </div>
      {createPortal(
        <DragOverlay>
          {activeId ? (
            <Task id={activeId as string} className="cursor-grab" />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default RootPage;
