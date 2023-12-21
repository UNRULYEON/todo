import { useUser } from '@/api';
import { Settings, Typography } from '@/components';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResetAccount = () => {
  const navigate = useNavigate();
  const { resetUser, isResettingUser } = useUser.reset();

  const handleResetAccount = () => {
    resetUser().then(() => {
      navigate('/');
      window.location.reload();
    });
  };

  return (
    <Settings.Item>
      <Settings.ItemHeader>
        <Typography.large>Reset account</Typography.large>
        <Typography.muted>
          Resetting your account will remove all data associated with your
          account, including your projects, tasks, and subtasks. Your account
          will still exist and you'll have to onboard again. This action cannot
          be undone.
        </Typography.muted>
      </Settings.ItemHeader>
      <Settings.ItemActions>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Reset account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleResetAccount} disabled={isResettingUser}>
                {isResettingUser && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reset account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Settings.ItemActions>
    </Settings.Item>
  );
};

export default ResetAccount;
