import { Metadata } from 'next'
import { ClientLayout } from './client.layout'

export const metadata: Metadata = {
  title: 'OwlHub',
  description: 'OwlHub',

  generator: 'Marblism',
  manifest: '/manifest.json',
  keywords: ['marblism', 'next14', 'pwa', 'next-pwa'],
  authors: [],
  icons: {
    icon: '/pwa/icon.png',
    apple: '/pwa/icon.png',
    other: [
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/pwa/iPhone_16_Pro_Max_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/pwa/iPhone_16_Pro_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/pwa/iPhone_16_Plus_iPhone_15_Pro_Max_iPhone_15_Plus_iPhone_14_Pro_Max_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/pwa/iPhone_16_iPhone_15_Pro_iPhone_15_iPhone_14_Pro_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/pwa/iPhone_14_Plus_iPhone_13_Pro_Max_iPhone_12_Pro_Max_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/pwa/iPhone_14_iPhone_13_Pro_iPhone_13_iPhone_12_Pro_iPhone_12_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        url: '/pwa/iPhone_13_mini_iPhone_12_mini_iPhone_11_Pro_iPhone_XS_iPhone_X_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/pwa/iPhone_16_Pro_Max_portrait.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/pwa/iPhone_16_Pro_portrait.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/pwa/iPhone_16_Plus_iPhone_15_Pro_Max_iPhone_15_Plus_iPhone_14_Pro_Max_portrait.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/pwa/iPhone_16_iPhone_15_Pro_iPhone_15_iPhone_14_Pro_portrait.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/pwa/iPhone_14_Plus_iPhone_13_Pro_Max_iPhone_12_Pro_Max_portrait.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/pwa/iPhone_14_iPhone_13_Pro_iPhone_13_iPhone_12_Pro_iPhone_12_portrait.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        url: '/pwa/iPhone_13_mini_iPhone_12_mini_iPhone_11_Pro_iPhone_XS_iPhone_X_portrait.png',
      },
    ],
  },
}

export const viewport = {
  minimumScale: 1,
  maximumScale: 1,
  initialScale: 1,
  userScalable: 'no',
  width: 'device-width',
  shrinkToFit: 'no',
  viewportFit: 'cover',
}

export default function RootLayout(props) {
  return (
    <>
      <ClientLayout {...props} />
    </>
  )
}
