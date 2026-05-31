import { CarFront } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MembershipCard() {
  return (
    <section className="lg:col-span-8">
      <div className="relative flex h-full min-h-[292px] flex-col justify-between overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
        <CarFront className="absolute bottom-6 right-6 opacity-20" size={120} />

        <div className="relative">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <span className="mb-3 inline-block rounded-lg bg-tier-gold px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#2f1400]">
                Gold Member
              </span>
              <h2 className="text-[32px] font-medium leading-10">Tình trạng thành viên</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium leading-4 text-white/80">Điểm hiện tại</p>
              <p className="text-2xl font-medium leading-8">1,240 điểm</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-sm font-medium leading-4">Tiến trình hạng tiếp theo</span>
              <span className="text-sm font-medium leading-4 text-tier-gold">còn 760 điểm → Platinum</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/20">
              <div className="h-3 w-[62%] rounded-full bg-tier-gold" />
            </div>
          </div>
        </div>

        <div className="relative mt-8 flex flex-wrap gap-4">
          <Button className="bg-white px-6 text-primary hover:bg-surface-container-low" type="button">
            Xem quyền lợi hạng Gold
          </Button>
          <Button
            className="border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
            type="button"
            variant="outline"
          >
            Đổi quà
          </Button>
        </div>
      </div>
    </section>
  )
}
