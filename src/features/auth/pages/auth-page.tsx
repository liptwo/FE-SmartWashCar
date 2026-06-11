import { Sparkles } from 'lucide-react'
import { Link } from '@/app/router'
import { routes } from '@/app/routes'
import { BenefitCard } from '@/features/marketing/components/benefit-card'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { authBenefits } from '@/features/marketing/data/marketing'
import { cn } from '@/shared/lib/utils'

type AuthPageProps = {
  mode: 'login' | 'register'
}

export function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === 'login'

  return (
    <main className="grid min-h-screen place-items-center px-6 pb-18 pt-28">
      <section className="grid w-full max-w-[900px] justify-items-center gap-6">
        <Card className="w-full max-w-[460px]">
          <CardContent className="grid justify-items-center gap-6 px-6 pb-6 pt-12">
            <div className="grid size-16 place-items-center rounded-full text-primary" aria-hidden="true">
              <Sparkles size={18} />
            </div>

            <div className="grid w-full grid-cols-2 border-b border-outline-variant" role="tablist">
              <Link
                aria-selected={isLogin}
                className={cn(
                  'border-b-2 border-transparent py-3 text-center text-base font-medium leading-6 text-on-surface-variant',
                  isLogin && 'border-primary text-primary',
                )}
                role="tab"
                to={routes.login}
              >
                Đăng nhập
              </Link>
              <Link
                aria-selected={!isLogin}
                className={cn(
                  'border-b-2 border-transparent py-3 text-center text-base font-medium leading-6 text-on-surface-variant',
                  !isLogin && 'border-primary text-primary',
                )}
                role="tab"
                to={routes.register}
              >
                Đăng ký
              </Link>
            </div>

            <form className="grid w-full gap-4">
              {!isLogin && (
                <label className="grid gap-2 text-sm font-medium leading-4 text-on-surface-variant">
                  Họ tên
                  <Input autoComplete="name" placeholder="Nhập họ và tên" type="text" />
                </label>
              )}

              {isLogin ? (
                <label className="grid gap-2 text-sm font-medium leading-4 text-on-surface-variant">
                  Email hoặc Số điện thoại
                  <Input autoComplete="username" placeholder="Nhập email hoặc số điện thoại" type="text" />
                </label>
              ) : (
                <>
                  <label className="grid gap-2 text-sm font-medium leading-4 text-on-surface-variant">
                    Email
                    <Input autoComplete="email" placeholder="Nhập email" type="email" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium leading-4 text-on-surface-variant">
                    Số điện thoại
                    <span className="relative block">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base leading-6 text-on-surface-variant">
                        +84
                      </span>
                      <Input autoComplete="tel" className="pl-14" placeholder="Nhập số điện thoại" type="tel" />
                    </span>
                  </label>
                </>
              )}

              <label className="grid gap-2 text-sm font-medium leading-4 text-on-surface-variant">
                Mật khẩu
                <Input autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder="Nhập mật khẩu" type="password" />
              </label>

              {!isLogin && (
                <label className="grid gap-2 text-sm font-medium leading-4 text-on-surface-variant">
                  Xác nhận mật khẩu
                  <Input autoComplete="new-password" placeholder="Nhập lại mật khẩu" type="password" />
                </label>
              )}

              <Button asChild className="h-12 w-full text-base" size="lg">
                <Link to={routes.home}>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</Link>
              </Button>

              {isLogin && (
                <div className="flex flex-col items-center gap-2">
                  <Link className="text-sm font-medium text-primary hover:underline" to={routes.otp}>
                    Quên mật khẩu? (OTP)
                  </Link>
                  <Link className="text-base leading-6 text-primary hover:underline" to={routes.register}>
                    Đăng ký tài khoản mới
                  </Link>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="grid w-full gap-4 md:grid-cols-3">
          {authBenefits.map((benefit) => (
            <BenefitCard {...benefit} key={benefit.title} />
          ))}
        </div>
      </section>
    </main>
  )
}
