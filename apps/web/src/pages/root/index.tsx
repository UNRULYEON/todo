import { queryClient, useLane, useTask } from '@/api';
import { Lane, useLanes } from '@/components';
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';

const RootPage = () => {
  const { lanes: apiLanes } = useLane.getAll();
  const { reorderTask } = useTask.reorder();
  const { lanes, moveTask } = useLanes();
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

  const handleOnDragEnd = useCallback<OnDragEndResponder>(
    (result) => {
      const sourceLaneId = result.source.droppableId;
      const sourceIndex = result.source.index;
      const targetLaneId = result.destination?.droppableId;
      const targetIndex = result.destination?.index;

      if (
        targetIndex === undefined ||
        targetLaneId === undefined ||
        (sourceIndex === targetIndex && sourceLaneId === targetLaneId)
      )
        return;

      const updatedLanes = moveTask(
        sourceLaneId,
        targetLaneId,
        sourceIndex,
        targetIndex
      );

      const updatedSourceIndex = updatedLanes[targetLaneId].findIndex(
        (t) => t.id === result.draggableId
      );
      const previousNodeId =
        updatedLanes[targetLaneId][updatedSourceIndex - 1]?.id || null;

      reorderTask(
        {
          id: result.draggableId,
          payload: {
            targetLaneId: targetLaneId,
            previousNodeId,
          },
        },
        {
          onSettled: () => {
            setChangedLaneIds(() =>
              sourceLaneId !== targetLaneId
                ? [sourceLaneId, targetLaneId]
                : [sourceLaneId]
            );
          },
        }
      );
    },
    [lanes]
  );

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="grid grid-cols-4 gap-3 w-full">
        {apiLanes
          ?.filter((l) => !['Backlog', 'Archive'].includes(l.name))
          .map((lane) => <Lane key={lane.id} id={lane.id} />)}
      </div>
    </DragDropContext>
  );
};

export default RootPage;
