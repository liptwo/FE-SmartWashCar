import { useState, useEffect } from 'react';
import { 
  Search, Download, Plus, Mail, Phone, Eye, X, CreditCard, Car
} from 'lucide-react';
import { AdminSidebar } from '@/features/admin/components/admin-sidebar'
import { AdminTopbar } from '@/features/admin/components/admin-topbar'

interface Vehicle {
  vehicleId: string;
  brand: string;
  color: string;
  licensePlate: string;
  vehicleType: string;
}

interface Booking {
  bookingId: string;
  serviceType: string;
  status: string;
  scheduledAt: string;
}

interface Customer {
  customerId: string;
  fullName: string;
  phone: string;
  email: string | null;
  tier: 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM';
  totalPoints: number;
  totalVisits: number;
  isActive: boolean;
  vehicles?: Vehicle[];
  bookings?: Booking[];
}

export function AdminCustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  const [selectedTierFilter, setSelectedTierFilter] = useState<{ [key: string]: boolean }>({
    MEMBER: true, SILVER: true, GOLD: true, PLATINUM: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'vehicles' | 'history'>('info');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await window.fetch('http://localhost:8080/api/admin/customers');
      const data = await res.json();
      
      const mappedData = data.map((item: any) => ({
        customerId: item.customerId || item.customer_id,
        fullName: item.fullName || item.full_name,
        phone: item.phone,
        email: item.email,
        tier: item.tier || 'MEMBER',
        totalPoints: item.totalPoints || item.total_points || 0,
        totalVisits: item.totalVisits || item.total_visits || 0,
        isActive: item.isActive !== undefined ? item.isActive : item.is_active,
        vehicles: item.vehicles || [],
        bookings: item.bookings || []
      }));
      
      setCustomers(mappedData);
    } catch (err) {
      console.error("Lỗi khi đồng bộ API từ AutoWash Backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const currentCustomer = customers.find(c => c.customerId === selectedCustomerId);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.replace(/\s+/g, '').includes(searchQuery.replace(/\s+/g, ''));
    
    const matchesTier = selectedTierFilter[customer.tier] === true;
    return matchesSearch && matchesTier;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-2">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium">Đang đồng bộ dữ liệu từ AutoWash Backend...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface relative overflow-hidden">
      <AdminSidebar activeItem="customers" />
      <AdminTopbar
        searchPlaceholder="Tìm kiếm khách hàng..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={null}
      />

      <main className="min-h-screen px-6 pb-8 pt-24 lg:pl-70">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Quản lý khách hàng</h1>
              <p className="text-sm text-slate-500">
                Hiển thị: <span className="font-semibold text-blue-900">{filteredCustomers.length}</span> / {customers.length} khách hàng hệ thống
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <span className="text-sm text-blue-900 font-medium">Hệ thống đồng bộ tự động</span>
            <div className="flex gap-2">
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
                  <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Số điện thoại</th>
                  <th className="p-4">Hạng</th>
                  <th className="p-4">Điểm</th>
                  <th className="p-4 text-center">Số lần rửa</th>
                  <th className="p-4 w-16">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.customerId} className={`hover:bg-slate-50 transition ${selectedCustomerId === customer.customerId ? 'bg-blue-50/50' : ''}`}>
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300" 
                          checked={selectedCustomerId === customer.customerId} 
                          onChange={() => {
                            setSelectedCustomerId(selectedCustomerId === customer.customerId ? null : customer.customerId);
                            setActiveTab('info');
                          }} 
                        />
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
                          {customer.fullName ? customer.fullName.substring(0, 2).toUpperCase() : 'KH'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{customer.fullName}</p>
                          <p className="text-xs text-slate-400">{customer.email || 'Chưa cập nhật'}</p>
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
                      <td className="p-4 font-semibold text-slate-700">{customer.totalPoints}</td>
                      <td className="p-4 text-center font-medium">{customer.totalVisits}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => {
                            setSelectedCustomerId(customer.customerId);
                            setActiveTab('info');
                          }}
                          className={`p-1.5 rounded-lg transition ${selectedCustomerId === customer.customerId ? 'bg-blue-900 text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-slate-400 font-medium">
                      ❌ Không tìm thấy kết quả phù hợp với bộ lọc hệ thống!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- SIDE DETAILS DRAWER --- */}
          {selectedCustomerId && currentCustomer && (
            <>
              <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40" onClick={() => setSelectedCustomerId(null)} />
              
              <div className="fixed right-0 top-0 h-full w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-200">
                
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
                      {currentCustomer.fullName ? currentCustomer.fullName.substring(0, 2).toUpperCase() : 'KH'}
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{currentCustomer.fullName}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {currentCustomer.tier} MEMBER
                        </span>
                        <span className="text-xs text-slate-400">• {currentCustomer.totalPoints} điểm tích lũy</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Tabs Navigation */}
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
                    Xe <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full text-xs ml-0.5">{currentCustomer.vehicles?.length || 0}</span>
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
                  
                  {/* TAB 1: THÔNG TIN CHI TIẾT */}
                  {activeTab === 'info' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Chi tiết cá nhân</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Mail className="w-3.5 h-3.5" /> Email</p>
                            <p className="font-medium text-slate-700 truncate">{currentCustomer.email || 'Chưa cập nhật'}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Phone className="w-3.5 h-3.5" /> Số điện thoại</p>
                            <p className="font-medium text-slate-700">{currentCustomer.phone}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Car className="w-3.5 h-3.5" /> Trạng thái</p>
                            <p className="font-medium text-slate-700">{currentCustomer.isActive ? 'Đang hoạt động' : 'Đang khóa'}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><CreditCard className="w-3.5 h-3.5" /> Số lần rửa</p>
                            <p className="font-medium text-slate-700">{currentCustomer.totalVisits} lần</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DANH SÁCH XE */}
                  {activeTab === 'vehicles' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phương tiện đang sử dụng</h4>
                      {currentCustomer.vehicles && currentCustomer.vehicles.length > 0 ? (
                        currentCustomer.vehicles.map((v) => (
                          <div key={v.vehicleId} className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs flex justify-between items-center hover:border-slate-300 transition">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Car className="w-5 h-5" /></div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{v.licensePlate}</p>
                                <p className="text-xs text-slate-400">{v.brand} • {v.color} ({v.vehicleType})</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-4">ℹ️ Khách hàng chưa đăng ký phương tiện nào.</p>
                      )}
                    </div>
                  )}

                  {/* TAB 3: LỊCH SỬ DỊCH VỤ */}
                  {activeTab === 'history' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lịch sử dịch vụ gần đây</h4>
                      {currentCustomer.bookings && currentCustomer.bookings.length > 0 ? (
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs space-y-4">
                          {currentCustomer.bookings.map((b) => (
                            <div key={b.bookingId} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="font-bold text-slate-700">{b.serviceType}</span>
                                <span className="text-green-600 font-semibold">{b.status}</span>
                              </div>
                              <p className="text-[11px] text-slate-400">Lịch hẹn: {new Date(b.scheduledAt).toLocaleString('vi-VN')}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-4">ℹ️ Khách hàng chưa có lịch sử đặt lịch nào.</p>
                      )}
                    </div>
                  )}

                </div>

                <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
                  <button className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                    Vô hiệu hóa tài khoản
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