import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';
import { TaskType } from '@/types';

type UpdateTask = Omit<TaskType, 'id'>;

type Variables = {
  id: string;
  payload: Partial<UpdateTask>;
};

export const update = (
  id?: string,
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
    mutationKey: ['update-task', id],
    mutationFn: (args) =>
      axios
        .patch(`/api/tasks/${id || args.id}`, args.payload)
        .then((res) => res.data),
    ...options,
  });

  return {
    updateTask: mutateAsync,
    isUpdatingTask: isPending,
    errorUpdatingTask: isError,
  };
};
