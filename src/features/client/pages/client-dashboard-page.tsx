import { ClientSidebar } from '@/features/client/components/client-sidebar'
import { ClientTopbar } from '@/features/client/components/client-topbar'
import { MembershipCard } from '@/features/client/components/membership-card'
import { PromotionsSection } from '@/features/client/components/promotions-section'
import { QuickActions } from '@/features/client/components/quick-actions'
import { UpcomingAppointment } from '@/features/client/components/upcoming-appointment'

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
