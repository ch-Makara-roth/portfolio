'use client';

import { usePathname } from 'next/navigation';
import { DockNavigation } from './DockNavigation';

export function ConditionalDockNavigation() {
  const pathname = usePathname();

  // Hide DockNavigation on admin pages
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return <DockNavigation />;
}
