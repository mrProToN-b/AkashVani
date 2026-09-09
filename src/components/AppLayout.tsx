'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Map,
  Bell,
  AlertTriangle,
  Wind,
  TrendingUp,
  CloudRain,
  MessageSquare,
  Wifi,
  Settings,
  ChevronLeft,
  ChevronRight,
  MapPin,
  LogOut,
  User,
  Globe,
  Zap,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard', href: '/user-dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'nav-map', label: 'Live Map', href: '/live-weather-map', icon: <Map size={20} /> },
  { id: 'nav-alerts', label: 'Alerts', href: '/user-dashboard', icon: <Bell size={20} />, badge: 2, badgeColor: 'warning' },
  { id: 'nav-disaster', label: 'Disaster Intel', href: '/user-dashboard', icon: <AlertTriangle size={20} /> },
  { id: 'nav-aqi', label: 'Air Quality', href: '/user-dashboard', icon: <Wind size={20} /> },
  { id: 'nav-forecast', label: 'Forecast', href: '/user-dashboard', icon: <CloudRain size={20} /> },
  { id: 'nav-climate', label: 'Climate', href: '/user-dashboard', icon: <TrendingUp size={20} /> },
  { id: 'nav-assistant', label: 'AI Assistant', href: '/user-dashboard/assistant', icon: <MessageSquare size={20} /> },
  { id: 'nav-sos', label: 'SOS', href: '/user-dashboard', icon: <Zap size={20} />, badgeColor: 'danger' },
  { id: 'nav-offline', label: 'Offline Mode', href: '/user-dashboard', icon: <Wifi size={20} /> },
];

interface AppLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userPersona?: string;
  userLocation?: string;
}

export default function AppLayout({
  children,
  userName = 'Soumyajit Koley',
  userPersona = 'Default',
  userLocation = 'Kolkata',
}: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-card border-r border-border sidebar-transition ${
          collapsed ? 'w-16' : 'w-60'
        } flex-shrink-0 z-30`}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-border ${collapsed ? 'p-3 justify-center' : 'px-4 py-3'}`}>
          <div className="flex items-center gap-2 min-w-0">
            <AppLogo size={32} />
            {!collapsed && (
              <span className="font-semibold text-base text-foreground tracking-tight truncate">
                AkashVani
              </span>
            )}
          </div>
        </div>

        {/* Location indicator */}
        {!collapsed && (
          <div className="px-4 py-2 border-b border-border bg-secondary/40">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={12} className="text-primary flex-shrink-0" />
              <span className="truncate font-mono-data">{userLocation}</span>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-hide">
          <div className="px-2 space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group relative ${
                  isActive(item.href)
                    ? 'nav-active font-semibold' :'text-muted-foreground hover:bg-secondary hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className={`flex-shrink-0 ${isActive(item.href) ? 'text-primary' : ''}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor === 'warning' ?'bg-warning/15 text-amber-700'
                        : item.badgeColor === 'danger' ?'bg-danger/15 text-red-700' :'bg-primary/10 text-primary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-warning" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Persona badge */}
        {!collapsed && (
          <div className="px-4 py-2 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Mode:</span>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {userPersona}
              </span>
            </div>
          </div>
        )}

        {/* User profile */}
        <div className={`border-t border-border ${collapsed ? 'p-2' : 'p-3'}`}>
          <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">User Account</p>
              </div>
            )}
            {!collapsed && (
              <Link href="/" className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <LogOut size={16} className="text-muted-foreground" />
              </Link>
            )}
          </div>
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-2 border-t border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0 z-20">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <AppLogo size={28} />
            <span className="font-semibold text-sm text-foreground">AkashVani</span>
          </div>

          {/* Desktop breadcrumb area */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} className="text-primary" />
            <span className="font-mono-data text-foreground font-medium">{userLocation}</span>
            <span className="text-border">·</span>
            <span>Updated 5 min ago</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold px-2.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow" />
              Live
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warning" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Globe size={18} className="text-muted-foreground" />
            </button>
            <Link href="/user-dashboard" className="hidden lg:flex">
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Settings size={18} className="text-muted-foreground" />
              </button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden bg-card border-t border-border flex items-center justify-around px-2 py-2 flex-shrink-0 z-30">
          {[
            { id: 'mob-home', label: 'Home', href: '/user-dashboard', icon: <LayoutDashboard size={20} /> },
            { id: 'mob-map', label: 'Map', href: '/live-weather-map', icon: <Map size={20} /> },
            { id: 'mob-alerts', label: 'Alerts', href: '/user-dashboard', icon: <Bell size={20} /> },
            { id: 'mob-ai', label: 'Ask AI', href: '/user-dashboard/assistant', icon: <MessageSquare size={20} /> },
            { id: 'mob-more', label: 'More', href: '/user-dashboard', icon: <Settings size={20} /> },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'text-primary' :'text-muted-foreground'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}