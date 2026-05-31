import { CalendarClock, MoreVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function UpcomingAppointment() {
  return (
    <section className="col-span-12">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-medium leading-7 text-on-surface">Lịch hẹn sắp tới</h3>
        <a className="text-sm font-medium leading-4 text-primary hover:underline" href="#appointments">
          Xem tất cả
        </a>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-between gap-6 p-6 md:flex-row">
          <div className="flex w-full items-center gap-6 md:w-auto">
            <span className="grid size-16 place-items-center rounded-xl bg-surface-container text-primary">
              <CalendarClock aria-hidden="true" size={32} />
            </span>
            <div>
              <p className="text-xl font-medium leading-7 text-on-surface">51G-123.45</p>
              <p className="text-base leading-6 text-on-surface-variant">Rửa xe cao cấp • Gói Nano Coating</p>
            </div>
          </div>

          <div className="w-full md:w-auto md:text-right">
            <p className="text-lg font-medium leading-7 text-on-surface">14:30, 25/10/2023</p>
            <p className="text-sm leading-5 text-on-surface-variant">Chi nhánh Quận 7, TP.HCM</p>
          </div>

          <div className="flex w-full items-center gap-4 border-t border-outline-variant pt-4 md:w-auto md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <span className="rounded-lg border border-success/20 bg-success/10 px-4 py-2 text-sm font-medium uppercase leading-4 text-success">
              Confirmed
            </span>
            <button className="text-on-surface-variant hover:text-primary" type="button" aria-label="Tùy chọn">
              <MoreVertical size={22} />
            </button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
