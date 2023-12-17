import { useEffect } from 'react';
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useAuth,
} from '@clerk/clerk-react';
import { Layout, Onboarding } from '@/components';
import { axios, useUser } from '@/api';

const Guard = () => {
  const { getToken } = useAuth();
  const { user, getUser, isLoadingUser } = useUser.get({
    enabled: false,
  });

  useEffect(() => {
    const setBearerToken = async () => {
      const token = await getToken();

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.post['Content-Type'] = 'application/json';

      getUser();
    };

    setBearerToken();
  }, []);

  return (
    <>
      <SignedIn>
        {!user && isLoadingUser && (
          <div className="absolute grid place-items-center top-0 right-0 bottom-0 left-0 z-50 dark:bg-neutral-900/90 bg-neutral-200/90">
            Loading...
          </div>
        )}
        <Onboarding />
        <Layout />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Guard;
