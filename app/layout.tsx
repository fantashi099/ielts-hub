import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ProgressProvider } from '@/components/ProgressProvider';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { getStats } from '@/lib/content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'IELTS Hub — Học ngữ pháp, từ vựng và writing để đạt 7.5–8.0',
    template: '%s · IELTS Hub',
  },
  description:
    'Lộ trình tự học IELTS Academic dành cho người Việt: 48 chủ điểm ngữ pháp, 20 bộ từ vựng học thuật, writing mẫu band 7.5–8.0 có phân tích, thư viện đề bài và lộ trình 12 tuần.',
  keywords: [
    'IELTS',
    'IELTS Academic',
    'học IELTS',
    'ngữ pháp tiếng Anh',
    'từ vựng IELTS',
    'IELTS Writing Task 1',
    'IELTS Writing Task 2',
    'band 7.5',
    'band 8.0',
  ],
  authors: [{ name: 'IELTS Hub' }],
  openGraph: {
    title: 'IELTS Hub — Học IELTS Academic để đạt 7.5–8.0',
    description:
      'Ngữ pháp có giải thích, từ vựng theo chủ đề, writing mẫu band 7.5–8.0 kèm phân tích, lộ trình 12 tuần.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'IELTS Hub',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f7f3' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0e17' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const themeScript = `(function(){try{var t=localStorage.getItem('ielts-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const stats = getStats();
  const totals = {
    lessons: stats.grammarReady,
    words: stats.vocabWords,
    writing: stats.writingUnits,
  };

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Bỏ qua điều hướng
        </a>
        <ProgressProvider totals={totals}>
          <SiteHeader />
          <main id="main" className="mx-auto max-w-6xl px-4 pb-4 pt-8 sm:px-6 sm:pt-10">
            {children}
          </main>
          <SiteFooter />
        </ProgressProvider>
      </body>
    </html>
  );
}
