'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/grammar', label: 'Ngữ pháp' },
  { href: '/vocabulary', label: 'Từ vựng' },
  { href: '/writing', label: 'Writing' },
  { href: '/plan', label: 'Lộ trình' },
  { href: '/progress', label: 'Tiến độ' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('ielts-theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
    setDark(next);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/60 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="IELTS Hub — trang chủ">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 font-display text-[13px] font-bold text-white shadow-soft transition group-hover:scale-105">
            IH
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-semibold tracking-tight text-ink-900 dark:text-white">
              IELTS Hub
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">
              7.5 → 8.0 Academic
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                isActive(item.href)
                  ? 'bg-brand-50 text-brand-700 dark:bg-white/[0.08] dark:text-brand-200'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/[0.06] dark:hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-600 transition hover:bg-white dark:border-white/15 dark:text-ink-200 dark:hover:bg-white/10"
          >
            {mounted && dark ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link href="/grammar" className="btn-primary hidden !px-4 !py-2 sm:inline-flex">
            Bắt đầu học
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Mở menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-600 md:hidden dark:border-white/15 dark:text-ink-200"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-ink-200/60 bg-white/95 px-4 py-3 md:hidden dark:border-white/10 dark:bg-ink-950/95">
          <nav className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  isActive(item.href)
                    ? 'bg-brand-50 text-brand-700 dark:bg-white/[0.08] dark:text-brand-200'
                    : 'text-ink-700 dark:text-ink-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
