import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';

type User = {
  id: string;
  lanes: 0;
  onboarded: boolean;
  hasSeenOnboarding: boolean;
};

export const update = (
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
    mutationKey: ['update-user'],
    mutationFn: (updatedUser) =>
      axios.patch(`/api/user`, updatedUser).then((res) => res.data),
    ...options,
  });

  return {
    updateUser: mutateAsync,
    isUpdatingUser: isPending,
    errorUpdatingUser: isError,
  };
};
