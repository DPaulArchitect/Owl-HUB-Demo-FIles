import { Authentication } from '@/core/authentication'
import { SocketService } from '@/server/libraries/socket'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const socketId = formData.get('socket_id') as string
    const channelName = formData.get('channel_name') as string

    const session = await Authentication.getSession()

    const user = session?.user

    const channelPresenceData = {
      user_id: user.id,
      user_info: { name: user.name },
    }

    if (user) {
      const auth = await SocketService.authorizeChannel(
        socketId,
        channelName,
        channelPresenceData,
      )

      return NextResponse.json(auth)
    } else {
      return new NextResponse('Pusher authentication request failed', {
        status: 403,
      })
    }
  } catch (error) {
    return new NextResponse(`Error: ${error}`, { status: 500 })
  }
}
