import { ArrowRight, Clock, Sparkles } from 'lucide-react'
import { inventoryAlert, queueItems, tierDistribution, type QueueItem } from '@/features/admin/data/admin-dashboard'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'

const statusClasses: Record<QueueItem['tone'], string> = {
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
  success: 'bg-success/10 text-success',
}

export function QueuePanel() {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase leading-4 text-primary">Queue hôm nay</h3>
          <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-medium">48 Total</span>
        </div>

        <div className="custom-scrollbar max-h-[400px] space-y-4 overflow-y-auto pr-1">
          {queueItems.map((item, index) => (
            <div
              className={cn(
                'flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:border-primary',
                index === 0 && 'bg-surface-container-low',
              )}
              key={item.plate}
            >
              <div className="grid size-12 shrink-0 place-items-center rounded border border-border bg-surface">
                <span className="text-[10px] font-medium leading-4 text-on-surface-variant">{item.time}</span>
                <Clock className="text-on-surface-variant" size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium uppercase leading-4 tracking-tight text-on-surface">
                  {item.plate}
                </p>
                <p className="text-[10px] leading-4 text-on-surface-variant">{item.service}</p>
              </div>
              <span className={cn('whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-medium', statusClasses[item.tone])}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <Button className="mt-4 w-full text-on-surface-variant" type="button" variant="outline">
          Xem tất cả booking
        </Button>
      </CardContent>
    </Card>
  )
}

export function TierDistributionPanel() {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h3 className="mb-6 text-sm font-medium uppercase leading-4 text-primary">Phân hạng khách hàng</h3>

        <div className="relative mb-6 flex items-center justify-center">
          <svg className="-rotate-90" height="140" viewBox="0 0 42 42" width="140">
            <circle cx="21" cy="21" fill="transparent" r="15.915" stroke="#D3D1C7" strokeDasharray="40 60" strokeWidth="6" />
            <circle cx="21" cy="21" fill="transparent" r="15.915" stroke="#B5D4F4" strokeDasharray="25 75" strokeDashoffset="-40" strokeWidth="6" />
            <circle cx="21" cy="21" fill="transparent" r="15.915" stroke="#FAC775" strokeDasharray="20 80" strokeDashoffset="-65" strokeWidth="6" />
            <circle cx="21" cy="21" fill="transparent" r="15.915" stroke="#CECBF6" strokeDasharray="15 85" strokeDashoffset="-85" strokeWidth="6" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-medium leading-7 text-on-surface">1,248</span>
            <span className="text-[10px] uppercase tracking-wide text-on-surface-variant">Hạng</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {tierDistribution.map((tier) => (
            <div className="flex items-center gap-2" key={tier.label}>
              <span className={cn('size-2.5 rounded-full', tier.colorClass)} />
              <span className="text-[11px] font-medium uppercase">
                {tier.label} ({tier.percent})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AdminActionCards() {
  const AlertIcon = inventoryAlert.icon

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground">
        <div className="relative z-10">
          <h4 className="mb-2 text-xl font-medium leading-7">Nâng cấp gói Diamond</h4>
          <p className="mb-6 text-sm leading-5 text-white/80">
            Ưu đãi 15% cho khách hàng Silver nâng cấp lên Platinum trong tuần này.
          </p>
          <Button className="bg-surface px-6 text-primary hover:bg-surface-container-low" type="button">
            Gửi thông báo
          </Button>
        </div>
        <Sparkles className="absolute -bottom-8 -right-8 text-white/10" size={120} />
      </div>

      <Card className="shadow-sm">
        <CardContent className="flex h-full flex-col justify-between p-6">
          <div>
            <h4 className="mb-2 text-sm font-medium uppercase leading-4 tracking-widest text-on-surface-variant">
              Cảnh báo tồn kho
            </h4>
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-full bg-danger/10 text-danger">
                <AlertIcon size={26} />
              </span>
              <div>
                <p className="text-base font-medium leading-6 text-on-surface">{inventoryAlert.title}</p>
                <p className="text-xs leading-4 text-danger">{inventoryAlert.subtitle}</p>
              </div>
            </div>
          </div>
          <a className="mt-4 inline-flex items-center gap-2 text-xs font-medium leading-4 text-primary hover:underline" href="#inventory">
            Xem chi tiết <ArrowRight size={14} />
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
