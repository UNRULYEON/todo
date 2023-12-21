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

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { deleteUser, isDeletingUser } = useUser.deleteUser();

  const handleResetAccount = () => {
    deleteUser().then(() => {
      navigate('/');
      window.location.reload();
    });
  };

  return (
    <Settings.Item>
      <Settings.ItemHeader>
        <Typography.large>Delete account</Typography.large>
        <Typography.muted>
          Deleting your account will remove all data associated with your
          account, including your projects, tasks, and subtasks. This action
          cannot be undone.
        </Typography.muted>
      </Settings.ItemHeader>
      <Settings.ItemActions>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'destructive'}>Delete account</Button>
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
              <Button
                variant={'destructive'}
                onClick={handleResetAccount}
                disabled={isDeletingUser}
              >
                {isDeletingUser && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Settings.ItemActions>
    </Settings.Item>
  );
};

export default DeleteAccount;
