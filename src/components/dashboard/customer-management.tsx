import { useState, useEffect } from 'react';
import { 
  Search, Download, Plus, Mail, Phone, Calendar, 
  MapPin, Eye, ChevronLeft, ChevronRight, X, CreditCard, Car, Award, RefreshCw
} from 'lucide-react';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU KHÁCH HÀNG THẬT TỪ BACKEND ---
interface Customer {
  customerId: string; // Sử dụng chuỗi UUID thay vì number
  fullName: string;
  phone: string;
  email: string;
  tier: string;
  totalPoints: number;
  totalVisits: number;
  totalSpend: number;
  registeredAt: string;
  isActive: boolean;
}

export default function CustomerManagement() {
  // Thay thế mock data bằng state lưu trữ danh sách thật từ API
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedTierFilter, setSelectedTierFilter] = useState<{ [key: string]: boolean }>({
    MEMBER: true, SILVER: true, GOLD: true, PLATINUM: true
  });
  
  // STATE QUẢN LÝ TÌM KIẾM VÀ TABS CHI TIẾT
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'vehicles' | 'history'>('info');
  const [selectedReward, setSelectedReward] = useState('50');

  // STATE QUẢN LÝ ẨN/HIỆN MODAL THÊM KHÁCH HÀNG
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
  
  // URL gốc của API Backend Spring Boot
  const API_BASE_URL = 'http://localhost:8080/api/admin/customers';

  // 🛠️ HÀM LẤY DANH SÁCH KHÁCH HÀNG THẬT TỪ BACKEND (GET)
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

  // Tự động gọi API ngay khi cấu phần giao diện được tải lên màn hình
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Tìm thông tin khách hàng đang được chọn để xem chi tiết ở Side Drawer
  const currentCustomer = customers.find(c => c.customerId === selectedCustomerId);

  // 🛠️ HÀM THỰC THI THÊM MỚI KHÁCH HÀNG VÀO DATABASE THẬT (POST)
  const handleSaveCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCustomer.name,
          phone: newCustomer.phone,
          email: newCustomer.email
        })
      });

      if (response.ok) {
        alert(`🎉 Thành công! Đã thêm khách hàng ${newCustomer.name} vào hệ thống.`);
        setIsOpenAddModal(false);
        setNewCustomer({ name: '', phone: '', email: '' }); // Đưa form về rỗng
        fetchCustomers(); // Gọi lại hàm lấy danh sách để cập nhật dữ liệu bảng ngay lập tức
      } else {
        const errorMessage = await response.text();
        alert(`❌ Thất bại: ${errorMessage || "Có lỗi xảy ra khi lưu."}`);
      }
    } catch (error) {
      alert("❌ Lỗi kết nối: Không thể gửi dữ liệu đến server Backend!");
      console.error(error);
    }
  };

  // 🛠️ LOGIC BỘ LỌC TÌM KIẾM TRỰC TIẾP TRÊN DỮ LIỆU THẬT
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      (customer.fullName && customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.phone && customer.phone.replace(/\s+/g, '').includes(searchQuery.replace(/\s+/g, '')));
    
    const matchesTier = selectedTierFilter[customer.tier] === true;

    return matchesSearch && matchesTier;
  });

  // Hàm sinh chữ cái đại diện Avatar từ Tên
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
            Hiển thị: <span className="font-semibold text-blue-900">{filteredCustomers.length}</span> / {customers.length} khách hàng hệ thống
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

      {/* BULK ACTIONS BANNER */}
      <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex justify-between items-center mb-4">
        <span className="text-sm text-blue-900 font-medium">Hệ thống đồng bộ dữ liệu đám mây</span>
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
              <th className="p-4">Tổng chi tiêu</th>
              <th className="p-4 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400 font-medium animate-pulse">
                  ⏳ Đang tải dữ liệu khách hàng từ database Supabase...
                </td>
              </tr>
            ) : filteredCustomers.length > 0 ? (
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
                <td colSpan={8} className="p-10 text-center text-slate-400 font-medium">
                  ❌ Không tìm thấy kết quả phù hợp với bộ lọc!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Hiển thị {filteredCustomers.length} khách hàng hợp lệ</span>
          <div className="flex items-center gap-1">
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-2.5 py-1 bg-blue-900 text-white font-medium rounded">1</button>
            <button className="p-1 border border-slate-200 rounded hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* --- SIDE DETAILS DRAWER --- */}
      {selectedCustomerId && currentCustomer && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40" onClick={() => setSelectedCustomerId(null)} />
          
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
                  {getAvatarLetters(currentCustomer.fullName)}
                  <span className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${currentCustomer.isActive ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{currentCustomer.fullName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {currentCustomer.tier}
                    </span>
                    <span className="text-xs text-slate-400">• {currentCustomer.totalPoints} điểm tích lũy</span>
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
                Xe
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
              
              {/* TAB 1: HIỂN THỊ THÔNG TIN CHI TIẾT & HỆ THỐNG ĐỔI ĐIỂM */}
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
                        <p className="font-medium text-slate-700">
                          {new Date(currentCustomer.registeredAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><RefreshCw className="w-3.5 h-3.5" /> Trạng thái</p>
                        <p className="font-medium text-green-600">{currentCustomer.isActive ? "Hoạt động" : "Khóa"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                      <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><CreditCard className="w-3.5 h-3.5" /> Tổng chi tiêu</p>
                      <p className="text-xl font-bold text-blue-900">
                        {currentCustomer.totalSpend ? currentCustomer.totalSpend.toLocaleString('vi-VN') : 0}đ
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                      <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1"><Car className="w-3.5 h-3.5" /> Số lần đến</p>
                      <p className="text-xl font-bold text-green-600">{currentCustomer.totalVisits} lần</p>
                    </div>
                  </div>

                  {/* QUẢN LÝ ĐIỂM THƯỞNG TẠI QUẦY */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-blue-900" />
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quản lý điểm thưởng tại quầy</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium block mb-1">Chọn gói phần thưởng đổi hộ khách:</label>
                        <select 
                          value={selectedReward}
                          onChange={(e) => setSelectedReward(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 text-slate-700 transition"
                        >
                          <option value="50">Voucher giảm giá 10k VND (Yêu cầu 50 điểm)</option>
                          <option value="200">Miễn phí dịch vụ Rửa vỏ Basic (Yêu cầu 200 điểm)</option>
                          <option value="400">Miễn phí Combo Rửa Premium hút bụi (Yêu cầu 400 điểm)</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button 
                          onClick={() => alert(`[Đổi Quà] Đã trừ ${selectedReward} điểm của khách hàng ${currentCustomer.fullName} thành công!`)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center justify-center gap-1"
                        >
                          Xác nhận đổi quà
                        </button>
                        <button 
                          onClick={() => alert(`Mở bảng cộng điểm bù/điều chỉnh điểm thủ công cho khách: ${currentCustomer.fullName}`)}
                          className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium rounded-lg transition flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Điều chỉnh
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: HIỂN THỊ PHƯƠNG TIỆN */}
              {activeTab === 'vehicles' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phương tiện đang sử dụng</h4>
                  <p className="text-xs text-slate-400 text-center py-4">Dữ liệu xe liên kết đang được đồng bộ...</p>
                </div>
              )}

              {/* TAB 3: HIỂN THỊ LỊCH SỬ RỬA XE */}
              {activeTab === 'history' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lịch sử dịch vụ gần đây</h4>
                  <p className="text-xs text-slate-400 text-center py-4">Dữ liệu hóa đơn rửa đang được đồng bộ...</p>
                </div>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
              <button className="py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                Vô hiệu hóa
              </button>
              <button className="py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
                 Ghi chú
              </button>
            </div>

          </div>
        </>
      )}

      {/* ================= MODAL POPUP THÊM KHÁCH HÀNG MỚI TẠI QUẦY ================= */}
      {isOpenAddModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50" onClick={() => setIsOpenAddModal(false)} />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-100 overflow-hidden">
              
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 text-base">Thêm khách hàng mới tại quầy</h3>
                <button 
                  onClick={() => setIsOpenAddModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: 0987654321"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Địa chỉ Email</label>
                  <input 
                    type="email" 
                    placeholder="Ví dụ: nva@gmail.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 text-sm font-medium">
                <button 
                  onClick={() => setIsOpenAddModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-100 transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleSaveCustomer} // Gọi hàm lưu bất đồng bộ kết nối API
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition shadow-sm"
                >
                  Xác nhận lưu
                </button>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
}