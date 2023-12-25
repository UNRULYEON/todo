import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';
import { TaskType } from '@/types';

type NewTask = Omit<TaskType, 'id'>;

export const create = (
  options?: Partial<
    Parameters<typeof useMutation<TaskType, Error, NewTask, unknown>>[0]
  >
) => {
  const { mutateAsync, isPending, isError } = useMutation<
    TaskType,
    Error,
    NewTask,
    unknown
  >({
    mutationKey: ['create-task'],
    mutationFn: (newTask) =>
      axios.post(`/api/tasks`, newTask).then((res) => res.data),
    ...options,
  });

  return {
    createTask: mutateAsync,
    isCreatingTask: isPending,
    errorCreatingTask: isError,
  };
};
