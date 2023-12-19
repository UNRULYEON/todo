import { FC, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { queryClient, useLane, useUser } from '@/api';
import { Button } from '@/components/ui/button';

const Onboarding: FC = () => {
  const { user, getUser, isLoadingUser } = useUser.get();
  const { updateUser, isUpdatingUser, errorUpdatingUser } = useUser.update(
    user?.id
  );
  const { createLane } = useLane.create();

  useEffect(() => {
    if (
      user &&
      !user.hasSeenOnboarding &&
      !isUpdatingUser &&
      !errorUpdatingUser
    ) {
      updateUser({
        hasSeenOnboarding: true,
      }).then(() => getUser());
    }
  }, [user, isUpdatingUser, errorUpdatingUser]);

  const createDefaultLanes = () => {
    [
      ['Todo', '#A855F7'],
      ['In progress', '#3B82F6'],
      ['Done', '#22C55E'],
      ['This sprint', '#FB923C'],
      ['Backlog', '#FFF'],
      ['Archive', '#FFF'],
    ].forEach(([name, color]) =>
      createLane(
        { name, color },
        {
          onSuccess: () => {
            updateUser({ hasSeenOnboarding: true, onboarded: true }).then(() =>
              queryClient.invalidateQueries({
                queryKey: ['user'],
              })
            ),
              queryClient.invalidateQueries({
                queryKey: ['lanes'],
              });
          },
        }
      )
    );
  };

  if (isLoadingUser) return null;

  return (
    <Dialog open={!user?.onboarded}>
      <DialogContent hideCloseButton>
        <DialogHeader>
          <DialogTitle>Let's get started!</DialogTitle>
          <DialogDescription>
            Todo will help you manage your sprint, and tasks for today!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col"></div>
        <DialogFooter>
          <Button onClick={createDefaultLanes}>Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;
