import { FC, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLane, useUser } from '@/api';
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
      'Todo',
      'In progress',
      'Done',
      'This Sprint',
      'Backlog',
      'Archive',
    ].forEach((name) =>
      createLane(
        { name },
        {
          onSuccess: () =>
            updateUser({ hasSeenOnboarding: true, onboarded: true }).then(() =>
              getUser()
            ),
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
