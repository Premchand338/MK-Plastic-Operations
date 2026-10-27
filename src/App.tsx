import React, { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Sparkles,
  Users,
  FileText,
  Package,
  Layers,
  DollarSign,
  BarChart3,
  Settings,
  ShieldCheck,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  UserCheck,
  Menu,
  LogOut
} from 'lucide-react';
import { AppProvider, useApp, AppTab } from './context/AppContext';
import { LanguageCode } from './types';
import { LoginScreen } from './components/auth/LoginScreen';
import { OperatorPortal } from './components/production/OperatorPortal';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { OfflineBadge } from './components/common/OfflineBadge';
import { NotificationBell } from './components/common/NotificationBell';
import { PWAInstallButton } from './components/common/PWAInstallButton';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductionView } from './components/production/ProductionView';
import { QuickEntryView } from './components/production/QuickEntryView';
import { StockLedgerView } from './components/stock/StockLedgerView';
import { ThreadingView } from './components/threading/ThreadingView';
import { ProductCatalogueView } from './components/catalogue/ProductCatalogueView';
import { OrdersAndInvoicesView } from './components/orders/OrdersAndInvoicesView';
import { PartiesAndPaymentsView } from './components/parties/PartiesAndPaymentsView';
import { RawMaterialsView } from './components/rawmaterials/RawMaterialsView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUser,
    availableUsers,
    loginAsUser,
    logout,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    flowMode,
    toggleFlowMode,
    t
  } = useApp();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const factoryStepItems: { id: AppTab; label: string; icon: React.ReactNode; stepNo?: string; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Flow Guide & Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'raw_materials', label: '01. Raw GPPS Inward', icon: <Package className="w-4 h-4 text-slate-500" /> },
    { id: 'production', label: '02. Moulding & Coating', icon: <Activity className="w-4 h-4 text-[#4A5A7A]" /> },
    { id: 'karigar', label: '03. Karigar Threading', icon: <Users className="w-4 h-4 text-[#B98B4E]" /> },
    { id: 'orders', label: '04. Orders & Invoicing', icon: <FileText className="w-4 h-4 text-emerald-600" />, adminOnly: true },
    { id: 'stock', label: '05. Stock Ledger & Moves', icon: <Package className="w-4 h-4 text-blue-500" /> },
    { id: 'quick_entry', label: 'Operator Moulding & Salary', icon: <Sparkles className="w-4 h-4 text-amber-500" /> }
  ];

  const masterDataItems: { id: AppTab; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: 'catalogue', label: '24 Brochure Products', icon: <Layers className="w-4 h-4 text-purple-500" /> },
    { id: 'parties', label: 'Parties & CRM Ageing', icon: <Users className="w-4 h-4 text-emerald-500" /> },
    { id: 'expenses', label: 'Factory Expenses', icon: <DollarSign className="w-4 h-4 text-rose-500" />, adminOnly: true },
    { id: 'reports', label: 'Profit & Audit Reports', icon: <BarChart3 className="w-4 h-4 text-indigo-500" />, adminOnly: true },
    { id: 'settings', label: 'Settings & Master Data', icon: <Settings className="w-4 h-4 text-slate-400" />, adminOnly: true }
  ];

  const renderActiveView = () => {
    // Role protection guard for Unit Managers
    if (currentUser.role === 'unit_manager' && ['orders', 'expenses', 'reports', 'settings'].includes(activeTab)) {
      return (
        <div className="p-8 text-center bg-white dark:bg-[#201F2B] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 mx-auto flex items-center justify-center font-bold text-xl">
            🔒
          </div>
          <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-100">
            Access Restricted to Admin (Owner)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Unit managers have access strictly to operational production, stock transfers, and karigar dispatches. Financial rates, invoices, expenses, and profit accounts are restricted to Admin.
          </p>
          <button
            onClick={() => setActiveTab('production')}
            className="px-4 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] text-xs font-bold"
          >
            Go to Unit Production
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'production':
        return <ProductionView />;
      case 'quick_entry':
        return <QuickEntryView />;
      case 'stock':
      case 'transfers':
        return <StockLedgerView />;
      case 'karigar':
        return <ThreadingView />;
      case 'catalogue':
        return <ProductCatalogueView />;
      case 'orders':
        return <OrdersAndInvoicesView />;
      case 'parties':
        return <PartiesAndPaymentsView />;
      case 'raw_materials':
        return <RawMaterialsView />;
      case 'expenses':
        return <ExpensesView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FBFAF7] dark:bg-[#17161F] text-[#1E1D2B] dark:text-[#ECEAF4] transition-colors">
      {/* Mobile-Only Minimal Header (Hidden on Desktop!) */}
      <Header />

      {/* Desktop Persistent Sidebar (Full Command Center — Replaces the Top Navbar!) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white/95 dark:bg-[#201F2B]/95 border-r border-slate-200/80 dark:border-slate-800/80 p-4 h-screen sticky top-0 overflow-y-auto">
        {/* Brand Header & Notification Trigger */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <a
            href="#dashboard"
            onClick={e => {
              e.preventDefault();
              setActiveTab('dashboard');
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2B2A4C] to-[#413F70] dark:from-[#C9A86A] dark:to-[#8C7043] flex items-center justify-center text-white dark:text-[#1E1D2B] font-bold text-sm shadow-xs">
              MK
            </div>
            <div>
              <span className="font-heading text-lg font-bold tracking-tight text-[#2B2A4C] dark:text-[#C9C8F0] block leading-tight">
                MK Plastics
              </span>
              <span className="text-[10px] text-[#C9A86A] font-medium block">
                Beads Bazaar · Bhiwandi
              </span>
            </div>
          </a>
          <NotificationBell />
        </div>

        {/* Mode Indicator & Navigation Header */}
        <div className="pt-3 pb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Factory Process (1–5)
          </span>
          <button
            onClick={toggleFlowMode}
            className="text-[10px] font-semibold text-[#C9A86A] hover:underline"
          >
            {flowMode === 'step_by_step' ? 'Guided' : 'Studio'}
          </button>
        </div>

        <nav className="space-y-0.5 flex-1 overflow-y-auto pr-1">
          {factoryStepItems
            .filter(item => !item.adminOnly || currentUser.role === 'admin')
            .map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span className={isActive ? 'text-white dark:text-[#1E1D2B]' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Management & Records
          </div>

          {masterDataItems
            .filter(item => !item.adminOnly || currentUser.role === 'admin')
            .map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span className={isActive ? 'text-white dark:text-[#1E1D2B]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
        </nav>

        {/* Sidebar Footer: Unified User Persona, Language, Theme, Status, and Install Controls */}
        <div className="pt-3 mt-auto border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Persona Card & Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPersonaMenu(!showPersonaMenu);
                setShowLangMenu(false);
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-lg">{currentUser.avatar}</span>
                <div className="truncate">
                  <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {currentUser.name.split(' (')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{currentUser.role.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {showPersonaMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl bg-white dark:bg-[#201F2B] shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs animate-in slide-in-from-bottom-2 duration-150">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Persona (Demo RLS)
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {availableUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        loginAsUser(user);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between ${
                        currentUser.id === user.id
                          ? 'bg-[#2B2A4C]/10 dark:bg-[#C9A86A]/20 font-semibold text-[#2B2A4C] dark:text-[#C9A86A]'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{user.avatar}</span>
                        <div className="truncate">
                          <div className="font-medium truncate">{user.name}</div>
                          <div className="text-[10px] text-slate-400 capitalize">
                            {user.role.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      {currentUser.id === user.id && (
                        <UserCheck className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Logout to Login Portal */}
                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setShowPersonaMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-between transition-colors text-xs"
                  >
                    <span>Log Out / Switch Portal</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Utility Strip: Language, Theme, Offline Badge, PWA Install */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <OfflineBadge />

            <div className="flex items-center gap-1">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowLangMenu(!showLangMenu);
                    setShowPersonaMenu(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  title="Switch Language"
                >
                  <Globe className="w-3 h-3 text-[#C9A86A]" />
                  <span className="uppercase">{language}</span>
                </button>

                {showLangMenu && (
                  <div className="absolute bottom-full right-0 mb-1 w-28 rounded-xl bg-white dark:bg-[#201F2B] shadow-xl border border-slate-200 dark:border-slate-800 p-1 z-50 text-xs">
                    {(['en', 'hi', 'hinglish'] as LanguageCode[]).map(lang => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded-lg ${
                          language === lang
                            ? 'bg-[#2B2A4C]/10 dark:bg-[#C9A86A]/20 font-semibold text-[#2B2A4C] dark:text-[#C9A86A]'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'Hinglish'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                title={darkMode ? 'Light Theme' : 'Dark Theme'}
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-[#C9A86A]" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              {/* Install PWA */}
              <PWAInstallButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 pb-20 lg:pb-8 min-w-0 max-w-7xl mx-auto w-full">
        {renderActiveView()}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (5 Essential Operational Tabs) */}
      <BottomNav />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isLoggedIn, currentUser } = useApp();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  // Strict screen separation: Machine operators enter dedicated OperatorPortal
  if (currentUser.role === 'staff') {
    return <OperatorPortal />;
  }

  // Admins and Unit Managers enter MainLayout
  return <MainLayout />;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
