import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import CustomerManagement from '../components/dashboard/customer-management';
import RewardsSelection from '../components/dashboard/rewards-selection';
import { MainLayout } from '@/layouts/main-layout'
import { AdminDashboardPage } from '@/pages/admin-dashboard-page'
import { AuthPage } from '@/pages/auth-page'
import { ClientDashboardPage } from '@/pages/client-dashboard-page'
import { HomePage } from '@/pages/home-page'
import { OtpPage } from '@/pages/otp-page'
import { TestRoutesPage } from '@/pages/test-routes-page'
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
      },
    }),
    [path],
  )

  return (
    <RouterContext.Provider value={value}>
      {path === routes.dashboard || path === routes.admin ? (
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
    case routes.admin:
      return <AdminDashboardPage />
    case '/admin/customer': 
      return <CustomerManagement />
    case '/admin/rewards': 
      return <RewardsSelection />
    case routes.dashboard:
      return <ClientDashboardPage />
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
  ref,
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
