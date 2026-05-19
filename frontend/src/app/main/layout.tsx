'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/src/application/state/AuthStore';
import Link from 'next/link';

const navLinks = [
  { name: 'Dashboard', href: '/main/dashboard', icon: 'dashboard' },
  { name: 'Mis Boletas', href: '/main/tickets', icon: 'confirmation_number' },
  { name: 'Admin Panel', href: '/main/admin', icon: 'admin_panel_settings', adminOnly: true },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated()) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredNavLinks = navLinks.filter(link => !link.adminOnly || user?.role === 'admin');
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-surface-container-low/30 backdrop-blur-[20px] border-r border-white/10 flex-col py-6 z-50">
        <div className="px-6 mb-12">
          <h1 className="font-headline-lg text-primary tracking-tighter">LOTTO ELITE</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {filteredNavLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 py-3 transition-all duration-300 ease-in-out ${
                  isActive
                    ? 'text-secondary font-bold border-l-4 border-secondary pl-4 bg-white/5'
                    : 'text-on-surface-variant opacity-70 pl-5 hover:bg-white/10 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                  {link.icon}
                </span>
                <span className="font-label-caps">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-6 mb-4">
          <div className="glass-panel p-4 rounded-xl border-secondary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden">
                <span className="text-on-secondary-container font-bold text-sm">{userInitials}</span>
              </div>
              <div>
                <p className="font-label-caps text-on-surface text-[11px]">{user?.name}</p>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">{user?.role === 'admin' ? 'Admin' : 'Member'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-auto flex flex-col gap-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-on-surface-variant pl-5 hover:bg-white/5 hover:text-on-surface transition-all duration-300 ease-in-out py-3 w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-caps">Logout</span>
          </button>
        </div>
      </aside>

      {/* TopBar */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] backdrop-blur-[40px] bg-surface/10 border-b border-white/10 shadow-[0_0_20px_rgba(220,38,36,0.05)] z-40 md:ml-64">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          {/* Mobile brand */}
          <div className="md:hidden">
            <h1 className="font-headline-mobile text-primary tracking-tighter">LOTTO ELITE</h1>
          </div>
          {/* Desktop: page title area is empty, pages handle their own */}
          <div className="hidden md:block"></div>

          <div className="flex items-center gap-4">
            <button className="text-on-surface hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden border border-secondary/20 flex items-center justify-center">
              <span className="text-on-secondary-container font-bold text-[10px]">{userInitials}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 mt-16 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-low/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-center py-3 z-50">
        {filteredNavLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link key={link.name} href={link.href} className={`flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {link.icon}
              </span>
              <span className="font-label-caps text-[10px]">{link.name.split(' ')[0]}</span>
            </Link>
          );
        })}
        <Link href="/main/tickets" className="w-14 h-14 bg-primary-container text-on-primary-container rounded-full -mt-10 glow-red border-4 border-[#0A0A0F] flex items-center justify-center">
          <span className="material-symbols-outlined">add</span>
        </Link>
      </nav>
    </div>
  );
}
