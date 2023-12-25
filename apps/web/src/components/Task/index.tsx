import { useTask } from '@/api';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentPropsWithRef, forwardRef } from 'react';
import { cn } from '@/utils';

type TaskProps = {
  id: string;
  isDragging?: boolean;
} & ComponentPropsWithRef<'div'>;

export const Task = forwardRef<HTMLDivElement, TaskProps>(
  ({ id, style, className, isDragging, ...props }, ref) => {
    const { task } = useTask.get(id, {
      enabled: false,
    });

    return (
      <div
        ref={ref}
        style={style}
        className={cn(
          'flex flex-col border-stone-300 dark:border-stone-700 border-[1px] p-2 rounded bg-white dark:bg-stone-800',
          isDragging &&
            'border-dashed bg-transparent dark:bg-transparent bg-none text-transparent',
          className
        )}
        {...props}
      >
        <span>{task?.title}</span>
        <span>{task?.description}</span>
      </div>
    );
  }
);

const SortableTask = ({ id }: TaskProps) => {
  const { task } = useTask.get(id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <Task
      id={id}
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      {...attributes}
      {...listeners}
    />
  );
};

export default SortableTask;
