import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { LiveTicker } from '@/components/layout/LiveTicker';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageTransition } from '@/components/layout/PageTransition';
import { FavoriteTeamProvider } from '@/context/FavoriteTeamContext';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'KickoffTo',
  description: 'AI-powered Football Intelligence Platform for Canadian Fans',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KickoffTo',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="KickoffTo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KickoffTo" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-body bg-[var(--bg)] text-[var(--text)] antialiased min-h-screen overflow-x-hidden`}
      >
        <ThemeProvider>
          <div
            id="root"
            className="min-h-screen flex flex-col pt-[env(safe-area-inset-top)] pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0"
          >
            <FavoriteTeamProvider>
              <LiveTicker />
              <Header />
              <main className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
              <BottomNav />
            </FavoriteTeamProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
