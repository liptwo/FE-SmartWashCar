import { useState } from 'react'
import {
  Star,
  Clock,
  Gift,
  AlertTriangle,
  Award,
  Check
} from 'lucide-react'
import { motion } from 'motion/react'
import { loyaltyHistory } from '../data/mockData'
import type { LoyaltyHistoryItem } from '../data/mockData'
import { cn } from '../lib/utils'

export function LoyaltyPage() {
  const [history] = useState<LoyaltyHistoryItem[]>(loyaltyHistory)
  const [filterType, setFilterType] = useState<
    'all' | 'earn' | 'redeem' | 'expire'
  >('all')
  const [claimedReward, setClaimedReward] = useState<string | null>(null)

  const filteredHistory = history.filter((item) => {
    if (filterType === 'all') return true
    return item.type === filterType
  })

  const handleClaimGift = () => {
    setClaimedReward(
      'Cảm ơn bạn! Yêu cầu đổi voucher ưu đãi giảm 20% đã được gửi thành công. Hệ thống đã trừ 500 điểm tích lũy của bạn.'
    )
    // Deduct 500 points mock
    setTimeout(() => {
      setClaimedReward(null)
    }, 5000)
  }

  return (
    <div className='space-y-6'>
      {/* Toast Reward Claim feedback */}
      {claimedReward && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='fixed top-20 right-6 z-50 max-w-sm p-4 bg-indigo-50 border border-indigo-150 rounded-xl shadow-lg shadow-indigo-100 text-indigo-700 text-sm flex items-start gap-2.5'
        >
          <Gift className='w-5 h-5 shrink-0 mt-0.5' />
          <div>
            <p className='font-medium'>Thông báo đổi quà</p>
            <p className='text-xs opacity-90 mt-1'>{claimedReward}</p>
          </div>
        </motion.div>
      )}

      {/* Hero Section - Tier Status Card */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-xs'
      >
        <div className='flex items-center gap-6'>
          <div className='bg-amber-50 text-amber-800 px-4 py-3 rounded-xl border border-amber-200/50 flex items-center gap-2 shadow-xs'>
            <Star className='w-5 h-5 fill-amber-500 text-amber-500' />
            <span className='text-xs font-bold uppercase tracking-wider'>
              GOLD
            </span>
          </div>
          <div>
            <p className='text-3xl font-bold tracking-tight text-slate-900'>
              1,240 pts
            </p>
            <p className='text-xs font-medium text-slate-450 uppercase tracking-widest mt-0.5'>
              Tài khoản hạng Vàng
            </p>
          </div>
        </div>

        <div className='flex-1 max-w-md w-full'>
          <div className='flex justify-between mb-2'>
            <span className='text-xs font-bold text-slate-500 tracking-tight'>
              Tiến trình lên Platinum
            </span>
            <span className='text-xs font-bold text-indigo-600'>62%</span>
          </div>
          <div className='h-2 w-full bg-slate-100 rounded-full overflow-hidden'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '62%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className='h-full bg-indigo-600'
            />
          </div>
          <p className='mt-2 text-[11px] text-slate-500 text-right font-medium'>
            Còn <span className='font-bold text-slate-800'>760 điểm</span> / 15
            lần dịch vụ để thăng hạng
          </p>
        </div>
      </motion.section>

      {/* Tier Comparison Roadmap Grid */}
      <section className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {/* Member */}
        <div className='bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-75 transition-opacity shadow-xs'>
          <div className='bg-slate-50 text-slate-500 px-3 py-1 rounded-md text-xs font-bold border border-slate-200'>
            MEMBER
          </div>
          <span className='text-[10px] text-slate-400 font-bold tracking-tight'>
            0 - 499 pts
          </span>
        </div>

        {/* Silver */}
        <div className='bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-75 transition-opacity shadow-xs'>
          <div className='bg-[#B5D4F4]/15 text-blue-600 px-3 py-1 rounded-md text-xs font-bold border border-blue-200/50'>
            SILVER
          </div>
          <span className='text-[10px] text-slate-400 font-bold tracking-tight'>
            500 - 999 pts
          </span>
        </div>

        {/* Gold - Current Status Card */}
        <div className='bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 border-2 border-amber-400 ring-4 ring-amber-100 relative shadow-md'>
          <div className='bg-amber-50 text-amber-800 px-3 py-1 rounded-md text-xs font-bold border border-amber-200'>
            GOLD
          </div>
          <span className='text-[10px] text-amber-800 font-bold tracking-tight'>
            1,000 - 2,499 pts
          </span>
          <div className='absolute -top-2.5 right-2 bg-amber-400 text-amber-900 text-[8px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-sm'>
            CURRENT
          </div>
        </div>

        {/* Platinum */}
        <div className='bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-75 transition-opacity shadow-xs'>
          <div className='bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold border border-indigo-100'>
            PLATINUM
          </div>
          <span className='text-[10px] text-slate-400 font-bold tracking-tight'>
            2,500+ pts
          </span>
        </div>
      </section>

      {/* Alert Warning Expiration Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='flex items-center gap-3 p-4 bg-amber-50/80 rounded-xl border border-amber-200/50'
      >
        <AlertTriangle className='w-5 h-5 text-amber-600 shrink-0' />
        <p className='text-xs text-amber-800 leading-relaxed font-medium'>
          <span className='font-bold text-amber-950'>240 điểm</span> sẽ hết hạn
          vào ngày <span className='font-bold text-amber-950'>15/01/2026</span>.
          Hãy sử dụng điểm của bạn sớm để không bỏ lỡ các ưu đãi dọn xe đặc biệt
          nhé!
        </p>
      </motion.div>

      {/* Main Points History section */}
      <section className='bg-white rounded-2xl border border-slate-200 p-6 shadow-xs'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
          <div>
            <h2 className='text-sm font-bold text-slate-900 tracking-tight'>
              Lịch sử điểm thưởng
            </h2>
            <p className='text-xs text-slate-400 font-medium mt-1'>
              Biến động điểm tích lũy của bạn
            </p>
          </div>

          {/* Timeline filter controls */}
          <div className='flex flex-wrap items-center gap-1.5'>
            <button
              onClick={() => setFilterType('all')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                filterType === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('earn')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                filterType === 'earn'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              Tích lũy
            </button>
            <button
              onClick={() => setFilterType('redeem')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                filterType === 'redeem'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              Đã dùng
            </button>
            <button
              onClick={() => setFilterType('expire')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                filterType === 'expire'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              Hết hạn
            </button>
          </div>
        </div>

        {/* List of history rows */}
        <div className='space-y-3'>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className='flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all'
              >
                <div className='flex items-center gap-4'>
                  {item.type === 'earn' && (
                    <div className='w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600'>
                      <Star className='w-4 h-4 fill-emerald-500 text-emerald-500' />
                    </div>
                  )}
                  {item.type === 'redeem' && (
                    <div className='w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600'>
                      <Gift className='w-4 h-4' />
                    </div>
                  )}
                  {item.type === 'expire' && (
                    <div className='w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400'>
                      <Clock className='w-4 h-4' />
                    </div>
                  )}

                  <div>
                    <h4 className='text-xs font-bold text-slate-800'>
                      {item.title}
                    </h4>
                    <p className='text-[11px] text-slate-400 font-medium mt-0.5'>
                      {item.date}
                    </p>
                  </div>
                </div>

                <div className='text-right'>
                  <span
                    className={cn(
                      'text-xs font-bold tracking-tight',
                      item.type === 'earn' ? 'text-emerald-600' : '',
                      item.type === 'redeem' ? 'text-indigo-600' : '',
                      item.type === 'expire'
                        ? 'text-slate-400 line-through'
                        : ''
                    )}
                  >
                    {item.points > 0 ? `+${item.points}` : item.points} pts
                  </span>
                  <p className='text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-0.5'>
                    {item.type === 'earn'
                      ? 'Tích lũy'
                      : item.type === 'redeem'
                        ? 'Đã dùng'
                        : 'Hết hạn'}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className='py-8 text-center text-gray-400 text-sm font-normal'>
              Không có giao dịch điểm thưởng nào phù hợp.
            </div>
          )}
        </div>
      </section>

      {/* Promotional Panel Grid */}
      <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Banner: Đổi quà ngay */}
        <div className='relative rounded-2xl overflow-hidden min-h-[160px] flex items-center p-6 border border-slate-200 group shadow-xs bg-slate-900'>
          <img
            className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-40 select-none'
            src='https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1024'
            alt='Mercedes-Benz Detailing Garage'
            referrerPolicy='no-referrer'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent' />
          <div className='relative z-10 text-white max-w-[260px]'>
            <h3 className='text-sm font-bold text-white mb-1.5 tracking-tight uppercase'>
              Đổi quà ngay
            </h3>
            <p className='text-xs text-slate-200 font-medium leading-relaxed mb-4'>
              Sử dụng điểm tích lũy để nhận ngay các dịch vụ dọn xe hoặc mã ưu
              đãi đặc quyền hoàn toàn miễn phí.
            </p>
            <button
              onClick={handleClaimGift}
              className='flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-indigo-650/25 cursor-pointer'
            >
              Đổi voucher 20% <Gift className='w-3.5 h-3.5' />
            </button>
          </div>
        </div>

        {/* Card: Quyền lợi Platinum */}
        <div className='bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-center shadow-xs'>
          <div className='flex gap-4 items-start'>
            <div className='p-3 bg-indigo-50 rounded-xl text-indigo-700 shrink-0 border border-indigo-100 flex items-center justify-center'>
              <Award className='w-6 h-6 border-none' />
            </div>
            <div>
              <h3 className='text-sm font-bold text-slate-800 tracking-tight'>
                Quyền lợi Platinum đang chờ bạn
              </h3>
              <p className='text-xs text-slate-500 font-medium leading-relaxed mt-2'>
                Trở thành hội viên Platinum để hưởng các đặc quyền đẳng cấp
                nhất:
              </p>
              <ul className='mt-3 space-y-1.5 text-xs text-slate-600 font-medium'>
                <li className='flex items-center gap-1.5'>
                  <Check className='w-3.5 h-3.5 text-emerald-500' /> Ưu tiên
                  dịch vụ trước không cần chờ đợi.
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='w-3.5 h-3.5 text-emerald-500' /> Giảm trực
                  tiếp 10% trên toàn bộ hóa đơn.
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='w-3.5 h-3.5 text-emerald-500' /> Trải nghiệm
                  khu vực phòng chờ hạng VIP cao cấp.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
