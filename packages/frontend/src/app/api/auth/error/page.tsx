'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-destructive">Authentication Error</h1>
        <p className="text-muted-foreground">
          {error === 'CredentialsSignin' ? 'Invalid email or password' : 'An error occurred during authentication'}
        </p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}
