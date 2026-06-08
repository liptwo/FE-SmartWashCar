import { CircleDollarSign, ShieldCheck } from 'lucide-react'
import { campaignBars } from '@/data/admin-promotions'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function PromotionStats() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-8">
        <CardContent className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium leading-4 text-on-surface">Hiệu quả chiến dịch</h3>
            <span className="text-xs leading-4 text-on-surface-variant">7 ngày gần nhất</span>
          </div>
          <div className="flex h-48 items-end justify-between gap-2 px-4">
            {campaignBars.map((bar) => (
              <div className="flex w-full flex-col items-center gap-2" key={bar.label}>
                <div
                  className={cn('group relative w-full rounded-t bg-[#9ec4f8]', bar.active && 'bg-primary')}
                  style={{ height: bar.height }}
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-on-background px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {bar.value}
                  </span>
                </div>
                <span className="text-[10px] uppercase leading-4 text-on-surface-variant">{bar.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="col-span-12 grid gap-4 lg:col-span-4">
        <Card>
          <CardContent className="flex min-h-36 flex-col items-center justify-center text-center">
            <ShieldCheck className="mb-2 text-primary" size={38} />
            <h4 className="text-xl font-medium leading-7 text-on-surface">1,248</h4>
            <p className="text-xs font-medium leading-4 text-on-surface-variant">Khách hàng active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex min-h-36 flex-col items-center justify-center text-center">
            <CircleDollarSign className="mb-2 text-success" size={38} />
            <h4 className="text-xl font-medium leading-7 text-on-surface">12.5%</h4>
            <p className="text-xs font-medium leading-4 text-on-surface-variant">Tỷ lệ chuyển đổi</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
