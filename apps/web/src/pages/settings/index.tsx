// import { Typography } from '@/components';
import { useUser } from '@clerk/clerk-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/utils';
import { buttonVariants } from '@/components/ui/button';
import SettingsAccountPage from './account';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// import SettingsBillingPage from './billing';

// const SettingsProfilePage = () => {
//   return (
//     <>
//       <Typography.h2>Profile</Typography.h2>
//     </>
//   );
// };

type SettingsItem = {
  title: string;
  href: string;
  page: JSX.Element;
};

const settingsItem: SettingsItem[] = [
  // {
  //   title: 'Profile',
  //   href: '/settings',
  //   page: <SettingsProfilePage />,
  // },
  {
    title: 'Account',
    href: '/settings',
    page: <SettingsAccountPage />,
  },
  // {
  //   title: 'Billing',
  //   href: '/settings/billing',
  //   page: <SettingsBillingPage />,
  // },
];

const SettingsPage = () => {
  const { pathname } = useLocation();
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-row gap-3 items-center">
        <Avatar>
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="font-extrabold text-3xl">
          {user?.firstName} {user?.lastName}
        </span>
      </div>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col space-x-0 space-y-1 min-w-[200px]">
          {settingsItem.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                pathname === item.href
                  ? 'bg-muted hover:bg-muted'
                  : 'hover:bg-transparent',
                'justify-start'
              )}
            >
              {item.title}
            </NavLink>
          ))}
        </div>
        <div className="flex flex-col w-full">
          {settingsItem.filter((item) => pathname === item.href)[0]?.page}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
