import { useState } from 'react';
import { Ticket, Car, Star, Sparkles, Wind, Shield, Lock, Info } from 'lucide-react';

// --- MOCK DATA PHẦN THƯỞNG (Giống hệt thiết kế Ảnh 2) ---
const mockRewards = [
  { id: 1, title: "Giảm 10.000đ", points: 50, icon: Ticket, locked: false },
  { id: 2, title: "Rửa Basic miễn phí", points: 200, icon: Car, locked: false },
  { id: 3, title: "Rửa Premium miễn phí", points: 400, icon: Star, tag: "HẠNG GOLD+", locked: false },
  { id: 4, title: "Dịch vụ xịt bóng", points: 100, icon: Sparkles, locked: false },
  { id: 5, title: "Làm thơm nội thất", points: 100, icon: Wind, locked: false },
  { id: 6, title: "Phủ Ceramic", points: 2000, icon: Shield, locked: true },
];

export default function RewardsSelection() {
  const [userPoints] = useState(1240); // Số điểm hiện có cố định theo thiết kế

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl border border-slate-100 shadow-xs">
      
      {/* TOP HEADER SECTION */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            AutoWash Pro <span className="text-sm font-normal text-slate-400">| Đổi điểm lấy thưởng</span>
          </h1>
          <div className="mt-4">
            <h2 className="text-base font-bold text-slate-800">Đổi quà tặng</h2>
            <p className="text-xs text-slate-400 mt-0.5">Sử dụng điểm tích lũy để nhận ưu đãi đặc biệt.</p>
          </div>
        </div>

        {/* Badge hiển thị số điểm hiện có */}
        <div className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-full shadow-xs">
          <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
          <span className="text-sm font-semibold tracking-wide">Điểm hiện có: {userPoints.toLocaleString()}</span>
        </div>
      </div>

      {/* REWARDS GRID SYSTEM (6 Ô QUÀ TẶNG) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {mockRewards.map((reward) => {
          const IconComponent = reward.icon;
          return (
            <div 
              key={reward.id} 
              className={`p-5 rounded-xl border flex items-center justify-between transition relative overflow-hidden group ${
                reward.locked 
                  ? 'bg-slate-50/50 border-slate-200/60 opacity-60' 
                  : 'bg-white border-slate-100 shadow-xs hover:border-blue-200 hover:shadow-sm cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Khối chứa Icon bên trái */}
                <div className={`p-3 rounded-lg ${
                  reward.locked ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-900'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Chi tiết quà */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-900 transition">
                      {reward.title}
                    </h3>
                    {reward.tag && (
                      <span className="bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm">
                        {reward.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-blue-600 mt-1">{reward.points}đ</p>
                </div>
              </div>

              {/* Trạng thái Khóa nếu có */}
              {reward.locked && (
                <div className="text-slate-400 pr-2">
                  <Lock className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER NOTE SECTION (Hướng dẫn tích điểm) */}
      <div className="bg-blue-50/50 border border-blue-100/60 rounded-xl p-4 flex gap-3 items-start">
        <div className="p-1 text-blue-900">
          <Info className="w-4 h-4 mt-0.5" />
        </div>
        <div className="text-xs leading-relaxed text-slate-600">
          <h4 className="font-bold text-blue-950 mb-1">Làm sao để tích thêm điểm?</h4>
          <p>
            Với mỗi <span className="font-semibold text-blue-900">10,000đ</span> chi tiêu tại AutoWash Pro, bạn sẽ nhận được <span className="font-semibold text-blue-900">1 điểm</span> thưởng. Thành viên hạng Vàng và Kim Cương sẽ được nhân hệ số điểm thưởng lên đến <span className="font-semibold text-blue-900">1.5x</span>.
          </p>
        </div>
      </div>

    </div>
  );
}