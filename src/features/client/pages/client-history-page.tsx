import { useState, useEffect } from 'react'
import { Bike, ChevronRight, CalendarX, Car, Clock } from 'lucide-react'
import { ClientSidebar } from '@/features/client/components/client-sidebar'
import { ClientTopbar } from '@/features/client/components/client-topbar'
import { cn } from '@/shared/lib/utils'

export function ClientHistoryPage() {
  const [activeTab, setActiveTab] = useState('Tất cả')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const tabs = ['Tất cả', 'Sắp tới', 'Hoàn thành', 'Đã hủy']

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <ClientSidebar />
      <ClientTopbar title="Lịch sử đặt lịch" />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-[1280px]">
          {/* Tab Filter Row */}
          <div className="mb-8 flex w-fit items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'rounded-lg px-6 py-2 text-sm font-medium transition-all',
                  activeTab === tab
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Booking List */}
          {activeTab !== 'Đã hủy' && (
            <div className="space-y-4">
              {/* Card: Upcoming */}
              <div
                className={cn(
                  'flex items-center justify-between rounded-xl border border-outline-variant bg-surface p-6 transition-all hover:shadow-md',
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                )}
                style={{ transitionDelay: '0ms', transitionDuration: '400ms' }}
              >
                <div className="flex items-center gap-6">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                    <Bike size={32} />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-on-surface">51G-123.45</h3>
                      <span className="rounded-full bg-[#3B6D11]/10 px-3 py-1 text-xs font-bold text-[#3B6D11]">
                        CONFIRMED
                      </span>
                    </div>
                    <p className="mb-1 text-sm font-medium text-on-surface-variant">Rửa xe cao cấp</p>
                    <div className="flex items-center gap-2 text-secondary">
                      <Clock size={18} />
                      <span className="text-sm">14:30, 25/10/2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="rounded-lg border border-danger px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/5">
                    Hủy lịch
                  </button>
                  <button className="flex size-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container-low">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Card: In Progress */}
              <div
                className={cn(
                  'flex items-center justify-between rounded-xl border border-outline-variant bg-surface p-6 transition-all hover:shadow-md',
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                )}
                style={{ transitionDelay: '100ms', transitionDuration: '400ms' }}
              >
                <div className="flex items-center gap-6">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                    <Bike size={32} />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-on-surface">59A-999.99</h3>
                      <span className="rounded-full bg-[#185FA5]/10 px-3 py-1 text-xs font-bold text-[#185FA5]">
                        IN_PROGRESS
                      </span>
                    </div>
                    <p className="mb-1 text-sm font-medium text-on-surface-variant">Chăm sóc động cơ chuyên sâu</p>
                    <div className="flex items-center gap-2 text-secondary">
                      <Clock size={18} />
                      <span className="text-sm">09:15, 24/10/2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex size-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container-low">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Card: Done */}
              <div
                className={cn(
                  'flex items-center justify-between rounded-xl border border-outline-variant bg-surface p-6 opacity-80 transition-all hover:shadow-md',
                  mounted ? 'translate-y-0' : 'translate-y-2'
                )}
                style={{ transitionDelay: '200ms', transitionDuration: '400ms' }}
              >
                <div className="flex items-center gap-6">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-surface-container-high text-secondary">
                    <Bike size={32} />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-on-surface">62B-888.88</h3>
                      <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                        DONE
                      </span>
                    </div>
                    <p className="mb-1 text-sm font-medium text-on-surface-variant">Thay nhớt định kỳ</p>
                    <div className="flex items-center gap-2 text-secondary">
                      <Clock size={18} />
                      <span className="text-sm">16:00, 20/10/2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex size-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container-low">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Card: Cancelled */}
              <div
                className={cn(
                  'flex items-center justify-between rounded-xl border border-outline-variant bg-surface p-6 opacity-60 transition-all hover:shadow-md',
                  mounted ? 'translate-y-0' : 'translate-y-2'
                )}
                style={{ transitionDelay: '300ms', transitionDuration: '400ms' }}
              >
                <div className="flex items-center gap-6">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-error-container text-danger">
                    <Bike size={32} />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-on-surface">51C-777.66</h3>
                      <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger">
                        CANCELLED
                      </span>
                    </div>
                    <p className="mb-1 text-sm font-medium text-on-surface-variant">Vệ sinh dàn nhựa</p>
                    <div className="flex items-center gap-2 text-secondary">
                      <Clock size={18} />
                      <span className="text-sm">11:30, 18/10/2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex size-10 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container-low">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State Container (Hidden by default) */}
          {activeTab === 'Đã hủy' && (
            <div className="mt-8 flex flex-col items-center justify-center py-24">
              <div className="mb-6 flex size-64 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low">
                <CalendarX className="size-20 text-outline-variant" strokeWidth={1} />
              </div>
              <h4 className="mb-2 text-xl font-semibold text-on-surface">Chưa có lịch hẹn</h4>
              <p className="max-w-xs text-center text-base text-secondary">
                Có vẻ như bạn chưa đặt bất kỳ dịch vụ nào. Hãy đặt lịch ngay để trải nghiệm dịch vụ của chúng tôi!
              </p>
              <button className="mt-8 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-on-primary transition-shadow hover:shadow-lg">
                Đặt lịch ngay
              </button>
            </div>
          )}

          {/* Illustration for visual depth (Optional enhancement) */}
          <div className="relative mt-12 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-info p-8">
            <div className="relative z-10 max-w-md">
              <h3 className="mb-2 text-xl font-semibold text-white">Trở thành thành viên Vàng</h3>
              <p className="mb-6 text-base text-white/90">
                Nhận thêm 5% ưu đãi cho tất cả các lần đặt lịch tiếp theo và ưu tiên phục vụ tại cửa hàng.
              </p>
              <button className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-primary transition-all hover:bg-opacity-90">
                Khám phá đặc quyền
              </button>
            </div>
            {/* Abstract car silhouette / pattern */}
            <div className="absolute -bottom-5 -right-10 rotate-[-12deg] opacity-20">
              <Car className="size-[240px] text-white" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
