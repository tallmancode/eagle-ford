import { redirect } from 'next/navigation.js'
import type { AdminViewServerProps } from 'payload'
import { getSafeRedirect } from 'payload/shared'
import { LoginBackground } from '@/components/admin/login/LoginBackground'
import { LoginForm } from '@/views/Login/LoginForm'
import FullLogo from '@/components/admin/logo/FullLogo'

export default function LoginView({ initPageResult, searchParams }: AdminViewServerProps) {
  const { req } = initPageResult

  const {
    payload: { config },
    payload,
    user,
  } = req

  const {
    admin: { user: userSlug },
    routes: { admin },
  } = config

  const redirectUrl = getSafeRedirect({
    fallbackTo: admin,
    redirectTo: searchParams?.redirect ?? admin,
  })

  if (user) {
    redirect(redirectUrl)
  }

  const collectionConfig =
    payload?.collections?.[userSlug as keyof typeof payload.collections]?.config

  const prefillAutoLogin =
    typeof config.admin?.autoLogin === 'object' && config.admin?.autoLogin.prefillOnly

  const prefillUsername =
    prefillAutoLogin && typeof config.admin?.autoLogin === 'object'
      ? config.admin?.autoLogin.username
      : undefined

  const prefillEmail =
    prefillAutoLogin && typeof config.admin?.autoLogin === 'object'
      ? config.admin?.autoLogin.email
      : undefined

  const prefillPassword =
    prefillAutoLogin && typeof config.admin?.autoLogin === 'object'
      ? config.admin?.autoLogin.password
      : undefined

  return (
    <div className="tw w-full h-full relative">
      <div className="tw w-full max-w-200 relative left-[100px] h-full min-h-dvh bg-dark-950/50 flex flex-col justify-center items-center px-10 py-8">
        <div className="w-full h-auto max-w-xl mx-auto mb-8">
          <FullLogo className="w-full h-auto"></FullLogo>
        </div>
        {!collectionConfig?.auth?.disableLocalStrategy && (
          <LoginForm
            prefillEmail={prefillEmail}
            prefillPassword={prefillPassword}
            prefillUsername={prefillUsername}
            searchParams={searchParams || {}}
          />
        )}
      </div>
      <LoginBackground />
    </div>
  )
}
