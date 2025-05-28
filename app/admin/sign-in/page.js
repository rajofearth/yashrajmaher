'use client';

import { SignIn } from '@clerk/nextjs';

export default function AdminSignInPage() {
  return <SignIn path="/admin/sign-in" routing="path" />;
} 