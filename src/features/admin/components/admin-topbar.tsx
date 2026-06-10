import { Bell, CircleHelp, Plus, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'

export function AdminTopbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-16 border-b border-border bg-surface lg:left-64">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <label className="relative hidden w-96 md:block">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-outline" />
          <Input
            className="h-12 bg-surface-container-low pl-12"
            placeholder="Tìm kiếm giao dịch, khách hàng..."
            type="search"
          />
        </label>

        <div className="ml-auto flex items-center gap-6">
          <div className="flex items-center gap-4 text-on-surface-variant">
            <Button aria-label="Thông báo" size="icon" type="button" variant="ghost">
              <Bell size={20} />
            </Button>
            <Button aria-label="Trợ giúp" size="icon" type="button" variant="ghost">
              <CircleHelp size={20} />
            </Button>
          </div>
          <div className="h-6 w-px bg-border" />
          <Button className="h-10 gap-2 px-4" type="button">
            <Plus size={16} />
            Booking Mới
          </Button>
        </div>
      </div>
    </header>
  )
}
