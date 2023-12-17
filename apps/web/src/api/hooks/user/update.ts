import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';

type User = {
  id: string;
  lanes: 0;
  onboarded: boolean;
  hasSeenOnboarding: boolean;
};

export const update = (
  id?: string,
  options?: Partial<
    Parameters<typeof useMutation<User, Error, Partial<User>, unknown>>[0]
  >
) => {
  const { mutateAsync, isPending, isError } = useMutation<
    User,
    Error,
    Partial<User>,
    unknown
  >({
    mutationKey: ['update-user', id],
    mutationFn: (updatedUser) =>
      axios.patch(`/api/auth/user/${id}`, updatedUser).then((res) => res.data),
    ...options,
  });

  return {
    updateUser: mutateAsync,
    isUpdatingUser: isPending,
    errorUpdatingUser: isError,
  };
};
