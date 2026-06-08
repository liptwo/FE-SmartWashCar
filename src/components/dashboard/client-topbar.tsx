import { Bell, HelpCircle, Settings, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ClientTopbarProps = {
  title?: string
  utility?: 'help' | 'settings'
}

export function ClientTopbar({ title = 'Xin chào, Nguyễn Văn A', utility = 'help' }: ClientTopbarProps) {
  const UtilityIcon = utility === 'settings' ? Settings : HelpCircle
  const utilityLabel = utility === 'settings' ? 'Cài đặt' : 'Trợ giúp'

  return (
    <header className="fixed right-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-6 lg:w-[calc(100%-16rem)]">
      <h2 className="text-xl font-medium leading-7 text-on-surface">{title}</h2>

      <div className="flex items-center gap-4">
        <Button aria-label="Thông báo" size="icon" type="button" variant="ghost">
          <Bell className="size-5 text-on-surface-variant" />
        </Button>
        <Button aria-label={utilityLabel} size="icon" type="button" variant="ghost">
          <UtilityIcon className="size-5 text-on-surface-variant" />
        </Button>
        <div className="h-8 w-px bg-outline-variant" />
        <button
          aria-label="Hồ sơ"
          className="grid size-10 place-items-center rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant"
          type="button"
        >
          <Smartphone size={22} />
        </button>
      </div>
    </header>
  )
}
