import React, { useState } from 'react'
import {
  Plus,
  Calendar,
  MoreVertical,
  Info,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Badge } from '@/shared/components/ui/badge'
import { AdminSidebar } from '@/features/admin/components/admin-sidebar'
import { AdminTopbar } from '@/features/admin/components/admin-topbar'
import { bookingsData, type Booking } from '@/shared/data/mockData'
import { cn } from '@/shared/lib/utils'

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(bookingsData)
  const [searchText, setSearchText] = useState('')

  const onUpdateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const onCreateBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev])
  }
  // State variables for filter
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>('Tất cả trạng thái')
  const [dateRangeText, setDateRangeText] = useState<string>(
    '12/10/2023 - 18/10/2023'
  )
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)

  // Pagination mocks
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5

  // New booking form indicators
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false)
  const [newCustName, setNewCustName] = useState('')
  const [newCustTier, setNewCustTier] =
    useState<Booking['customerTier']>('MEMBER')
  const [newCustPhone, setNewCustPhone] = useState('')
  const [newCarPlate, setNewCarPlate] = useState('')
  const [newCarModel, setNewCarModel] = useState('')
  const [newService, setNewService] = useState('Rửa xe tiêu chuẩn')

  // Filtering calculations based on:
  // 1. Search text in header (searches customer name, plate, model, booking code)
  // 2. Status selection dropdown
  const filteredBookings = bookings.filter((b) => {
    // 1. Status Dropdown Match
    if (selectedStatusFilter !== 'Tất cả trạng thái') {
      // Handle status formatting discrepancies if any
      const formatStatus =
        b.status === 'PENDING'
          ? 'Pending'
          : b.status === 'CONFIRMED'
            ? 'Confirmed'
            : b.status === 'IN_PROGRESS'
              ? 'In Progress'
              : b.status === 'DONE'
                ? 'Done'
                : 'Cancelled'
      if (
        formatStatus !== selectedStatusFilter &&
        b.status !== selectedStatusFilter
      ) {
        return false
      }
    }

    // 2. Search Text Input Match
    if (searchText.trim() !== '') {
      const q = searchText.toLowerCase()
      const matchCode = b.id.toLowerCase().includes(q)
      const matchCust = b.customerName.toLowerCase().includes(q)
      const matchPlate = b.carPlate.toLowerCase().includes(q)
      const matchModel = b.carModel.toLowerCase().includes(q)
      if (!matchCode && !matchCust && !matchPlate && !matchModel) {
        return false
      }
    }

    return true
  })

  // Active Selected Booking for Drawer
  const activeBooking = bookings.find((b) => b.id === activeBookingId) || null

  // Pagination bounds
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1

  const handleResetFilters = () => {
    setSelectedStatusFilter('Tất cả trạng thái')
    setSearchText('')
    setDateRangeText('12/10/2023 - 18/10/2023')
    setCurrentPage(1)
  }

  const handleCreateNewBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustName || !newCarPlate || !newCarModel) return

    const newBookingItem: Booking = {
      id: `BK-${Math.floor(9000 + Math.random() * 999)}`,
      customerName: newCustName,
      customerTier: newCustTier,
      customerPhone: newCustPhone || '090 000 1111',
      carPlate: newCarPlate.toUpperCase(),
      carModel: newCarModel,
      serviceName: newService,
      timeStr: '11:00',
      dateStr: 'Hôm nay',
      status: 'PENDING',
      priority: Math.floor(10 + Math.random() * 85),
      notes: 'Đặt qua Admin Portal',
      durationMin: 60,
      technician: 'Kỹ thuật viên 1',
      carImgUrl:
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=600'
    }

    onCreateBooking(newBookingItem)
    setIsNewBookingOpen(false)

    // reset fields
    setNewCustName('')
    setNewCustTier('MEMBER')
    setNewCustPhone('')
    setNewCarPlate('')
    setNewCarModel('')
  }

  const getTierVariant = (tier: Booking['customerTier']) => {
    switch (tier) {
      case 'GOLD':
        return 'gold'
      case 'SILVER':
        return 'silver'
      case 'PLATINUM':
        return 'platinum'
      default:
        return 'member'
    }
  }

  const getStatusVariant = (status: Booking['status']) => {
    switch (status) {
      case 'PENDING':
        return 'pending'
      case 'CONFIRMED':
        return 'confirmed'
      case 'IN_PROGRESS':
        return 'in_progress'
      case 'DONE':
        return 'done'
      case 'CANCELLED':
        return 'cancelled'
      default:
        return 'default'
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activeItem="booking" />
      <AdminTopbar />

      <main className="min-h-screen px-6 pb-6 pt-20 lg:pl-[calc(16rem+24px)]">
        <div className="mx-auto max-w-7xl">
          <div className='space-y-6'>
      {/* Upper header section */}
      <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
        <div>
          <h2 className='text-base font-bold text-slate-900 tracking-tight mb-1 uppercase'>
            Quản lý Booking
          </h2>
          <nav className='flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider'>
            <span className='hover:text-indigo-600 cursor-pointer'>
              Dashboard
            </span>
            <span className='mx-2'>/</span>
            <span className='text-slate-800 font-bold'>Danh sách Booking</span>
          </nav>
        </div>

        <button
          onClick={() => setIsNewBookingOpen(true)}
          className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-650/15 shrink-0 cursor-pointer'
        >
          <Plus className='w-4 h-4' />
          Tạo Booking Mới
        </button>
      </div>

      {/* Filter Bento Card */}
      <div className='bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-end shadow-xs'>
        {/* Date query */}
        <div className='flex-1 w-full space-y-1.5'>
          <label className='block text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
            Khoảng ngày
          </label>
          <div className='relative'>
            <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
            <input
              type='text'
              value={dateRangeText}
              onChange={(e) => setDateRangeText(e.target.value)}
              className='w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 hover:border-slate-300 focus:bg-white text-slate-700 font-semibold transition-all'
            />
          </div>
        </div>

        {/* Status Dropdown selector */}
        <div className='flex-1 w-full space-y-1.5'>
          <label className='block text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
            Trạng thái
          </label>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className='w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 hover:border-slate-300 focus:bg-white text-slate-700 font-semibold appearance-none cursor-pointer transition-all'
          >
            <option>Tất cả trạng thái</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>In Progress</option>
            <option>Done</option>
            <option>Cancelled</option>
          </select>
        </div>

        {/* Action button triggers */}
        <div className='flex gap-2 w-full md:w-auto shrink-0 mt-3 md:mt-0'>
          <button
            onClick={handleResetFilters}
            className='flex-1 md:flex-initial px-4 py-2 border border-slate-200 text-slate-650 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer'
          >
            Reset bộ lọc
          </button>
          <button className='flex-1 md:flex-initial px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-150/10 cursor-pointer'>
            Lọc dữ liệu
          </button>
        </div>
      </div>

      {/* Main Table view of Bookings */}
      <div className='bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50/75 border-b border-slate-200'>
                <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
                  Mã Booking
                </th>
                <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
                  Khách hàng
                </th>
                <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
                  Xe
                </th>
                <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
                  Dịch vụ
                </th>
                <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
                  Giờ hẹn
                </th>
                <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
                  Status
                </th>
                <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase text-center'>
                  Priority
                </th>
                <th className='px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase text-right'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {currentItems.length > 0 ? (
                currentItems.map((booking) => (
                  <tr
                    key={booking.id}
                    onClick={() => setActiveBookingId(booking.id)}
                    className={cn(
                      'hover:bg-slate-50/60 transition-colors cursor-pointer group',
                      activeBookingId === booking.id ? 'bg-indigo-50/15' : ''
                    )}
                  >
                    {/* Booking ID */}
                    <td className='px-5 py-4 text-xs font-bold text-indigo-600'>
                      #{booking.id}
                    </td>

                    {/* Customer */}
                    <td className='px-5 py-4'>
                      <div className='flex items-center gap-1.5'>
                        <span className='text-xs font-bold text-slate-850'>
                          {booking.customerName}
                        </span>
                        <Badge variant={getTierVariant(booking.customerTier)}>
                          {booking.customerTier}
                        </Badge>
                      </div>
                    </td>

                    {/* Car Details */}
                    <td className='px-5 py-4'>
                      <div className='text-xs font-bold text-slate-800'>
                        {booking.carPlate}
                      </div>
                      <div className='text-[10px] text-slate-450 font-bold uppercase mt-0.5'>
                        {booking.carModel}
                      </div>
                    </td>

                    {/* Service Name */}
                    <td className='px-5 py-4 text-xs font-semibold text-slate-650'>
                      {booking.serviceName}
                    </td>

                    {/* Date/Time detail */}
                    <td className='px-5 py-4'>
                      <div className='text-xs font-bold text-slate-800'>
                        {booking.timeStr}
                      </div>
                      <div className='text-[10px] text-slate-450 font-semibold mt-0.5'>
                        {booking.dateStr}
                      </div>
                    </td>

                    {/* Status Pill Badge */}
                    <td className='px-5 py-4'>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>

                    {/* Priority metrics slider or indicator badge */}
                    <td className='px-5 py-4 text-center'>
                      <div className='inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200'>
                        <span className='text-[10px] font-bold text-slate-700'>
                          {booking.priority}
                        </span>
                        {booking.priority !== '--' && (
                          <Info className='w-3 h-3 text-indigo-600 opacity-80' />
                        )}
                      </div>
                    </td>

                    {/* Operations Trigger Menu */}
                    <td
                      className='px-5 py-4 text-right'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setActiveBookingId(booking.id)}
                        className='p-1 hover:bg-slate-105 rounded transition-colors group-hover:text-indigo-600 text-slate-400 cursor-pointer'
                      >
                        <MoreVertical className='w-4 h-4' />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className='py-12 text-center text-gray-400 text-xs font-normal'
                  >
                    Không tìm thấy booking nào phù hợp với bộ lọc hoặc từ khóa
                    tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Interactive Pagination */}
        <div className='px-5 py-4 flex items-center justify-between border-t border-slate-200 bg-white'>
          <p className='text-[11px] text-slate-400 font-bold uppercase tracking-wider'>
            Hiển thị {filteredBookings.length > 0 ? indexOfFirstItem + 1 : 0} -{' '}
            {Math.min(indexOfLastItem, filteredBookings.length)} trong số{' '}
            {filteredBookings.length} bookings
          </p>

          <div className='flex items-center gap-1'>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className='p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer'
            >
              <ChevronLeft className='w-4 h-4' />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer',
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'hover:bg-slate-50 text-slate-650 font-semibold border border-transparent'
                  )}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className='p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer'
            >
              <ChevronRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>

      {/* Side Slide-out Details Drawer Panel (BK-9482) */}
      <AnimatePresence>
        {activeBooking && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBookingId(null)}
              className='fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-50 transition-opacity'
            />

            {/* Slide drawer structure */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className='fixed top-0 right-0 h-screen w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200'
            >
              {/* Drawer Title Header */}
              <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
                <div>
                  <h3 className='text-xs font-bold uppercase tracking-wider text-slate-800'>
                    Chi tiết Booking
                  </h3>
                  <p className='text-xs text-indigo-600 font-bold leading-normal mt-0.5'>
                    #{activeBooking.id}
                  </p>
                </div>
                <button
                  onClick={() => setActiveBookingId(null)}
                  className='p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>

              {/* Scrollable Detailed content parameters */}
              <div className='flex-1 overflow-y-auto p-6 space-y-6'>
                {/* Vehicle Presentation Photo frame */}
                <div>
                  <div className='aspect-video w-full rounded-2xl bg-slate-100 mb-3 overflow-hidden border border-slate-200 shadow-inner'>
                    <img
                      src={
                        activeBooking.carImgUrl ||
                        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=600'
                      }
                      alt='Car in wash bay'
                      className='w-full h-full object-cover select-none'
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-bold tracking-tight text-slate-900'>
                      {activeBooking.carPlate}
                    </span>
                    <span className='text-xs text-slate-450 font-bold uppercase'>
                      {activeBooking.carModel}
                    </span>
                  </div>
                </div>

                {/* Customer card information box */}
                <div className='bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3'>
                  <h4 className='text-[10px] uppercase font-bold tracking-wider text-slate-400'>
                    Khách hàng
                  </h4>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm'>
                      {activeBooking.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className='text-xs font-bold text-slate-850'>
                        {activeBooking.customerName}
                      </p>
                      <p className='text-[11px] text-slate-455 font-semibold mt-0.5'>
                        {activeBooking.customerPhone}
                      </p>
                      <div className='mt-1.5'>
                        <Badge
                          variant={getTierVariant(activeBooking.customerTier)}
                        >
                          {activeBooking.customerTier} MEMBER
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Parameters info */}
                <div className='space-y-3'>
                  <h4 className='text-[10px] uppercase font-bold tracking-wider text-slate-400'>
                    Thông tin dịch vụ
                  </h4>
                  <div className='space-y-2 border-t border-slate-150 pt-2 text-xs'>
                    <div className='flex justify-between items-center py-1.5 border-b border-dashed border-slate-100'>
                      <span className='text-slate-450 font-bold uppercase text-[10px] tracking-wider'>
                        Dịch vụ chính
                      </span>
                      <span className='font-bold text-slate-800'>
                        {activeBooking.serviceName}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1.5 border-b border-dashed border-slate-100'>
                      <span className='text-slate-450 font-bold uppercase text-[10px] tracking-wider'>
                        Thời gian dự kiến
                      </span>
                      <span className='font-bold text-slate-800'>
                        {activeBooking.durationMin || 60} phút
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-1.5 border-b border-dashed border-slate-100'>
                      <span className='text-slate-450 font-bold uppercase text-[10px] tracking-wider'>
                        Kỹ thuật viên
                      </span>
                      <span className='font-bold text-indigo-650'>
                        {activeBooking.technician || 'Tùng Dương (Lead)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Progress items list */}
                <div className='space-y-4'>
                  <h4 className='text-[10px] uppercase font-bold tracking-wider text-slate-400'>
                    Lịch trình trạng thái
                  </h4>
                  <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
                    {/* Event state 1 (Always checked as placed) */}
                    <div className='relative'>
                      <span className='absolute -left-7 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-white border-2 border-white'></span>
                      <p className='text-xs font-bold text-slate-900'>
                        Đã đặt lịch
                      </p>
                      <p className='text-[10px] text-slate-450 font-bold mt-0.5'>
                        {activeBooking.dateStr} - {activeBooking.timeStr}
                      </p>
                    </div>

                    {/* Event state 2 (Pending vs Confirmed) */}
                    <div
                      className={cn(
                        'relative',
                        activeBooking.status === 'PENDING' ? 'opacity-45' : ''
                      )}
                    >
                      <span
                        className={cn(
                          'absolute -left-7 top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white border-2 border-white',
                          activeBooking.status === 'PENDING'
                            ? 'bg-slate-200'
                            : 'bg-emerald-600'
                        )}
                      ></span>
                      <p className='text-xs font-bold text-slate-900'>
                        Xác nhận
                      </p>
                      <p className='text-[10px] text-slate-450 font-bold mt-0.5'>
                        {activeBooking.status === 'PENDING'
                          ? 'Chưa xác nhận'
                          : 'Đã phê duyệt hồ sơ'}
                      </p>
                    </div>

                    {/* Event state 3 */}
                    <div
                      className={cn(
                        'relative',
                        ['PENDING', 'CONFIRMED'].includes(activeBooking.status)
                          ? 'opacity-45'
                          : ''
                      )}
                    >
                      <span
                        className={cn(
                          'absolute -left-7 top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white border-2 border-white',
                          ['PENDING', 'CONFIRMED'].includes(
                            activeBooking.status
                          )
                            ? 'bg-slate-200'
                            : 'bg-emerald-600'
                        )}
                      ></span>
                      <p className='text-xs font-bold text-slate-900'>
                        Bắt đầu thực hiện
                      </p>
                      <p className='text-[10px] text-slate-450 font-bold mt-0.5'>
                        {['IN_PROGRESS', 'DONE'].includes(activeBooking.status)
                          ? 'Đang rửa / vệ sinh chi tiết'
                          : 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer specific notes box */}
                {activeBooking.notes && (
                  <div className='space-y-1.5'>
                    <h4 className='text-[10px] uppercase font-bold tracking-wider text-slate-400'>
                      Ghi chú từ khách hàng
                    </h4>
                    <div className='p-3.5 bg-indigo-50/20 rounded-xl border border-indigo-150/40 italic text-xs text-slate-600 leading-relaxed font-semibold'>
                      "{activeBooking.notes}"
                    </div>
                  </div>
                )}
              </div>

              {/* Action operations button bar */}
              <div className='p-6 border-t border-slate-100 bg-white flex gap-3'>
                {activeBooking.status === 'PENDING' ? (
                  <button
                    onClick={() => {
                      onUpdateBookingStatus(activeBooking.id, 'CONFIRMED')
                    }}
                    className='flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-150 hover:bg-indigo-700 transition-all select-none cursor-pointer'
                  >
                    XÁC NHẬN BOOKING
                  </button>
                ) : activeBooking.status === 'CONFIRMED' ? (
                  <button
                    onClick={() => {
                      onUpdateBookingStatus(activeBooking.id, 'IN_PROGRESS')
                    }}
                    className='flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all select-none cursor-pointer'
                  >
                    BẮT ĐẦU THỰC HIỆN
                  </button>
                ) : activeBooking.status === 'IN_PROGRESS' ? (
                  <button
                    onClick={() => {
                      onUpdateBookingStatus(activeBooking.id, 'DONE')
                    }}
                    className='flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all select-none cursor-pointer'
                  >
                    HOÀN THÀNH DỊCH VỤ
                  </button>
                ) : (
                  <div className='flex-1 text-center py-2 text-xs font-bold text-slate-400'>
                    Booking đã hoàn tất trạng thái luồng.
                  </div>
                )}

                {['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(
                  activeBooking.status
                ) && (
                  <button
                    onClick={() => {
                      onUpdateBookingStatus(activeBooking.id, 'CANCELLED')
                    }}
                    className='px-4 py-3 border border-rose-200 text-rose-600 hover:bg-rose-50/30 rounded-xl font-bold text-xs transition-colors select-none cursor-pointer'
                  >
                    HỦY
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal: Tạo Booking Mới (Admin) */}
      <AnimatePresence>
        {isNewBookingOpen && (
          <div className='fixed inset-0 bg-slate-950/20 backdrop-blur-xs flex items-center justify-center z-50 p-4'>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className='bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200/80 shadow-2xl space-y-4'
            >
              <div className='flex justify-between items-center pb-2 border-b border-slate-100'>
                <h4 className='text-xs font-bold uppercase tracking-tight text-slate-800'>
                  Tạo mới Đơn dịch vụ Booking (POS)
                </h4>
                <button
                  onClick={() => setIsNewBookingOpen(false)}
                  className='text-slate-450 hover:text-slate-600 text-xs font-bold cursor-pointer'
                >
                  Đóng
                </button>
              </div>

              <form
                onSubmit={handleCreateNewBookingSubmit}
                className='space-y-3 text-xs pt-1'
              >
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1'>
                      Tên khách hàng
                    </label>
                    <input
                      type='text'
                      required
                      placeholder='VD: Nguyễn Văn A'
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className='w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 rounded-lg text-xs font-semibold focus:outline-none transition-colors'
                    />
                  </div>
                  <div>
                    <label className='block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1'>
                      Hội viên Hạng
                    </label>
                    <select
                      value={newCustTier}
                      onChange={(e) =>
                        setNewCustTier(
                          e.target.value as Booking['customerTier']
                        )
                      }
                      className='w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 rounded-lg text-xs font-bold focus:outline-none appearance-none cursor-pointer transition-colors'
                    >
                      <option value='MEMBER'>MEMBER</option>
                      <option value='SILVER'>SILVER</option>
                      <option value='GOLD'>GOLD</option>
                      <option value='PLATINUM'>PLATINUM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1'>
                    Số điện thoại
                  </label>
                  <input
                    type='tel'
                    placeholder='VD: 091 222 3333'
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className='w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 rounded-lg text-xs font-semibold focus:outline-none transition-colors'
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1'>
                      Biển kiểm soát
                    </label>
                    <input
                      type='text'
                      required
                      placeholder='VD: 30A-999.99'
                      value={newCarPlate}
                      onChange={(e) => setNewCarPlate(e.target.value)}
                      className='w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 rounded-lg text-xs font-semibold focus:outline-none transition-colors'
                    />
                  </div>
                  <div>
                    <label className='block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1'>
                      Dòng xe
                    </label>
                    <input
                      type='text'
                      required
                      placeholder='VD: Mercedes C300'
                      value={newCarModel}
                      onChange={(e) => setNewCarModel(e.target.value)}
                      className='w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 rounded-lg text-xs font-semibold focus:outline-none transition-colors'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1'>
                    Chọn loại dịch vụ
                  </label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className='w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 rounded-lg text-xs font-semibold focus:outline-none appearance-none cursor-pointer transition-colors'
                  >
                    <option value='Rửa xe tiêu chuẩn'>Rửa xe tiêu chuẩn</option>
                    <option value='Phủ Ceramic Pro'>Phủ Ceramic Pro</option>
                    <option value='Đánh bóng & Hiệu chỉnh sơn'>
                      Đánh bóng & Hiệu chỉnh sơn
                    </option>
                    <option value='Rửa gầm nâng cấp'>Rửa gầm nâng cấp</option>
                    <option value='Combo Chăm sóc Nội thất'>
                      Combo Chăm sóc Nội thất
                    </option>
                  </select>
                </div>

                <div className='flex gap-2 pt-3'>
                  <button
                    type='button'
                    onClick={() => setIsNewBookingOpen(false)}
                    className='flex-1 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors'
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type='submit'
                    className='flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 cursor-pointer'
                  >
                    Tạo Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
        </div>
      </main>
    </div>
  )
}
