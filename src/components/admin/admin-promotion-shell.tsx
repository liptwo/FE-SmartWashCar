import { Bell, CircleHelp, Search, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AdminPromotionShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activeItem="promotion" />

      <main className="h-screen overflow-y-auto lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-outline-variant bg-surface px-6">
          <label className="relative hidden w-96 md:block">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-on-surface-variant" />
            <Input
              className="h-12 rounded-full bg-surface-container pl-12"
              placeholder="Tìm kiếm chương trình..."
              type="search"
            />
          </label>

          <div className="ml-auto flex items-center gap-4">
            <Button aria-label="Thông báo" size="icon" type="button" variant="ghost">
              <Bell className="text-on-surface-variant" size={20} />
            </Button>
            <Button aria-label="Trợ giúp" size="icon" type="button" variant="ghost">
              <CircleHelp className="text-on-surface-variant" size={20} />
            </Button>
            <div className="h-8 w-px bg-outline-variant" />
            <div className="flex items-center gap-3 rounded-lg p-2">
              <span className="grid size-8 place-items-center rounded-full bg-[linear-gradient(145deg,#10272c,#4e8795)] text-white">
                <Sparkles size={16} />
              </span>
              <span className="text-sm font-medium leading-4">Admin</span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}
