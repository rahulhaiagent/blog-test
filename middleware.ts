/**
 * Middleware - Disabled to avoid Edge runtime conflicts with SQLite
 * Route protection is handled at the page level instead
 * See app/admin/page.tsx and app/admin/dashboard/page.tsx
 */

import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};


