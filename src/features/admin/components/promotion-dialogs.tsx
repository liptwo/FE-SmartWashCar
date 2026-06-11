import { Send, X, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { AdminPromotion } from '@/features/admin/data/admin-promotions'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'

type ConfirmSendModalProps = {
  onClose: () => void
  promotion: AdminPromotion | null
}

export function ConfirmSendModal({ onClose, promotion }: ConfirmSendModalProps) {
  if (!promotion) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Send size={28} />
          </span>
          <div>
            <h3 className="text-xl font-medium leading-7 text-on-surface">Xác nhận gửi ưu đãi</h3>
            <p className="text-sm leading-5 text-on-surface-variant">Hành động này không thể hoàn tác.</p>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-surface-container-low p-4">
          <div className="mb-2 flex justify-between gap-4">
            <span className="text-xs leading-4 text-on-surface-variant">Chương trình:</span>
            <span className="text-right text-xs font-medium leading-4 text-on-surface">{promotion.name}</span>
          </div>
          <div className="mb-2 flex justify-between gap-4">
            <span className="text-xs leading-4 text-on-surface-variant">Đối tượng (Tier):</span>
            <span className="text-right text-xs font-medium leading-4 text-primary">
              {promotion.targetTiers.join(', ')}
            </span>
          </div>
          <div className="mt-2 flex justify-between gap-4 border-t border-outline-variant pt-2">
            <span className="text-xs leading-4 text-on-surface-variant">Tổng số khách hàng:</span>
            <span className="text-xs font-medium leading-4 text-on-surface">
              {promotion.code === 'PROMO-001' ? '120' : '450'} khách hàng
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button className="flex-1" type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button className="flex-1" type="button" onClick={onClose}>
            Gửi ngay tới khách hàng
          </Button>
        </div>
      </div>
    </div>
  )
}

type CreatePromotionDrawerProps = {
  onClose: () => void
  open: boolean
}

export function CreatePromotionDrawer({ onClose, open }: CreatePromotionDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
            onClick={onClose}
          />

          {/* Sliding Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[450px] flex-col border-l border-outline-variant bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface px-6 py-6">
              <div>
                <h3 className="text-xl font-medium leading-7 text-on-surface">Tạo Promotion Mới</h3>
                <p className="text-sm leading-5 text-on-surface-variant">Nhập thông tin chi tiết chương trình</p>
              </div>
              <Button aria-label="Đóng" size="icon" type="button" variant="ghost" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>

            <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
              <label className="grid gap-3 text-sm font-medium leading-4 text-on-surface">
                Tên chương trình *
                <Input placeholder="VD: Giảm giá ngày cuối tuần" type="text" />
              </label>

              <label className="grid gap-3 text-sm font-medium leading-4 text-on-surface">
                Loại khuyến mãi
                <div className="relative">
                  <select className="h-12 w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                    <option value="DISCOUNT">DISCOUNT (Giảm %)</option>
                    <option value="BONUS_POINTS">BONUS_POINTS (Tặng điểm)</option>
                    <option value="FREE_WASH">FREE_WASH (Rửa xe miễn phí)</option>
                    <option value="ADD_ON">ADD_ON (Tặng dịch vụ đi kèm)</option>
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-on-surface-variant" />
                </div>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-3 text-sm font-medium leading-4 text-on-surface">
                  Giá trị
                  <div className="relative">
                    <Input placeholder="20" type="number" className="pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-variant">%</span>
                  </div>
                </label>
                <label className="grid gap-3 text-sm font-medium leading-4 text-on-surface">
                  Giới hạn lượt
                  <Input placeholder="-5" type="number" />
                </label>
              </div>

              <div className="grid gap-3">
                <span className="text-sm font-medium leading-4 text-on-surface">Target Tiers (Đối tượng)</span>
                <div className="grid grid-cols-2 gap-3">
                  {['MEMBER', 'SILVER', 'GOLD', 'PLATINUM'].map((tier) => (
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant p-3 hover:bg-surface-container" key={tier}>
                      <input className="size-4 accent-primary" type="checkbox" />
                      <span className="text-xs font-medium leading-4">{tier}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-3 text-sm font-medium leading-4 text-on-surface">
                  Ngày bắt đầu
                  <Input type="date" />
                </label>
                <label className="grid gap-3 text-sm font-medium leading-4 text-on-surface">
                  Ngày kết thúc
                  <Input type="date" />
                </label>
              </div>

              <div className="flex gap-3 rounded-lg border border-info/10 bg-info/5 p-4 text-xs leading-5 text-on-surface-variant">
                <Info className="size-4 shrink-0 text-info mt-0.5" />
                <span>Chương trình sau khi lưu có thể được gửi notification trực tiếp tới khách hàng thuộc tier đã chọn.</span>
              </div>
            </div>

            <div className="flex gap-4 border-t border-outline-variant p-6">
              <Button className="flex-1" type="button" variant="outline" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button className="flex-1" type="button" onClick={onClose}>
                Lưu chương trình
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
