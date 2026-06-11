import { useState } from 'react'
import { Gift, Layers, Percent } from 'lucide-react'
import { ClientSidebar } from '@/features/client/components/client-sidebar'
import { ClientTopbar } from '@/features/client/components/client-topbar'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'

export default function ClientPromotionsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'used'>('active')

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <ClientSidebar />
      <ClientTopbar title="Khuyến mãi của bạn" />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-[1280px]">
          {/* Tabs */}
          <div className="mt-6 flex gap-6 border-b border-outline-variant">
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                'px-2 pb-4 text-sm font-medium transition-all',
                activeTab === 'active'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              Đang có
            </button>
            <button
              onClick={() => setActiveTab('used')}
              className={cn(
                'px-2 pb-4 text-sm font-medium transition-all',
                activeTab === 'used'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              Đã dùng
            </button>
          </div>

          {/* Promo Content */}
          {activeTab === 'active' && (
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Discount Card (Amber) */}
                <Card className="relative flex h-full flex-col overflow-hidden bg-[#FFFBEB] p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="rounded-lg bg-white/50 p-2">
                      <Percent className="text-warning" size={24} />
                    </div>
                    <Badge variant="gold">GOLD+</Badge>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-on-surface">Giảm 20% gói Premium</h3>
                  <p className="mb-4 flex-grow text-sm text-on-surface-variant">
                    Áp dụng cho lần rửa tiếp theo
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4">
                    <span className="text-xs text-on-surface-variant">Hạn dùng: 31/12/2023</span>
                    <Button variant="default" className="bg-primary text-on-primary hover:bg-info">
                      Dùng ngay
                    </Button>
                  </div>
                </Card>

                {/* Free Wash Card (Green) */}
                <Card className="relative flex h-full flex-col overflow-hidden bg-[#F0FDF4] p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="rounded-lg bg-white/50 p-2">
                      <Gift className="text-success" size={24} />
                    </div>
                    <Badge variant="member">MEMBER+</Badge>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-on-surface">Miễn phí rửa xe</h3>
                  <p className="mb-4 flex-grow text-sm text-on-surface-variant">
                    Thưởng đặc biệt mừng sinh nhật
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4">
                    <span className="text-xs text-on-surface-variant">Hạn dùng: 15/11/2023</span>
                    <Button variant="default" className="bg-primary text-on-primary hover:bg-info">
                      Dùng ngay
                    </Button>
                  </div>
                </Card>

                {/* Add-on Card (Blue) */}
                <Card className="relative flex h-full flex-col overflow-hidden bg-[#EFF6FF] p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="rounded-lg bg-white/50 p-2">
                      <Layers className="text-info" size={24} />
                    </div>
                    <Badge variant="silver">SILVER+</Badge>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-on-surface">Tặng phủ Nano</h3>
                  <p className="mb-4 flex-grow text-sm text-on-surface-variant">
                    Nâng cấp dịch vụ miễn phí
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4">
                    <span className="text-xs text-on-surface-variant">Hạn dùng: 20/11/2023</span>
                    <Button variant="default" className="bg-primary text-on-primary hover:bg-info">
                      Dùng ngay
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'used' && (
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Grayscale Used Card */}
                <Card className="relative flex h-full flex-col overflow-hidden bg-surface-container-low p-4 grayscale">
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <div className="border-4 border-secondary px-4 py-2 text-2xl font-bold uppercase text-secondary" style={{ transform: 'rotate(-15deg)' }}>
                      Đã dùng
                    </div>
                  </div>
                  <div className="mb-3 flex items-start justify-between opacity-50">
                    <div className="rounded-lg bg-white/50 p-2">
                      <Percent className="text-secondary" size={24} />
                    </div>
                    <Badge variant="platinum">PLATINUM</Badge>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-secondary">Giảm 50% Combo Thu</h3>
                  <p className="mb-4 flex-grow text-sm text-secondary opacity-70">
                    Áp dụng cho gói vệ sinh nội thất
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4 opacity-50">
                    <span className="text-xs text-secondary">Hết hạn: 01/10/2023</span>
                    <Button
                      variant="secondary"
                      className="cursor-not-allowed text-secondary bg-secondary-container hover:bg-secondary-container"
                      disabled
                    >
                      Đã dùng
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Empty State Section */}
          <section className="mx-auto mt-24 flex max-w-2xl flex-col items-center rounded-xl border border-outline-variant bg-surface py-6 text-center shadow-sm lg:py-8">
            <div className="mb-6 h-48 w-48">
              <img
                alt="Gift box illustration"
                className="h-full w-full rounded-lg object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0s0mldjCHn8JL7XO5Vx56HF-3XoRfrcMxqHwjyHmIm7jM_AbpZ8PijdTfGHYbYWjoZRxGAascKz2N-JsS5tMpKP8W1AWGRur60eWfJbTQPzG8Z3lCv9pV6OPLXwAO6AFx2UkMWRKGdyiucJQ17De86KRJcRp-coLnsUw0xfwL4SZyy90Wb34_eGcfpqYAzSGgiXuvafqpH8hZGAoLQ_ryZeDIfBAagfSStOGCC4Iac7lthR1NP0mhU5gVF_j7fpgRa4KsVeXKNuE"
              />
            </div>
            <h3 className="mb-3 text-2xl font-medium text-on-surface">Chưa có ưu đãi nào</h3>
            <p className="mb-6 px-6 text-base text-on-surface-variant">
              Hãy tích thêm điểm để nâng hạng Tier và nhận ưu đãi độc quyền dành riêng cho bạn!
            </p>
            <Button size="lg" className="gap-2 px-6 h-11 bg-primary text-on-primary hover:opacity-90">
              <Gift size={20} />
              Xem bảng tích điểm
            </Button>
          </section>
        </div>
      </main>
    </div>
  )
}
