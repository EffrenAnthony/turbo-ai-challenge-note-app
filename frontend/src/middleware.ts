import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/notes']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('access_token')?.value

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/notes', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
