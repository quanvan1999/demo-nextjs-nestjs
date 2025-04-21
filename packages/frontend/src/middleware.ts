import { auth } from '@/auth';

export default auth(req => {
  if (!req.auth && req.nextUrl.pathname !== '/auth/signin') {
    const isNotAuth = req.nextUrl.pathname.includes('/auth/signup') || req.nextUrl.pathname.includes('/verify');

    if (isNotAuth) {
      return;
    }

    const newUrl = new URL('/auth/signin', req.nextUrl.origin);
    newUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return Response.redirect(newUrl);
  } else {
    if (req.nextUrl.pathname.includes('/auth/signin')) {
      const newUrl = new URL('/dashboard', req.nextUrl.origin);
      return Response.redirect(newUrl);
    }
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
