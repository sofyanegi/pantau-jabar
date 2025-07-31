import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/register', /^\/cctv\/[^\/]+$/];
const authRoutes = ['/login', '/register'];
const protectedApiRoutes = ['/api/cctvs', '/api/cities'];

export async function customMidleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const isProtectedRoute = protectedApiRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && request.method !== 'GET') {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized (middleware)' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export default withAuth(customMidleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;
      const method = req.method;

      const isPublicApiGet = method === 'GET' && (pathname.startsWith('/api/cctvs') || pathname.startsWith('/api/cities'));

      if (isPublicApiGet) return true;

      for (const route of publicRoutes) {
        if (typeof route === 'string' && pathname === route) return true;
        if (route instanceof RegExp && route.test(pathname)) return true;
      }

      return !!token;
    },
  },
});

export const config = {
  matcher: ['/login', '/register', '/cctv/:path*', '/favorites', '/api/cctvs/:path*', '/api/cities/:path*', '/protected'],
};
