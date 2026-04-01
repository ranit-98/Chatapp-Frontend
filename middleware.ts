import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for authentication and route protection
 * Note: Since the backend is on a different port (3000), 
 * the 'access_token' cookie must be set with Domain=localhost 
 * or be accessible via cross-origin policies for this to read it.
 */
export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const { pathname } = request.nextUrl

    // 1. If user is NOT logged in and tries to access /chat, redirect to login (/)
    if (!token && pathname.startsWith('/chat')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 2. If user IS logged in and tries to access / (login/register), redirect to /chat
    if (token && pathname === '/') {
        return NextResponse.redirect(new URL('/chat', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/chat/:path*'],
}
