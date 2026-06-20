import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { AdminPromotionShell } from '@/features/admin/components/admin-promotion-shell'
import { ConfirmSendModal, CreatePromotionDrawer } from '@/features/admin/components/promotion-dialogs'
import { PromotionStats } from '@/features/admin/components/promotion-stats'
import { PromotionTable } from '@/features/admin/components/promotion-table'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

const filterTabs = ['Tất cả', 'Đang chạy', 'Hết hạn']

export function AdminPromotionsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null)
  
  // Quản lý trạng thái tab đang active
  const [activeTab, setActiveTab] = useState<number>(0)

  // STATE LƯU TRỮ: Danh sách chương trình khuyến mãi thực tế từ Database
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // =========================================================================
  // ĐỒNG BỘ API + THUẬT TOÁN SẮP XẾP MỚI NHẤT & GỘP TRÙNG THEO TÊN THÔNG MINH
  // =========================================================================
  const fetchPromotions = async () => {
    setLoading(true)
    try {
      let url = 'http://localhost:8080/api/admin/promotions'
      
      const statusMap = ['ALL', 'ACTIVE', 'EXPIRED']
      const paramStatus = statusMap[activeTab]
      
      if (paramStatus && paramStatus !== 'ALL') {
        url += `?status=${paramStatus}`
      }

      const token = localStorage.getItem('accessToken')

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        
        const mappedData = data.map((item: any) => {
          let finalTiers: string[] = []
          if (Array.isArray(item.targetTiers)) {
            finalTiers = item.targetTiers
          } else if (typeof item.targetTiers === 'string' && item.targetTiers.trim() !== '') {
            finalTiers = item.targetTiers.includes(',')
              ? item.targetTiers.split(',').map((t: string) => t.trim())
              : [item.targetTiers.trim()]
          } else {
            finalTiers = ['ALL']
          }

          const currentCount = item.usageCount !== undefined ? item.usageCount : 0
          const limitCount = item.usageLimit !== undefined ? item.usageLimit : 100
          
          // Nhận diện cả trường 'active' (Lombok sinh ra) lẫn 'isActive' gửi từ DB
          const isPromoActive = 
            item.active === true || 
            String(item.active) === 'true' || 
            item.isActive === true || 
            String(item.isActive) === 'true'

          return {
            ...item,
            id: item.promoId || item.promoid || item.id || `PROMO-${item.name}`,
            targetTiers: finalTiers,
            isActive: isPromoActive,
            status: isPromoActive ? 'ACTIVE' : 'EXPIRED',
            type: item.promoType || item.type || 'DISCOUNT',
            usage: {
              current: currentCount,
              limit: limitCount
            },
            usageLimit: limitCount,
            usageCount: currentCount,
            // 🌟 Ép kiểu thời gian an toàn để phục vụ sắp xếp thứ tự hiển thị
            createdAt: item.createdAt || new Date().toISOString()
          }
        })

        // 🌟 BƯỚC 1: SẮP XẾP DANH SÁCH THEO THỜI GIAN TẠO (CREATED_AT) MỚI NHẤT LÊN ĐẦU
        const sortedData = mappedData.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

        // 🌟 BƯỚC 2: GỘP TRÙNG THEO TÊN
        // Vì bản ghi có thời gian mới nhất (hoặc vừa tạo) đã được đẩy lên đầu mảng ở Bước 1,
        // nên findIndex chắc chắn sẽ giữ lại bản ghi chuẩn này và loại bỏ bản ghi cũ mang tên trùng.
        const uniqueData = sortedData.filter(
          (value: any, index: number, self: any[]) =>
            self.findIndex((t: any) => t.name === value.name) === index
        )

        setPromotions(uniqueData)
      }
    } catch (error) {
      console.error('Lỗi khi fetch danh sách khuyến mãi:', error)
    } finally {
      setLoading(false)
    }
  }

  // =========================================================================
  // XỬ LÝ LẬT TRẠNG THÁI TOGGLE SWITCH (OPTIMISTIC UPDATE)
  // =========================================================================
  const handleToggleStatus = async (id: string) => {
    const token = localStorage.getItem('accessToken')
    console.log("=== TOKEN ĐANG GỬI ĐI LÀ ===", token)

    // Thực hiện lật trạng thái ngay tại UI để giữ Switch đứng im
    setPromotions((prevPromotions) =>
      prevPromotions.map((promo) =>
        promo.id === id
          ? {
              ...promo,
              isActive: !promo.isActive,
              active: !promo.isActive,
              status: !promo.isActive ? 'ACTIVE' : 'EXPIRED',
            }
          : promo
      )
    )

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`http://localhost:8080/api/admin/promotions/${id}/toggle`, {
        method: 'PATCH',
        headers: headers,
      })

      if (!res.ok) {
        const errText = await res.text()
        alert(`Lỗi đổi trạng thái từ hệ thống: ${errText}`)
        fetchPromotions() // Chỉ gọi tải lại dữ liệu từ DB (Roll-back) khi thực sự có lỗi xảy ra
      }
    } catch (error) {
      console.error('Lỗi kết nối gạt switch trạng thái:', error)
      alert('Không thể kết nối đến máy chủ Backend. Đang khôi phục giao diện...')
      fetchPromotions()
    }
  }

  // Tự động gọi lại API nạp dữ liệu mỗi khi Admin nhấn chuyển Tab lọc trạng thái
  useEffect(() => {
    fetchPromotions()
  }, [activeTab])

  return (
    <AdminPromotionShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-2xl font-medium leading-8 text-on-surface">Quản lý Khuyến mãi</h1>
            <p className="text-sm leading-5 text-on-surface-variant">
              Theo dõi và triển khai các chương trình ưu đãi cho từng phân khúc khách hàng.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-outline-variant bg-surface p-1">
              {filterTabs.map((tab, index) => (
                <button
                  className={cn(
                    'rounded-md px-4 py-2 text-xs font-medium leading-4 text-on-surface-variant hover:bg-surface-container transition-colors',
                    activeTab === index && 'bg-[#a4c9ff] text-primary font-bold',
                  )}
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(index)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Button className="gap-2 " type="button" onClick={() => setDrawerOpen(true)}>
              <Plus size={16} />
              Tạo promotion
            </Button>
          </div>
        </section>

        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-slate-400 animate-pulse bg-white border border-slate-200 rounded-2xl">
            Đang tải dữ liệu khuyến mãi từ hệ thống...
          </div>
        ) : (
          <PromotionTable 
            promotions={promotions} 
            onSendPromotion={setSelectedPromotion} 
            onToggleStatus={handleToggleStatus} 
          />
        )}

        <div className="mt-6">
          <PromotionStats promotions={promotions} />
        </div>
      </div>

      <Button
        className="fixed bottom-6 left-6 z-40 hidden h-12 w-56 gap-2 lg:inline-flex"
        type="button"
        onClick={() => setDrawerOpen(true)}
      >
        <Plus size={18} />
        Tạo promotion
      </Button>

      <ConfirmSendModal promotion={selectedPromotion} onClose={() => setSelectedPromotion(null)} />
      <CreatePromotionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSuccess={fetchPromotions}/>
    </AdminPromotionShell>
  )
}