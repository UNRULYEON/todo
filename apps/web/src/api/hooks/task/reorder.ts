import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';
import { TaskType } from '@/types';

type UpdateTask = {
  currentLaneId: string;
  targetLaneId: string;
  targetTaskId: string;
  position: 'before' | 'after';
};

type Variables = {
  id: string;
  payload: UpdateTask;
};

export const reorder = (
  options?: Partial<
    Parameters<typeof useMutation<TaskType, Error, Variables, unknown>>[0]
  >
) => {
  const { mutateAsync, isPending, isError } = useMutation<
    TaskType,
    Error,
    Variables,
    unknown
  >({
    mutationKey: ['reorder-task'],
    mutationFn: (args) =>
      axios
        .post(`/api/tasks/${args.id}/reorder`, args.payload)
        .then((res) => res.data),
    ...options,
  });

  return {
    reorderTask: mutateAsync,
    isReorderingTask: isPending,
    errorReorderingTask: isError,
  };
};
