import { authorizeAxios } from '@/shared/lib/api-client'

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password?: string
}

export interface LoginPayload {
  emailOrPhone: string
  password?: string
}

export interface AuthResponse {
  token?: string
  accessToken?: string
  jwt?: string
  refreshToken?: string
  user?: {
    id?: string
    name?: string
    email?: string
    phone?: string
    role?: string
  }
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await authorizeAxios.post<AuthResponse>('/auth/register', {
      name: payload.name,
      fullName: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
    })
    return data
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await authorizeAxios.post<AuthResponse>('/auth/login', {
      email: payload.emailOrPhone,
      phone: payload.emailOrPhone,
      username: payload.emailOrPhone,
      password: payload.password,
    })
    return data
  },
}
