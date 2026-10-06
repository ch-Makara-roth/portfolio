'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const DockNavigation = dynamic(
  () => import('./DockNavigation').then((mod) => mod.DockNavigation),
  {
    ssr: false,
    loading: () => null,
  },
);

export function ConditionalDockNavigation() {
  const pathname = usePathname();
  const [shouldRenderNav, setShouldRenderNav] = useState(false);

  useEffect(() => {
    const showNavigation = () => setShouldRenderNav(true);

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(showNavigation, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(showNavigation, 600);
    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  // Hide DockNavigation on admin pages
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute || !shouldRenderNav) {
    return null;
  }

  return <DockNavigation />;
}
