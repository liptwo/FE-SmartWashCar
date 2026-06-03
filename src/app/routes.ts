export const routes = {
  home: '/',
  admin: '/admin',
  dashboard: '/dashboard',
  profile: '/profile',
  test: '/test',
  login: '/login',
  register: '/register',
  otp: '/otp',
} as const

export type AppPath = (typeof routes)[keyof typeof routes]

export function isAppPath(pathname: string): pathname is AppPath {
  return Object.values(routes).includes(pathname as AppPath)
}
