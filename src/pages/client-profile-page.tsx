import { useState, type ReactNode } from 'react'
import { Camera, Edit, LogOut, Phone } from 'lucide-react'
import { ClientSidebar } from '@/components/dashboard/client-sidebar'
import { ClientTopbar } from '@/components/dashboard/client-topbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const customer = {
  name: 'Alex Nguyen',
  initials: 'AN',
  phone: '090 123 4567',
  email: 'alex.nguyen@example.com',
  tier: 'Gold',
}

const personalFields = [
  { label: 'Họ và tên', value: customer.name },
  { label: 'Số điện thoại', value: customer.phone },
  { label: 'Email', value: customer.email },
]

const notificationSettings = [
  {
    title: 'Nhắc lịch hẹn',
    description: 'Nhận thông báo trước giờ rửa xe 30 phút',
    enabled: true,
  },
  {
    title: 'Điểm sắp hết hạn',
    description: 'Thông báo khi điểm thưởng chuẩn bị hết hạn',
    enabled: true,
  },
  {
    title: 'Khuyến mãi mới',
    description: 'Cập nhật các chương trình ưu đãi mới nhất',
    enabled: false,
  },
  {
    title: 'Nâng tier',
    description: 'Thông báo khi bạn đủ điều kiện thăng hạng',
    enabled: true,
  },
]

function ToggleSwitch({ defaultChecked }: { defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <button
      aria-pressed={checked}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
        checked ? 'bg-primary' : 'bg-surface-container',
      )}
      onClick={() => setChecked((value) => !value)}
      type="button"
    >
      <span
        className={cn(
          'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

function SectionCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <Card className="overflow-hidden rounded-lg">
      <div className="border-b border-outline-variant bg-surface-container-low px-5 py-4">
        <h3 className="text-sm font-medium uppercase leading-4 tracking-wide text-on-surface">{title}</h3>
      </div>
      {children}
    </Card>
  )
}

export function ClientProfilePage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <ClientSidebar />
      <ClientTopbar title="Hồ sơ" utility="settings" />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-[1280px] space-y-6">
          <Card className="flex flex-col gap-6 rounded-lg p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="grid size-24 place-items-center rounded-full border-4 border-surface-container bg-primary text-4xl font-bold text-primary-foreground shadow-md">
                  {customer.initials}
                </div>
                <button
                  aria-label="Cập nhật ảnh đại diện"
                  className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full border border-outline-variant bg-surface text-primary shadow-sm"
                  type="button"
                >
                  <Camera size={16} />
                </button>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-medium leading-8 text-on-background">{customer.name}</h1>
                  <span className="rounded-lg bg-tier-gold px-3 py-1 text-[10px] font-bold uppercase leading-4 tracking-widest text-[#2f1400]">
                    {customer.tier}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-base leading-6 text-on-surface-variant">
                  <Phone className="size-4 text-outline" />
                  {customer.phone}
                </p>
              </div>
            </div>

            <Button
              className="h-12 gap-3 border-primary px-6 text-primary hover:bg-primary/10 sm:self-center"
              type="button"
              variant="outline"
            >
              <Edit size={18} />
              Chỉnh sửa
            </Button>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Thông tin cá nhân">
              <div className="space-y-5 p-6">
                {personalFields.map((field) => (
                  <label className="block" key={field.label}>
                    <span className="mb-2 block text-sm font-medium leading-4 text-outline">{field.label}</span>
                    <span className="block rounded-lg border border-outline-variant bg-background px-4 py-3 text-base leading-6 text-on-surface">
                      {field.value}
                    </span>
                  </label>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Cài đặt thông báo">
              <div className="space-y-6 p-6">
                {notificationSettings.map((setting) => (
                  <div className="flex items-center justify-between gap-6" key={setting.title}>
                    <div>
                      <p className="text-base leading-6 text-on-surface">{setting.title}</p>
                      <p className="text-sm leading-5 text-outline">{setting.description}</p>
                    </div>
                    <ToggleSwitch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="flex justify-end border-t border-outline-variant pt-6">
            <Button
              className="h-12 gap-3 border-danger px-6 text-danger hover:bg-danger/10 hover:text-danger"
              type="button"
              variant="outline"
            >
              <LogOut size={18} />
              Đăng xuất
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
