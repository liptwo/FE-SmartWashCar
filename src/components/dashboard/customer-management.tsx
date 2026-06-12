import { useState, useEffect } from 'react';
import { 
  Search, Download, Plus, Mail, Phone, Calendar, 
  Eye, X, CreditCard, Car, RefreshCw
} from 'lucide-react';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU KHÁCH HÀNG TỪ BACKEND ---
interface Customer {
  customerId: string; 
  fullName: string;
  phone: string;
  email: string;
  tier: string;
  totalPoints: number;
  totalVisits: number;
  totalSpend: number;
  registeredAt: string;
  active: boolean | string; // Khớp 100% với thuộc tính 'active' của Spring Boot
}

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU XE ---
interface Vehicle {
  vehicleId: string;
  plateNumber: string;
  brand: string;
  model: string;
  color: string;
  vehicleType: string;
}

interface Booking {
  bookingId: string;
  plateNumber: string;
  serviceType?: string;
  totalPrice: number;
  status: string;
  scheduledAt: string;
}

export default function CustomerManagement() {
  // State lưu trữ danh sách thật từ API
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState<boolean>(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedTierFilter, setSelectedTierFilter] = useState<{ [key: string]: boolean }>({
    MEMBER: true, SILVER: true, GOLD: true, PLATINUM: true
  });
  
  // State quản lý tìm kiếm và tabs chi tiết
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'vehicles' | 'history'>('info');

  // State quản lý ẩn/hiện Modal thêm & sửa khách hàng
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
  
  // URL gốc của API Backend Spring Boot
  const API_BASE_URL = 'http://localhost:8080/api/admin/customers';

  // 🛠️ HÀM LẤY DANH SÁCH KHÁCH HÀNG TỪ BACKEND (GET)
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        console.error("Lỗi khi lấy danh sách khách hàng từ server");
      }
    } catch (error) {
      console.error("Không thể kết nối đến API Backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //  HÀM GỌI API LẤY DANH SÁCH XE THEO CUSTOMER ID
  const fetchCustomerVehicles = async (customerId: string) => {
    try {
      setIsLoadingVehicles(true);
      const response = await fetch(`${API_BASE_URL}/${customerId}/vehicles`);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu xe:", error);
      setVehicles([]);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const fetchCustomerHistory = async (customerId: string) => {
  try {
    setIsLoadingHistory(true);
    const response = await fetch(`http://localhost:8080/api/admin/customers/${customerId}/history`);
    if (response.ok) {
      const data = await response.json();
      setBookingHistory(data);
    } else {
      setBookingHistory([]);
    }
  } catch (error) {
    console.error("Lỗi lấy lịch sử rửa xe:", error);
    setBookingHistory([]);
  } finally {
    setIsLoadingHistory(false);
  }
};

  // Tự động gọi API khi render component
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Tìm thông tin khách hàng đang được chọn để xem chi tiết ở Side Drawer
  const currentCustomer = customers.find(c => c.customerId === selectedCustomerId);

  // 🛠️ HÀM KIỂM TRA TRẠNG THÁI CHÍNH XÁC (Xử lý ép kiểu dữ liệu từ Backend)
  const checkIsActive = (status: boolean | string | undefined): boolean => {
    if (status === undefined || status === null) return false;
    if (typeof status === 'boolean') return status;
    return String(status).toLowerCase() === 'true';
  };

  // 🛠️ HÀM THỰC THI THÊM MỚI KHÁCH HÀNG (POST)
  const handleSaveCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCustomer.name,
          phone: newCustomer.phone,
          email: newCustomer.email
        })
      });

      if (response.ok) {
        alert(`🎉 Đã thêm khách hàng ${newCustomer.name} thành công.`);
        setIsOpenAddModal(false);
        setNewCustomer({ name: '', phone: '', email: '' });
        fetchCustomers(); 
      } else {
        const errorMessage = await response.text();
        alert(`❌ Thất bại: ${errorMessage || "Có lỗi xảy ra khi lưu."}`);
      }
    } catch (error) {
      alert("❌ Lỗi kết nối đến server Backend!");
    }
  };

  // 🛠️ HÀM CẬP NHẬT THÔNG TIN KHÁCH HÀNG (PUT)
  const handleUpdateCustomer = async () => {
    if (!selectedCustomerId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${selectedCustomerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCustomer.name,
          phone: newCustomer.phone,
          email: newCustomer.email
        })
      });

      if (response.ok) {
        alert("🎉 Cập nhật thông tin khách hàng thành công!");
        setIsOpenEditModal(false);
        setSelectedCustomerId(null); 
        fetchCustomers(); 
      } else {
        alert("❌ Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🛠️ LOGIC BỘ LỌC TÌM KIẾM
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      (customer.fullName && customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.phone && customer.phone.replace(/\s+/g, '').includes(searchQuery.replace(/\s+/g, '')));
    const matchesTier = selectedTierFilter[customer.tier] === true;
    return matchesSearch && matchesTier;
  });

  const getAvatarLetters = (name: string) => {
    if (!name) return "KH";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen relative overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý khách hàng</h1>
          <p className="text-sm text-slate-500">
            Hiển thị: <span className="font-semibold text-blue-900">{filteredCustomers.length}</span> / {customers.length} khách hàng
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            <Download className="w-4 h-4" /> Xuất báo cáo
          </button>
          <button 
            onClick={() => setIsOpenAddModal(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition"
          >
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

      {/* DATA TABLE */}
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
              <th className="p-4">Tổng chi tiêu</th>
              <th className="p-4 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400 font-medium animate-pulse">
                  ⏳ Đang tải dữ liệu khách hàng từ database...
                </td>
              </tr>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => {
                return (
                  <tr key={customer.customerId} className={`hover:bg-slate-50 transition ${selectedCustomerId === customer.customerId ? 'bg-blue-50/50' : ''}`}>
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300" 
                        checked={selectedCustomerId === customer.customerId} 
                        onChange={() => {
                          setSelectedCustomerId(selectedCustomerId === customer.customerId ? null : customer.customerId);
                          setActiveTab('info');
                          if (selectedCustomerId !== customer.customerId) {
                            fetchCustomerVehicles(customer.customerId);
                            fetchCustomerHistory(customer.customerId);
                          }
                        }} 
                      />
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
                        {getAvatarLetters(customer.fullName)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{customer.fullName}</p>
                        <p className="text-xs text-slate-400">{customer.email || "Chưa cập nhật email"}</p>
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
                    <td className="p-4 text-blue-900 font-semibold">
                      {customer.totalSpend ? customer.totalSpend.toLocaleString('vi-VN') : 0}đ
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => {
                          setSelectedCustomerId(customer.customerId);
                          setActiveTab('info');
                          fetchCustomerVehicles(customer.customerId); // Gọi API lấy xe khi click xem chi tiết
                          fetchCustomerHistory(customer.customerId); // Gọi API lấy lịch sử rửa xe khi click xem chi tiết
                        }}
                        className={`p-1.5 rounded-lg transition ${selectedCustomerId === customer.customerId ? 'bg-blue-900 text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400 font-medium">
                  ❌ Không tìm thấy kết quả phù hợp!
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
          <div className="fixed right-0 top-0 h-full w-112 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 relative">
              <button onClick={() => setSelectedCustomerId(null)} className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-start gap-4 mt-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xl relative">
                  {getAvatarLetters(currentCustomer.fullName)}
                  <span className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${checkIsActive(currentCustomer.active) ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{currentCustomer.fullName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">{currentCustomer.tier}</span>
                    <span className="text-xs text-slate-400">• {currentCustomer.totalPoints} điểm tích lũy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Tabs Navigation */}
            <div className="px-6 border-b border-slate-100 flex gap-4 text-sm font-medium text-slate-400">
              <button onClick={() => setActiveTab('info')} className={`py-3 transition-all ${activeTab === 'info' ? 'text-blue-900 border-b-2 border-blue-900 font-semibold' : 'hover:text-slate-600'}`}>Thông tin</button>
              <button onClick={() => setActiveTab('vehicles')} className={`py-3 transition-all ${activeTab === 'vehicles' ? 'text-blue-900 border-b-2 border-blue-900 font-semibold' : 'hover:text-slate-600'}`}>Xe</button>
              <button onClick={() => setActiveTab('history')} className={`py-3 transition-all ${activeTab === 'history' ? 'text-blue-900 border-b-2 border-blue-900 font-semibold' : 'hover:text-slate-600'}`}>Lịch sử rửa</button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {/* TAB 1: THÔNG TIN CHI TIẾT */}
              {activeTab === 'info' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Chi tiết cá nhân</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Mail className="w-3.5 h-3.5" /> Email</p>
                        <p className="font-medium text-slate-700 truncate">{currentCustomer.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Phone className="w-3.5 h-3.5" /> Số điện thoại</p>
                        <p className="font-medium text-slate-700">{currentCustomer.phone}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Calendar className="w-3.5 h-3.5" /> Ngày tham gia</p>
                        <p className="font-medium text-slate-700">{new Date(currentCustomer.registeredAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><RefreshCw className="w-3.5 h-3.5" /> Trạng thái</p>
                        <p className={`font-medium ${checkIsActive(currentCustomer.active) ? 'text-green-600' : 'text-red-500'}`}>
                          {checkIsActive(currentCustomer.active) ? "Hoạt động" : "Khóa"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                      <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><CreditCard className="w-3.5 h-3.5" /> Tổng chi tiêu</p>
                      <p className="text-xl font-bold text-blue-900">{currentCustomer.totalSpend ? currentCustomer.totalSpend.toLocaleString('vi-VN') : 0}đ</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                      <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Car className="w-3.5 h-3.5" /> Số lần đến</p>
                      <p className="text-xl font-bold text-green-600">{currentCustomer.totalVisits} lần</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HIỂN THỊ PHƯƠNG TIỆN (DỮ LIỆU THẬT) */}
              {activeTab === 'vehicles' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phương tiện đang sử dụng</h4>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-900 px-2 py-0.5 rounded-full">
                      {vehicles.length} xe
                    </span>
                  </div>

                  {isLoadingVehicles ? (
                    <p className="text-xs text-slate-400 text-center py-4 animate-pulse">⏳ Đang tải danh sách xe...</p>
                  ) : vehicles.length > 0 ? (
                    <div className="space-y-2">
                      {vehicles.map((vehicle) => (
                        <div key={vehicle.vehicleId} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex justify-between items-center hover:border-blue-200 transition">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center border border-slate-200 px-1">
                              <span className="text-[8px] font-bold text-slate-400 uppercase">Biển số</span>
                              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{vehicle.plateNumber}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{vehicle.brand} {vehicle.model}</p>
                              <p className="text-xs text-slate-400">Loại: {vehicle.vehicleType} • Màu: {vehicle.color}</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            Đang liên kết
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-white rounded-xl border border-slate-200/60 p-4">
                      <p className="text-sm font-medium text-slate-400">Khách hàng chưa đăng ký xe nào!</p>
                      <p className="text-xs text-slate-400 mt-1">Các phương tiện sẽ tự động cập nhật khi khách thực hiện dịch vụ.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* TAB 3: HIỂN THỊ LỊCH SỬ RỬA XE (DỮ LIỆU THẬT) */}
              {activeTab === 'history' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lịch sử dịch vụ gần đây</h4>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                      {bookingHistory.length} lần rửa
                    </span>
                  </div>

                  {isLoadingHistory ? (
                    <p className="text-xs text-slate-400 text-center py-4 animate-pulse">⏳ Đang tải lịch sử dịch vụ...</p>
                  ) : bookingHistory.length > 0 ? (
                    <div className="space-y-2">
                      {bookingHistory.map((booking) => (
                        <div key={booking.bookingId} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex justify-between items-center hover:border-blue-200 transition">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-800">
                              {booking.serviceType || "Dịch vụ SmartWash Premium"}
                            </p>
                            <p className="text-xs text-slate-400">
                              Ngày: {new Date(booking.scheduledAt).toLocaleString('vi-VN')} • Biển số: <span className="font-medium text-slate-600">{booking.plateNumber || "N/A"}</span>
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-sm font-bold text-blue-900">{booking.totalPrice ? booking.totalPrice.toLocaleString('vi-VN') : 0}đ</p>
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                              booking.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200' :
                              booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-500'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-white rounded-xl border border-slate-200/60 p-4">
                      <p className="text-sm font-medium text-slate-400">Chưa có lịch sử rửa xe!</p>
                      <p className="text-xs text-slate-400 mt-1">Hóa đơn dịch vụ của khách hàng sẽ xuất hiện tại đây sau khi hoàn thành đơn rửa đầu tiên.</p>
                    </div>
                  )}
                </div>
              )}

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
              <button 
                onClick={async () => {
                  if (window.confirm(`Bạn có chắc chắn muốn vô hiệu hóa khách hàng ${currentCustomer.fullName}?`)) {
                    try {
                      const response = await fetch(`${API_BASE_URL}/${currentCustomer.customerId}`, {
                        method: 'DELETE'
                      });
                      if (response.ok) {
                        alert("🎉 Đã vô hiệu hóa khách hàng thành công!");
                        setSelectedCustomerId(null); 
                        fetchCustomers(); 
                      }
                    } catch (error) {
                      console.error(error);
                    }
                  }
                }}
                className="py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
              >
                Vô hiệu hóa
              </button>
              <button 
                onClick={() => {
                  setNewCustomer({
                    name: currentCustomer.fullName,
                    phone: currentCustomer.phone,
                    email: currentCustomer.email || ''
                  });
                  setIsOpenEditModal(true);
                }}
                className="py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
              >
                Sửa thông tin
              </button>
            </div>

          </div>
        </>
      )}

      {/* ================= MODAL ADD ================= */}
      {isOpenAddModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50" onClick={() => setIsOpenAddModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-base">Thêm khách hàng tại quầy</h3>
                <button onClick={() => setIsOpenAddModal(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Nguyễn Văn A" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="0987654321" value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Địa chỉ Email</label>
                  <input type="email" placeholder="nva@gmail.com" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 transition" />
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 text-sm font-medium">
                <button onClick={() => setIsOpenAddModal(false)} className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-100 transition">Hủy bỏ</button>
                <button onClick={handleSaveCustomer} className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition shadow-sm">Xác nhận lưu</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= MODAL EDIT ================= */}
      {isOpenEditModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50" onClick={() => setIsOpenEditModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-base">Cập nhật thông tin</h3>
                <button onClick={() => setIsOpenEditModal(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input type="text" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input type="text" value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Địa chỉ Email</label>
                  <input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 transition" />
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 text-sm font-medium">
                <button onClick={() => setIsOpenEditModal(false)} className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-100 transition">Hủy bỏ</button>
                <button onClick={handleUpdateCustomer} className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition shadow-sm">Cập nhật</button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}