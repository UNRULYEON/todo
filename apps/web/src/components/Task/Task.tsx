import { useTask } from '@/api';
import { Draggable } from '@hello-pangea/dnd';
import { ComponentPropsWithRef } from 'react';
import { cn } from '@/utils';

type TaskProps = {
  id: string;
  index: number;
} & ComponentPropsWithRef<'div'>;

const Task = ({ id, index, ...props }: TaskProps) => {
  const { task } = useTask.get(id);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          id={id}
          ref={provided.innerRef}
          className={cn(
            'flex flex-col my-1 border-stone-300 dark:border-stone-700 border-[1px] p-2 rounded bg-white dark:bg-stone-800'
          )}
          {...props}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <span>{task?.title}</span>
          <span>{task?.description}</span>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
