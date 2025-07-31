import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes: (string | RegExp)[] = ['/login', '/register', '/', '/maps'];
const authRoutes = ['/login', '/register'];

export async function customMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const isApiRoute = pathname.startsWith('/api/');
  const isAdminPage = pathname.startsWith('/admin');
  const isWriteMethod = request.method !== 'GET';
  const isProtectedAdminArea = isAdminPage || (isApiRoute && isWriteMethod);

  if (isProtectedAdminArea && (!token || token.role !== 'ADMIN')) {
    return isApiRoute ? NextResponse.json({ message: 'Unauthorized (middleware)' }, { status: 401 }) : NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export default withAuth(customMiddleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;
      const method = req.method;

      const isPublicApiGet = method === 'GET' && (pathname.startsWith('/api/cctvs') || pathname.startsWith('/api/cities') || pathname.startsWith('/api/users'));

      const isPublicPage = publicRoutes.some((route) => {
        if (typeof route === 'string') {
          return pathname === route;
        }
        if (route instanceof RegExp) {
          return route.test(pathname);
        }
        return false;
      });

      return isPublicApiGet || isPublicPage || Boolean(token);
    },
  },
});

export const config = {
  matcher: ['/login', '/register', '/favorites', '/api/cctvs/:path*', '/api/cities/:path*', '/api/users/:path*', '/admin/:path*'],
};
