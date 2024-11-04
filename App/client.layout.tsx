'use client'

import { WorkspaceProvider } from '@/.marblism/workspace'
import { AnalyticsProvider } from '@/core/analytics'
import { UserProvider } from '@/core/context'
import { TRPCProvider } from '@/core/trpc'
import { DesignSystemProvider } from '@/designSystem'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

import { NotificationProvider } from '@/core/hooks/pushNotification'

type Props = { children: ReactNode }

export function ClientLayout({ children }: Props) {
  return (
    <DesignSystemProvider>
      <SessionProvider>
        <TRPCProvider>
          <AnalyticsProvider>
            <WorkspaceProvider>
              <UserProvider>
                <NotificationProvider>{children}</NotificationProvider>
              </UserProvider>
            </WorkspaceProvider>
          </AnalyticsProvider>
        </TRPCProvider>
      </SessionProvider>
    </DesignSystemProvider>
  )
}
