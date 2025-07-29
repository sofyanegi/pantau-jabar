import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

const authRoutes = ['/login', '/register'];
const protectedRoutes = ['/protected'];

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    // @ts-ignore
    const token = req.nextauth?.token;

    if (token && authRoutes.includes(pathname)) {
      return Response.redirect(new URL('/', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (authRoutes.includes(pathname)) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/login', '/register', '/protected'],
};
