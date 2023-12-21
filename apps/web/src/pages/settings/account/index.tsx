import { Settings, Typography } from '@/components';
import { DeleteAccount, ResetAccount } from '@/features';

const SettingsAccountPage = () => {
  return (
    <Settings.Page>
      <Typography.h2 className="text-red-500">Danger zone</Typography.h2>
      <Settings.Items>
        <ResetAccount />
        <DeleteAccount />
      </Settings.Items>
    </Settings.Page>
  );
};

export default SettingsAccountPage;
