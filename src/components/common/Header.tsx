import React, { useState } from 'react';
import {
  Globe,
  ChevronDown,
  UserCheck,
  Menu,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';
import { OfflineBadge } from './OfflineBadge';
import { NotificationBell } from './NotificationBell';

/**
 * Mobile-Only Compact Header (48px)
 * Desktop has the persistent sidebar, so top navbar is hidden on desktop (lg:hidden)
 * to eliminate double-navigation and clutter!
 */
export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    availableUsers,
    loginAsUser,
    logout,
    language,
    setLanguage,
    setActiveTab,
    setIsMobileDrawerOpen
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#17161F]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="px-3 h-12 flex items-center justify-between gap-2">
        {/* Mobile Brand Wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2B2A4C] to-[#413F70] dark:from-[#C9A86A] dark:to-[#8C7043] flex items-center justify-center text-white dark:text-[#1E1D2B] font-bold text-xs shadow-xs">
            MK
          </div>
          <div>
            <span className="font-heading text-sm font-bold tracking-tight text-[#2B2A4C] dark:text-[#C9C8F0] block leading-tight">
              MK Plastics
            </span>
            <span className="text-[9px] text-[#C9A86A] font-medium block -mt-0.5">
              Beads Bazaar · Bhiwandi
            </span>
          </div>
        </button>

        {/* Compact Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <OfflineBadge />
          <NotificationBell />

          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Menu & Master Data"
            aria-label="Open Management Menu"
          >
            <Menu className="w-4 h-4 text-[#2B2A4C] dark:text-[#C9A86A]" />
          </button>

          {/* Compact Language Chip */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowUserDropdown(false);
              }}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-[#C9A86A]" />
              <span className="uppercase">{language}</span>
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white dark:bg-[#201F2B] shadow-xl border border-slate-200 dark:border-slate-800 p-1 z-50 text-xs">
                {(['en', 'hi', 'hinglish'] as LanguageCode[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                      language === lang
                        ? 'bg-[#2B2A4C]/10 dark:bg-[#C9A86A]/20 font-semibold text-[#2B2A4C] dark:text-[#C9A86A]'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'Hinglish'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Persona Avatar Switcher Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowLangDropdown(false);
              }}
              className="flex items-center gap-1 pl-1.5 pr-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            >
              <span className="text-sm">{currentUser.avatar}</span>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase">
                {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'unit_manager' ? 'Mgr' : 'Staff'}
              </span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#201F2B] shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs animate-in fade-in duration-150">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Persona (Demo)
                </div>
                <div className="space-y-1">
                  {availableUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        loginAsUser(user);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-xl flex items-center justify-between ${
                        currentUser.id === user.id
                          ? 'bg-[#2B2A4C]/10 dark:bg-[#C9A86A]/20 font-semibold text-[#2B2A4C] dark:text-[#C9A86A]'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{user.avatar}</span>
                        <div className="truncate">
                          <div className="font-medium truncate">{user.name.split(' (')[0]}</div>
                          <div className="text-[9px] text-slate-400 capitalize">
                            {user.role.replace('_', ' ')} {user.unit ? `· ${user.unit}` : ''}
                          </div>
                        </div>
                      </div>
                      {currentUser.id === user.id && (
                        <UserCheck className="w-3 h-3 text-[#C9A86A] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Logout to Login Portal */}
                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-between text-xs"
                  >
                    <span>Log Out / Switch Portal</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
