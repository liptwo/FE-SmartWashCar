import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode
} from 'react'
import { AdminCustomerPage } from '@/features/admin/pages/admin-customer-page'
import { AdminRewardsPage } from '@/features/admin/pages/admin-rewards-page'
import { MainLayout } from '@/shared/components/layout/main-layout'
import { AdminConfigurationPage } from '@/features/admin/pages/admin-configuration-page'
import { AdminDashboardPage } from '@/features/admin/pages/admin-dashboard-page'
import { AdminBookingsPage } from '@/features/admin/pages/admin-bookings-page'
import { AdminPromotionsPage } from '@/features/admin/pages/admin-promotions-page'
import { AuthPage } from '@/features/auth/pages/auth-page'
import { BookingPage } from '@/features/booking/pages/booking-page'
import { ClientDashboardPage } from '@/features/client/pages/client-dashboard-page'
import { ClientProfilePage } from '@/features/client/pages/client-profile-page'
import { ClientVehiclesPage } from '@/features/client/pages/client-vehicles-page'
import { ClientHistoryPage } from '@/features/client/pages/client-history-page'
import { HomePage } from '@/features/marketing/pages/home-page'
import { LoyaltyPage } from '@/features/client/pages/loyalty-page'
import ClientPromotionsPage from '@/features/client/pages/client-promotions-page'
import { OtpPage } from '@/features/auth/pages/otp-page'
import { TestRoutesPage } from '@/features/test/pages/test-routes-page'
import { isAppPath, routes, type AppPath } from './routes'

type RouterContextValue = {
  path: AppPath
  navigate: (to: AppPath) => void
}

const RouterContext = createContext<RouterContextValue | null>(null)

function getCurrentPath(): AppPath {
  const pathname = window.location.pathname
  return isAppPath(pathname) ? pathname : routes.home
}

export function AppRouter() {
  const [path, setPath] = useState<AppPath>(getCurrentPath)

  useEffect(() => {
    const onPopState = () => setPath(getCurrentPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const value = useMemo<RouterContextValue>(
    () => ({
      path,
      navigate: (to) => {
        if (to === path) {
          return
        }

        window.history.pushState(null, '', to)
        setPath(to)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }),
    [path]
  )

  return (
    <RouterContext.Provider value={value}>
      {path === routes.dashboard ||
      path === routes.profile ||
      path === routes.vehicles ||
      path === routes.booking ||
      path === routes.history ||
      path === routes.loyalty ||
      path === routes.promotions ||
      path === routes.admin ||
      path === routes.adminBookings ||
      path === routes.customer ||
      path === routes.rewards ||
      path === routes.adminPromotions ||
      path === routes.adminConfiguration ? (
        renderRoute(path)
      ) : (
        <MainLayout>{renderRoute(path)}</MainLayout>
      )}
    </RouterContext.Provider>
  )
}

function renderRoute(path: AppPath) {
  // TODO(auth): Khi backend/session sẵn sàng, bật guard này để chặn user chưa đăng nhập:
  // if (path === routes.dashboard && !authStore.isAuthenticated()) return <Navigate to={routes.login} />
  switch (path) {
    case routes.adminConfiguration:
      return <AdminConfigurationPage />
    case routes.adminPromotions:
      return <AdminPromotionsPage />
    case routes.adminBookings:
      return <AdminBookingsPage />
    case routes.admin:
      return <AdminDashboardPage />
    case routes.customer:
      return <AdminCustomerPage />
    case routes.rewards:
      return <AdminRewardsPage />
    case routes.booking:
      return <BookingPage onBookingSuccess={() => {}} />
    case routes.loyalty:
      return <LoyaltyPage />
    case routes.promotions:
      return <ClientPromotionsPage />
    case routes.dashboard:
      return <ClientDashboardPage />
    case routes.history:
      return <ClientHistoryPage />
    case routes.profile:
      return <ClientProfilePage />
    case routes.vehicles:
      return <ClientVehiclesPage />
    case routes.test:
      return <TestRoutesPage />
    case routes.login:
      return <AuthPage mode='login' />
    case routes.register:
      return <AuthPage mode='register' />
    case routes.otp:
      return <OtpPage />
    case routes.home:
    default:
      return <HomePage />
  }
}

export function useRouter() {
  const context = useContext(RouterContext)

  if (!context) {
    throw new Error('useRouter must be used inside AppRouter')
  }

  return context
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  children: ReactNode
  className?: string
  to: AppPath
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { children, className, onClick, to, ...props },
  ref
) {
  const { navigate } = useRouter()

  return (
    <a
      className={className}
      href={to}
      ref={ref}
      {...props}
      onClick={(event) => {
        onClick?.(event as MouseEvent<HTMLAnchorElement>)
        if (event.defaultPrevented) {
          return
        }

        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
})
