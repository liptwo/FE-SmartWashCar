export const routes = {
  home: '/',
  admin: '/admin',
  adminBookings: '/admin/bookings',
  customer: '/admin/customer',
  rewards: '/admin/rewards',
  adminConfiguration: '/admin/configuration',
  adminPromotions: '/admin/promotions',
  dashboard: '/dashboard',
  profile: '/profile',
  vehicles: '/vehicles',
  booking: '/booking',
  loyalty: '/loyalty',
  test: '/test',
  login: '/login',
  register: '/register',
  otp: '/otp',
} as const

export type AppPath = (typeof routes)[keyof typeof routes]

export function isAppPath(pathname: string): pathname is AppPath {
  return Object.values(routes).includes(pathname as AppPath)
}
