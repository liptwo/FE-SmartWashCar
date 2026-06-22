import { authorizeAxios } from '@/shared/lib/api-client'

export interface Customer {
  id: string | number
  customerId: string | number
  fullName: string
  phone: string
  email: string
  tier: string
  totalPoints: number
  lifetimePoints: number
  totalVisits: number
  totalSpend: number
  registeredAt: string | null
  lastVisitAt: string | null
  isActive: boolean
  isAdmin: boolean
  avatar?: string
}

export interface AdminBooking {
  id: string
  bookingId: string
  customerName: string
  customerPhone: string
  customerTier: 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM'
  carPlate: string
  carModel: string
  serviceName: string
  timeStr: string
  dateStr: string
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
  priority: number | string
  notes?: string
  durationMin?: number
  technician?: string
  carImgUrl?: string
  totalAmount?: number
}

export interface AdminVehicle {
  id: string
  licensePlate: string
  vehicleType: string
  brand?: string
  color?: string
  primary?: boolean
}

function unwrapList(data: any, keys: string[] = []): any[] {
  if (Array.isArray(data)) return data

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }

  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.result)) return data.result
  if (Array.isArray(data?.items)) return data.items

  return []
}

function getInitials(name: string): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function normalizeCustomer(customer: any): Customer {
  if (!customer || typeof customer !== 'object') return customer

  const nestedCustomer = customer.customer || {}

  const fullName =
    customer.full_name ??
    customer.fullName ??
    customer.fullname ??
    customer.customer_name ??
    customer.customerName ??
    customer.name ??
    nestedCustomer.full_name ??
    nestedCustomer.fullName ??
    nestedCustomer.name ??
    ''

  const customerId =
    customer.customer_id ??
    customer.customerId ??
    customer.id ??
    nestedCustomer.customer_id ??
    nestedCustomer.customerId ??
    nestedCustomer.id

  const totalPoints =
    customer.totalPoints ??
    customer.total_points ??
    nestedCustomer.totalPoints ??
    nestedCustomer.total_points ??
    0

  const totalVisits =
    customer.totalVisits ??
    customer.total_visits ??
    customer.washCount ??
    customer.wash_count ??
    nestedCustomer.totalVisits ??
    nestedCustomer.total_visits ??
    0

  return {
    id: customerId,
    customerId,
    fullName,
    phone:
      customer.phone ??
      customer.customer_phone ??
      customer.customerPhone ??
      nestedCustomer.phone ??
      '',
    email: customer.email ?? nestedCustomer.email ?? '',
    tier: customer.tier ?? nestedCustomer.tier ?? 'MEMBER',
    totalPoints,
    lifetimePoints:
      customer.lifetimePoints ??
      customer.lifetime_points ??
      nestedCustomer.lifetimePoints ??
      nestedCustomer.lifetime_points ??
      0,
    totalVisits,
    totalSpend:
      customer.totalSpend ??
      customer.total_spend ??
      nestedCustomer.totalSpend ??
      nestedCustomer.total_spend ??
      0,
    registeredAt:
      customer.registeredAt ??
      customer.registered_at ??
      customer.createdAt ??
      customer.created_at ??
      nestedCustomer.registeredAt ??
      nestedCustomer.registered_at ??
      null,
    lastVisitAt:
      customer.lastVisitAt ??
      customer.last_visit_at ??
      customer.lastWashAt ??
      customer.last_wash_at ??
      nestedCustomer.lastVisitAt ??
      nestedCustomer.last_visit_at ??
      null,
    isActive:
      customer.isActive ??
      customer.is_active ??
      nestedCustomer.isActive ??
      nestedCustomer.is_active ??
      true,
    isAdmin:
      customer.isAdmin ??
      customer.is_admin ??
      nestedCustomer.isAdmin ??
      nestedCustomer.is_admin ??
      false,
    avatar: getInitials(fullName),
  }
}

function normalizeBooking(booking: any): AdminBooking {
  if (!booking || typeof booking !== 'object') return booking

  const id = booking.booking_id ?? booking.bookingId ?? booking.id ?? ''
  
  // Format Date and Time
  const scheduledTime = booking.booking_time ?? booking.bookingTime ?? booking.scheduledAt ?? booking.scheduled_at ?? booking.date
  let timeStr = '11:00'
  let dateStr = 'Hôm nay'
  if (scheduledTime) {
    const d = new Date(scheduledTime)
    if (!isNaN(d.getTime())) {
      timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      dateStr = d.toLocaleDateString('vi-VN')
    }
  }

  const customerName =
    booking.customer_name ??
    booking.customerName ??
    booking.customer?.full_name ??
    booking.customer?.fullName ??
    booking.customer?.name ??
    'Khách vãng lai'

  const vehicleName =
    booking.vehicle_name ??
    booking.vehicleName ??
    booking.vehicle?.license_plate ??
    booking.vehicle?.licensePlate ??
    booking.vehicle?.plate_number ??
    booking.vehicle?.plateNumber ??
    'Chưa đăng ký'

  const serviceName =
    booking.service_name ??
    booking.serviceName ??
    booking.service?.name ??
    booking.service?.service_name ??
    booking.service?.serviceName ??
    'Rửa xe tiêu chuẩn'

  const totalAmount =
    booking.total_amount ??
    booking.totalAmount ??
    booking.total_price ??
    booking.totalPrice ??
    booking.price ??
    0

  const customerTier =
    booking.customer_tier ??
    booking.customerTier ??
    booking.customer?.tier ??
    'MEMBER'

  return {
    id,
    bookingId: id,
    customerName,
    customerPhone:
      booking.customer_phone ??
      booking.customerPhone ??
      booking.customer?.phone ??
      '--',
    customerTier,
    carPlate: vehicleName,
    carModel: booking.vehicle?.brand || booking.vehicle?.vehicleType || 'Sedan',
    serviceName,
    timeStr,
    dateStr,
    status: booking.status ?? 'PENDING',
    priority: booking.priority ?? 50,
    notes: booking.notes ?? '',
    durationMin: booking.durationMin ?? 60,
    technician: booking.technician ?? 'Kỹ thuật viên 1',
    carImgUrl: booking.carImgUrl ?? 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=600',
    totalAmount,
  }
}

export const adminService = {
  async getCustomers(): Promise<Customer[]> {
    const { data } = await authorizeAxios.get('/admin/customers')
    return unwrapList(data, ['customers']).map(normalizeCustomer)
  },

  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    // map camelCase to snake_case if required by backend API
    const payload = {
      fullName: customerData.fullName,
      phone: customerData.phone,
      email: customerData.email,
      tier: customerData.tier || 'MEMBER',
    }
    const { data } = await authorizeAxios.post('/admin/customers', payload)
    return normalizeCustomer(data)
  },

  async getCustomerById(id: string | number): Promise<Customer> {
    const { data } = await authorizeAxios.get(`/admin/customers/${id}`)
    return normalizeCustomer(data)
  },

  async updateCustomer(id: string | number, customerData: Partial<Customer>): Promise<Customer> {
    const payload = {
      fullName: customerData.fullName,
      phone: customerData.phone,
      email: customerData.email,
      tier: customerData.tier,
    }
    const { data } = await authorizeAxios.put(`/admin/customers/${id}`, payload)
    return normalizeCustomer(data)
  },

  async disableCustomer(id: string | number): Promise<any> {
    const { data } = await authorizeAxios.delete(`/admin/customers/${id}`)
    return data
  },

  async getCustomerVehicles(id: string | number): Promise<AdminVehicle[]> {
    const { data } = await authorizeAxios.get(`/admin/customers/${id}/vehicles`)
    return unwrapList(data, ['vehicles'])
  },

  async getCustomerHistory(id: string | number): Promise<AdminBooking[]> {
    const { data } = await authorizeAxios.get(`/admin/customers/${id}/history`)
    return unwrapList(data, ['bookings', 'history']).map(normalizeBooking)
  },

  async getBookings(filters: { status?: string; date?: string } = {}): Promise<AdminBooking[]> {
    const params: any = {}
    if (filters.status && filters.status !== 'Tất cả trạng thái') {
      params.status = filters.status.toUpperCase()
    }
    if (filters.date) {
      params.date = filters.date
    }

    const { data } = await authorizeAxios.get('/admin/bookings', { params })
    return unwrapList(data, ['bookings']).map(normalizeBooking)
  },

  async updateBookingStatus(bookingId: string, status: string): Promise<AdminBooking> {
    const { data } = await authorizeAxios.patch(`/admin/bookings/${bookingId}/status`, { status })
    return normalizeBooking(data)
  },
}
