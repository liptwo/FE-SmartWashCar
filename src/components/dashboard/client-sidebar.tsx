import { dashboardLogoutItem, dashboardNavItems } from '@/data/client-dashboard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ClientSidebar() {
  const LogoutIcon = dashboardLogoutItem.icon

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-outline-variant bg-surface py-6 lg:flex">
      <div className="mb-8 px-6">
        <h1 className="text-2xl font-medium leading-8 text-primary">AutoWash Pro</h1>
        <p className="text-xs font-medium leading-4 text-on-surface-variant">Customer Portal</p>
      </div>

      <nav className="flex-1 space-y-1">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              className={cn(
                'flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium leading-4 text-on-surface-variant transition-colors hover:bg-surface-container-low',
                item.active && 'border-l-4 border-primary bg-surface-container-low pl-4 text-primary',
              )}
              key={item.label}
              type="button"
            >
              <Icon aria-hidden="true" size={20} />
              {item.label}
            </button>
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
