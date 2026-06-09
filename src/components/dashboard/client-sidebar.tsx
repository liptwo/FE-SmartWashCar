import { Link, useRouter } from '@/app/router'
import { Button } from '@/components/ui/button'
import { dashboardLogoutItem, dashboardNavItems } from '@/data/client-dashboard'
import { cn } from '@/lib/utils'
import { routes } from '@/app/routes';

export function ClientSidebar() {
  const { path } = useRouter()
  const LogoutIcon = dashboardLogoutItem.icon

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-outline-variant bg-surface py-6 lg:flex">
      <div className="mb-8 px-6">
        <h1 className="text-2xl font-medium leading-8 text-primary">AutoWash Pro</h1>
        <p className="text-xs font-medium uppercase leading-4 tracking-wide text-on-surface-variant">
          Customer Portal
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon
          const isActive = item.activePath === path

          // Tự động nhận diện đường dẫn dựa vào tên nút bấm (label) bên phía Khách hàng
          let targetPath = routes.dashboard as any;

          if (item.label === 'Điểm thưởng' || item.label === 'Rewards') {
            targetPath = routes.rewards;
          }
          if (item.label === 'Trang chủ' || item.label === 'Home') {
            targetPath = routes.dashboard;
          }
          // (Sau này làm các mục như History, My Vehicles thì thêm điều kiện ở đây)

          return (
            <Link
              to={targetPath}
              className={cn(
                'flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium leading-4 text-on-surface-variant transition-colors hover:bg-surface-container-low',
                isActive && 'border-l-4 border-primary bg-surface-container-low pl-4 text-primary',
              )}
              key={item.label}
            >
              <Icon aria-hidden="true" size={20} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-outline-variant px-6 pt-6">
        <Button className="w-full justify-start gap-3 px-0 text-on-surface-variant hover:text-danger" variant="ghost">
          <LogoutIcon aria-hidden="true" size={20} />
          {dashboardLogoutItem.label}
        </Button>
      </div>
    </aside>
  )
}