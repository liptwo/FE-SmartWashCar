import { CalendarPlus, Car, CheckCircle2, MoreHorizontal, Plus, Star, Trash2 } from 'lucide-react'
import { ClientSidebar } from '@/components/dashboard/client-sidebar'
import { ClientTopbar } from '@/components/dashboard/client-topbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Vehicle = {
  color: string
  isDefault?: boolean
  lastWash: string
  make: string
  model: string
  packageName: string
  plate: string
  year: string
}

const vehicles: Vehicle[] = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: '2022',
    plate: '51F-123.45',
    color: 'Trắng ngọc trai',
    packageName: 'Rửa xe cao cấp',
    lastWash: '24/05/2026',
    isDefault: true,
  },
  {
    make: 'Honda',
    model: 'CR-V',
    year: '2021',
    plate: '51G-678.90',
    color: 'Đen ánh kim',
    packageName: 'Dọn nội thất',
    lastWash: '18/05/2026',
  },
  {
    make: 'VinFast',
    model: 'VF 8',
    year: '2024',
    plate: '51K-246.80',
    color: 'Xanh đại dương',
    packageName: 'Phủ ceramic',
    lastWash: '08/05/2026',
  },
]

const vehicleStats = [
  { label: 'Tổng số xe', value: vehicles.length.toString() },
  { label: 'Xe mặc định', value: 'Toyota Camry' },
  { label: 'Lần rửa gần nhất', value: '24/05/2026' },
]

function VehicleStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-lg p-5">
      <p className="text-sm font-medium leading-5 text-outline">{label}</p>
      <p className="mt-2 text-xl font-medium leading-7 text-on-surface">{value}</p>
    </Card>
  )
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="rounded-lg p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary-fixed text-primary">
            <Car size={32} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-medium leading-7 text-on-background">
                {vehicle.make} {vehicle.model}
              </h3>
              {vehicle.isDefault ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-tier-gold px-2.5 py-1 text-xs font-bold uppercase leading-4 tracking-wide text-[#2f1400]">
                  <Star className="size-3 fill-current" />
                  Mặc định
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-5 text-on-surface-variant">
              {vehicle.year} · {vehicle.color}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button className="gap-2 border-primary text-primary hover:bg-primary/10" type="button" variant="outline">
            <CalendarPlus size={16} />
            Đặt lịch
          </Button>
          <Button aria-label="Tùy chọn xe" size="icon" type="button" variant="ghost">
            <MoreHorizontal className="size-5 text-on-surface-variant" />
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-outline-variant pt-5 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase leading-4 tracking-wide text-outline">Biển số</p>
          <p className="mt-1 text-base font-medium leading-6 text-on-surface">{vehicle.plate}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase leading-4 tracking-wide text-outline">Gói gần nhất</p>
          <p className="mt-1 text-base leading-6 text-on-surface">{vehicle.packageName}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase leading-4 tracking-wide text-outline">Lần rửa gần nhất</p>
          <p className="mt-1 text-base leading-6 text-on-surface">{vehicle.lastWash}</p>
        </div>
      </div>
    </Card>
  )
}

export function ClientVehiclesPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <ClientSidebar />
      <ClientTopbar title="Xe của tôi" utility="settings" />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-[1280px] space-y-6">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-medium leading-8 text-on-background">Quản lý xe</h1>
              <p className="mt-1 text-base leading-6 text-on-surface-variant">
                Theo dõi phương tiện, biển số và lịch chăm sóc xe của bạn.
              </p>
            </div>
            <Button className="h-11 gap-2 px-5" type="button">
              <Plus size={18} />
              Thêm xe
            </Button>
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            {vehicleStats.map((stat) => (
              <VehicleStat key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>

          <section className="space-y-4">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.plate} vehicle={vehicle} />
            ))}
          </section>

          <Card className="flex flex-col gap-4 rounded-lg border-dashed p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-11 place-items-center rounded-lg bg-surface-container-low text-primary">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h2 className="text-base font-medium leading-6 text-on-surface">Thiết lập xe mặc định</h2>
                <p className="text-sm leading-5 text-on-surface-variant">
                  Xe mặc định sẽ được chọn sẵn khi bạn tạo lịch rửa mới.
                </p>
              </div>
            </div>
            <Button
              className={cn('h-10 gap-2 border-danger px-4 text-danger hover:bg-danger/10 hover:text-danger')}
              type="button"
              variant="outline"
            >
              <Trash2 size={16} />
              Xóa xe đã chọn
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
