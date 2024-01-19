'use client';
import { useContext } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import AppsWrapper from '@grc/components/apps';
import { AppHeader } from '@grc/components/giro-pay/layout/app-header';
import { useAuth } from '@grc/hooks/useAuth';

const AppsPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const {} = useAuth({ callUser: true });

  return (
    <main className="h-screen flex flex-col items-center bg-white px-4">
      <header className="w-full max-w-full px-6">
        <AppHeader />
      </header>
      <div className="mt-24 flex items-center justify-center justify-items-center justify-self-center content-center text-black">
        <AppsWrapper mobileResponsive={mobileResponsive} theme={theme} />
      </div>
    </main>
  );
};

export default AppsPage;
