import { MoreHorizontal } from 'lucide-react'
import { revenueBars } from '@/features/admin/data/admin-dashboard'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'

export function RevenueChart() {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-medium leading-7 text-on-surface">Doanh thu 7 ngày qua</h3>
          <Button aria-label="Tùy chọn biểu đồ" size="icon" type="button" variant="ghost">
            <MoreHorizontal size={22} />
          </Button>
        </div>

        <div className="relative flex h-64 items-end justify-between gap-4">
          <div className="absolute inset-0 flex flex-col justify-between opacity-10">
            <div className="border-b border-on-surface-variant" />
            <div className="border-b border-on-surface-variant" />
            <div className="border-b border-on-surface-variant" />
            <div className="border-b border-on-surface-variant" />
          </div>

          {revenueBars.map((bar) => (
            <div
              className={cn(
                'group relative flex-1 cursor-pointer rounded-t-lg bg-primary/20 transition-colors hover:bg-primary',
                bar.active && 'bg-primary hover:bg-primary',
              )}
              key={bar.day}
              style={{ height: bar.height }}
            >
              <span
                className={cn(
                  'absolute -top-8 left-1/2 -translate-x-1/2 rounded px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100',
                  bar.active ? 'bg-primary opacity-100' : 'bg-on-background',
                )}
              >
                {bar.value}
              </span>
              <span
                className={cn(
                  'absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium leading-4 text-on-surface-variant',
                  bar.active && 'text-primary',
                )}
              >
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
