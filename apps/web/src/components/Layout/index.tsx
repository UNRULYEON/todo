import { FC } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LucideIcon,
  LayoutDashboardIcon,
  InboxIcon,
  FolderIcon,
  ArchiveIcon,
  Settings2Icon,
} from 'lucide-react';
import { ThemeToggle } from '@/components';

type NavItem = {
  label: string;
  icon: LucideIcon;
  to: string;
};

const navItems: NavItem[] = [
  {
    label: 'Kanban board',
    icon: LayoutDashboardIcon,
    to: '/',
  },
  {
    label: 'Inbox',
    icon: InboxIcon,
    to: '/inbox',
  },
  {
    label: 'Backlog',
    icon: FolderIcon,
    to: '/backlog',
  },
  {
    label: 'Archive',
    icon: ArchiveIcon,
    to: '/archive',
  },
  {
    label: 'Settings',
    icon: Settings2Icon,
    to: '/settings',
  },
];

const Layout: FC = () => {
  return (
    <main className="bg-neutral-100 dark:bg-neutral-950 w-full h-full flex flex-row">
      <div className="relative w-full max-w-[200px] m-3 mr-0 flex flex-col gap-3">
        <span className="h-11 flex items-center px-2 font-bold gap-2 select-none">
          <span>🎯</span>
          <span>Todo</span>
        </span>
        <div className="flex flex-col gap-2 grow">
          {navItems.map((item) => (
            <NavLink
              to={item.to}
              key={item.label}
              className={({ isActive }) =>
                `flex flex-row gap-2 items-center rounded-sm p-2 transition-all ${
                  isActive
                    ? 'dark:bg-neutral-100/5 bg-neutral-900/5 text-foreground/100'
                    : 'dark:text-foreground/60 text-foreground/70'
                }`
              }
            >
              <span>
                <item.icon />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="">
          <ThemeToggle />
        </div>
      </div>
      <div className="dark:bg-neutral-900 bg-neutral-50 border m-3 p-3 rounded-xl w-full">
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
