import { useState } from 'react';
import { 
  Search, Download, Plus, Mail, Phone, Calendar, 
  MapPin, Eye, ChevronLeft, ChevronRight, X, CreditCard, Car
} from 'lucide-react';
import { AdminSidebar } from '@/features/admin/components/admin-sidebar'
import { AdminTopbar } from '@/features/admin/components/admin-topbar'

// --- MOCK DATA ---
const mockCustomers = [
  { id: 1, name: "Alex Nguyen", email: "alex.n@example.com", phone: "090 123 4567", tier: "GOLD", points: "2,450", washes: 18, lastActive: "Hôm qua, 14:30", avatar: "AN" },
  { id: 2, name: "Trần Minh", email: "minhtran@outlook.com", phone: "091 888 9999", tier: "PLATINUM", points: "8,120", washes: 42, lastActive: "12/10/2023", avatar: "TM" },
  { id: 3, name: "Lê Hồng", email: "hongle.car@gmail.com", phone: "098 765 4321", tier: "MEMBER", points: "150", washes: 2, lastActive: "05/10/2023", avatar: "LH" },
];

export function AdminCustomerPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedTierFilter, setSelectedTierFilter] = useState<{ [key: string]: boolean }>({
    MEMBER: true, SILVER: true, GOLD: true, PLATINUM: true
  });
  
  // 🛠️ THÊM STATE ĐỂ QUẢN LÝ TÌM KIẾM VÀ TABS CHI TIẾT CHẠY REAL-TIME
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'vehicles' | 'history'>('info');

  // Tìm thông tin khách hàng đang được chọn để xem chi tiết
  const currentCustomer = mockCustomers.find(c => c.id === selectedCustomerId);

  // 🛠️ LOGIC BỘ LỌC CHẠY TỰ ĐỘNG KHÔNG CẦN BACKEND
  const filteredCustomers = mockCustomers.filter(customer => {
    // 1. Kiểm tra theo ô tìm kiếm (Không phân biệt hoa thường)
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.replace(/\s+/g, '').includes(searchQuery.replace(/\s+/g, ''));
    
    // 2. Kiểm tra theo Checkbox trạng thái thẻ đang tích chọn
    const matchesTier = selectedTierFilter[customer.tier] === true;

    return matchesSearch && matchesTier;
  });

  return (
    <div className="min-h-screen bg-background text-on-surface relative overflow-hidden">
      <AdminSidebar activeItem="customers" />
      <AdminTopbar
        searchPlaceholder="Tìm kiếm khách hàng..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={null}
      />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý khách hàng</h1>
          <p className="text-sm text-slate-500">
            Hiển thị: <span className="font-semibold text-blue-900">{filteredCustomers.length}</span> / {mockCustomers.length} khách hàng mẫu
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            <Download className="w-4 h-4" /> Xuất báo cáo
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition">
            <Plus className="w-4 h-4" /> Thêm khách hàng
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 min-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc số điện thoại..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // 🛠️ Cập nhật ký tự tìm kiếm ngay khi gõ
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="font-medium text-slate-500">Hạng thẻ:</span>
          {Object.keys(selectedTierFilter).map((tier) => (
            <label key={tier} className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={selectedTierFilter[tier]}
                onChange={(e) => setSelectedTierFilter({...selectedTierFilter, [tier]: e.target.checked})}
                className="rounded border-slate-300 text-blue-900 focus:ring-blue-900 w-4 h-4"
              />
              <span className="text-xs font-semibold">{tier}</span>
            </label>
          ))}
        </div>
      </div>

      {/* BULK ACTIONS BANNER */}
      <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex justify-between items-center mb-4">
        <span className="text-sm text-blue-900 font-medium">1 mục đã chọn</span>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white border border-blue-200 text-blue-900 rounded-md text-xs font-medium hover:bg-blue-100 transition">
            &gt; Gửi thông báo
          </button>
          <button className="px-3 py-1.5 bg-white border border-blue-200 text-blue-900 rounded-md text-xs font-medium hover:bg-blue-100 transition">
            Export file CSV
          </button>
        </div>
      </div>

      {/* CUSTOMERS DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300" defaultChecked /></th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Số điện thoại</th>
              <th className="p-4">Hạng</th>
              <th className="p-4">Điểm</th>
              <th className="p-4 text-center">Số lần rửa</th>
              <th className="p-4">Lần cuối</th>
              <th className="p-4 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className={`hover:bg-slate-50 transition ${selectedCustomerId === customer.id ? 'bg-blue-50/50' : ''}`}>
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300" 
                      checked={selectedCustomerId === customer.id} 
                      onChange={() => {
                        setSelectedCustomerId(selectedCustomerId === customer.id ? null : customer.id);
                        setActiveTab('info'); // Reset tab khi đổi khách hàng
                      }} 
                    />
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
                      {customer.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{customer.name}</p>
                      <p className="text-xs text-slate-400">{customer.email}</p>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{customer.phone}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      customer.tier === 'GOLD' ? 'bg-amber-100 text-amber-700' :
                      customer.tier === 'PLATINUM' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {customer.tier}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{customer.points}</td>
                  <td className="p-4 text-center font-medium">{customer.washes}</td>
                  <td className="p-4 text-slate-500">{customer.lastActive}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => {
                        setSelectedCustomerId(customer.id);
                        setActiveTab('info');
                      }}
                      className={`p-1.5 rounded-lg transition ${selectedCustomerId === customer.id ? 'bg-blue-900 text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400 font-medium">
                  ❌ Không tìm thấy kết quả phù hợp với bộ lọc!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Hiển thị 1 - {filteredCustomers.length} trên 1,284 khách hàng</span>
          <div className="flex items-center gap-1">
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-2.5 py-1 bg-blue-900 text-white font-medium rounded">1</button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50">3</button>
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* --- SIDE DETAILS DRAWER (A-03 CHI TIẾT KHÁCH HÀNG) --- */}
      {selectedCustomerId && currentCustomer && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40" onClick={() => setSelectedCustomerId(null)} />
          
          {/* 🛠️ SỬA LỖI LAYOUT TRƯỢT MƯỢT MÀ CHỖ w-96 HOẶC w-112 */}
          <div className="fixed right-0 top-0 h-full w-112 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 relative">
              <button 
                onClick={() => setSelectedCustomerId(null)}
                className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mt-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xl relative">
                  {currentCustomer.avatar}
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{currentCustomer.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {currentCustomer.tier} MEMBER
                    </span>
                    <span className="text-xs text-slate-400">• {currentCustomer.points} điểm tích lũy</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-medium text-sm transition shadow-sm">
                  Đặt lịch mới
                </button>
                <button className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                  •••
                </button>
              </div>
            </div>

            {/* Sub-Tabs Navigation (Bấm đổi tab kích hoạt đổi giao diện dưới) */}
            <div className="px-6 border-b border-slate-100 flex gap-4 text-sm font-medium text-slate-400">
              <button 
                onClick={() => setActiveTab('info')}
                className={`py-3 transition-all ${activeTab === 'info' ? 'text-blue-900 border-b-2 border-blue-900 font-semibold' : 'hover:text-slate-600'}`}
              >
                Thông tin
              </button>
              <button 
                onClick={() => setActiveTab('vehicles')}
                className={`py-3 transition-all ${activeTab === 'vehicles' ? 'text-blue-900 border-b-2 border-blue-900 font-semibold' : 'hover:text-slate-600'}`}
              >
                Xe <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full text-xs ml-0.5">2</span>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`py-3 transition-all ${activeTab === 'history' ? 'text-blue-900 border-b-2 border-blue-900 font-semibold' : 'hover:text-slate-600'}`}
              >
                Lịch sử rửa
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              
              {/* 🛠️ TAB 1: HIỂN THỊ THÔNG TIN CHI TIẾT */}
              {activeTab === 'info' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Chi tiết cá nhân</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Mail className="w-3.5 h-3.5" /> Email</p>
                        <p className="font-medium text-slate-700 truncate">{currentCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Phone className="w-3.5 h-3.5" /> Số điện thoại</p>
                        <p className="font-medium text-slate-700">{currentCustomer.phone}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Calendar className="w-3.5 h-3.5" /> Ngày sinh</p>
                        <p className="font-medium text-slate-700">15/05/1992</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Calendar className="w-3.5 h-3.5" /> Ngày tham gia</p>
                        <p className="font-medium text-slate-700">20/01/2023</p>
                      </div>
                      <div className="col-span-2 border-t border-slate-100 pt-3 mt-1">
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><MapPin className="w-3.5 h-3.5" /> Địa chỉ</p>
                        <p className="font-medium text-slate-700 text-xs leading-relaxed">123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                      <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><CreditCard className="w-3.5 h-3.5" /> Tổng chi tiêu</p>
                      <p className="text-xl font-bold text-blue-900">12.5M</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                      <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Car className="w-3.5 h-3.5" /> Wash rate</p>
                      <p className="text-xl font-bold text-green-600">1.5 / tháng</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 🛠️ TAB 2: HIỂN THỊ PHƯƠNG TIỆN */}
              {activeTab === 'vehicles' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phương tiện đang sử dụng</h4>
                  </div>
                  
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs flex justify-between items-center hover:border-slate-300 cursor-pointer transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Car className="w-5 h-5" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">51G-123.45</p>
                        <p className="text-xs text-slate-400">Mercedes-Benz C200 • Black</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs flex justify-between items-center hover:border-slate-300 cursor-pointer transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Car className="w-5 h-5" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">51K-888.88</p>
                        <p className="text-xs text-slate-400">Toyota Camry • Silver</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              )}

              {/* 🛠️ TAB 3: HIỂN THỊ LỊCH SỬ RỬA XE GIẢ ĐỊNH */}
              {activeTab === 'history' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lịch sử dịch vụ gần đây</h4>
                  <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700">Gói Combo Rửa Premium</span>
                      <span className="text-green-600 font-semibold">Hoàn thành</span>
                    </div>
                    <p className="text-xs text-slate-400">Biển số: 51G-123.45 • 28/05/2026</p>
                    <div className="border-t border-dashed my-2"></div>
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700">Dịch vụ Vệ sinh Nội thất</span>
                      <span className="text-green-600 font-semibold">Hoàn thành</span>
                    </div>
                    <p className="text-xs text-slate-400">Biển số: 51G-123.45 • 10/05/2026</p>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
              <button className="py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                Vô hiệu hóa
              </button>
              <button className="py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'/><path d='M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z'/></svg>" alt="" /> Ghi chú
              </button>
            </div>

          </div>
        </>
      )}
        </div>
      </main>
    </div>
  );
}