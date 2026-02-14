export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const AUTH_ROUTES = ['/login', '/register']
export const PROTECTED_ROUTES = ['/notes']

export const ACCESS_TOKEN_KEY = 'access_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'
