import { Check, Send, SendHorizontal } from 'lucide-react'
import type { AdminPromotion } from '@/features/admin/data/admin-promotions'
import { cn } from '@/shared/lib/utils'

const typeClasses: Record<AdminPromotion['type'], string> = {
  DISCOUNT: 'bg-secondary-container text-on-surface-variant',
  BONUS_POINTS: 'bg-[#ffdcc4] text-tertiary',
  FREE_WASH: 'bg-success text-white',
}

const tierClasses: Record<string, string> = {
  MEMBER: 'bg-tier-member',
  SILVER: 'bg-tier-silver',
  GOLD: 'bg-tier-gold',
  PLATINUM: 'bg-tier-platinum',
}

type PromotionTableProps = {
  onSendPromotion: (promotion: AdminPromotion) => void
  promotions: AdminPromotion[]
}

export function PromotionTable({ onSendPromotion, promotions }: PromotionTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse">
          <thead className="border-b border-outline-variant bg-surface-container-low">
            <tr>
              {['Tên chương trình', 'Loại', 'Target Tiers', 'Giá trị', 'Thời hạn', 'Usage', 'Status', 'Hành động'].map(
                (header) => (
                  <th
                    className={cn(
                      'px-4 py-4 text-left text-sm font-medium leading-4 text-on-surface-variant',
                      (header === 'Status' || header === 'Hành động') && 'text-center',
                    )}
                    key={header}
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {promotions.map((promotion) => (
              <tr className={cn('transition-colors hover:bg-surface-container-low', promotion.muted && 'opacity-70')} key={promotion.code}>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium leading-4 text-on-surface">{promotion.name}</p>
                  <p className="mt-1 text-[11px] leading-4 text-on-surface-variant">ID: {promotion.code}</p>
                </td>
                <td className="px-4 py-4">
                  <span className={cn('rounded px-2 py-1 text-[11px] font-medium leading-4', typeClasses[promotion.type])}>
                    {promotion.type}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {promotion.targetTiers.map((tier) => (
                      <span className={cn('rounded-lg px-3 py-1 text-xs font-medium leading-4 text-on-surface', tierClasses[tier])} key={tier}>
                        {tier}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-medium leading-4 text-on-surface">{promotion.value}</td>
                <td className="px-4 py-4 text-sm leading-5 text-on-surface-variant">{promotion.dateRange}</td>
                <td className="min-w-36 px-4 py-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium leading-4 text-on-surface">
                      {promotion.usage.current}/{promotion.usage.total}
                    </span>
                    <span className="text-[11px] leading-4 text-on-surface-variant">{promotion.usage.percent}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-container">
                    <div
                      className={cn('h-full rounded-full', promotion.status === 'active' ? 'bg-primary' : 'bg-success')}
                      style={{ width: `${promotion.usage.percent}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={cn(
                      'inline-flex h-5 w-10 items-center rounded-full p-0.5 transition-colors',
                      promotion.status === 'active' ? 'bg-primary' : 'bg-outline-variant',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-4 place-items-center rounded-full bg-white transition-transform',
                        promotion.status === 'active' && 'translate-x-5',
                      )}
                    >
                      {promotion.status === 'active' && <Check className="text-primary" size={12} />}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    className={cn(
                      'inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10',
                      promotion.actionDisabled && 'cursor-not-allowed text-outline hover:bg-transparent',
                    )}
                    disabled={promotion.actionDisabled}
                    title="Gửi ngay"
                    type="button"
                    onClick={() => onSendPromotion(promotion)}
                  >
                    {promotion.actionDisabled ? <SendHorizontal size={20} /> : <Send size={20} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
