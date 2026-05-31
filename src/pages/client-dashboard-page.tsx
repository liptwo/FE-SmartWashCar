import { ClientSidebar } from '@/components/dashboard/client-sidebar'
import { ClientTopbar } from '@/components/dashboard/client-topbar'
import { MembershipCard } from '@/components/dashboard/membership-card'
import { PromotionsSection } from '@/components/dashboard/promotions-section'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { UpcomingAppointment } from '@/components/dashboard/upcoming-appointment'

export function ClientDashboardPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <ClientSidebar />
      <ClientTopbar />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-12 gap-6">
          <MembershipCard />
          <QuickActions />
          <UpcomingAppointment />
          <PromotionsSection />
        </div>
      </main>
    </div>
  )
}
