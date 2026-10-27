import React, { useState } from 'react';
import {
  ShieldCheck,
  Wrench,
  Crown,
  Settings,
  ArrowRight,
  Globe,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Lock,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/seedData';
import { UserPersona, LanguageCode } from '../../types';
import { OfflineBadge } from '../common/OfflineBadge';

export const LoginScreen: React.FC = () => {
  const { loginAsUser, language, setLanguage, darkMode, toggleDarkMode, t } = useApp();

  const [activeTab, setActiveTab] = useState<'operators' | 'admin' | 'managers'>('operators');
  const [pinCode, setPinCode] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserPersona | null>(null);

  const adminUser = DEMO_USERS.find(u => u.role === 'admin') || DEMO_USERS[0];
  const operatorUsers = DEMO_USERS.filter(u => u.role === 'staff');
  const managerUsers = DEMO_USERS.filter(u => u.role === 'unit_manager');

  const handleQuickLogin = (user: UserPersona) => {
    loginAsUser(user);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] dark:bg-[#17161F] text-[#1E1D2B] dark:text-[#ECEAF4] flex flex-col justify-between p-4 sm:p-6 transition-colors font-sans">
      {/* Top Header with Brand & Controls */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2B2A4C] to-[#413F70] dark:from-[#C9A86A] dark:to-[#8C7043] flex items-center justify-center text-white dark:text-[#1E1D2B] font-bold text-base shadow-xs">
            MK
          </div>
          <div>
            <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-[#2B2A4C] dark:text-[#C9C8F0] leading-tight">
              MK Plastics Operations
            </h1>
            <span className="text-xs text-[#C9A86A] font-medium block">
              Beads Bazaar · Bhiwandi, Maharashtra
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <OfflineBadge />

          {/* Language Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            {(['en', 'hi', 'hinglish'] as LanguageCode[]).map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2 py-1 rounded-lg uppercase transition-colors ${
                  language === l
                    ? 'bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#C9A86A]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A86A]/10 border border-[#C9A86A]/30 text-[#8C7043] dark:text-[#C9A86A] text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Role-Based Factory Access Portal</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Select Your Workstation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Machine operators log into their single-machine piece-rate workstation. Admins supervise company accounts, tasks, and material journeys.
          </p>
        </div>

        {/* Portal Selection Tabs */}
        <div className="flex justify-center mb-6">
          <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('operators')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'operators'
                  ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4 text-amber-500" />
              <span>Machine Operators (M1 & M2)</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Crown className="w-4 h-4 text-[#C9A86A]" />
              <span>Admin / Factory Owner</span>
            </button>

            <button
              onClick={() => setActiveTab('managers')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'managers'
                  ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Settings className="w-4 h-4 text-purple-500" />
              <span>Unit Managers</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MACHINE OPERATORS (M1 & M2 Dedicated Login) */}
        {activeTab === 'operators' && (
          <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <div>
                <span className="font-bold">Machine Operator Mode</span>: Large touch targets, assigned machine lock, live yield meter, real-time piece-rate earnings (₹3.00 per kg), and 3 post-session actions.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {operatorUsers.map(op => {
                const machine = op.assignedMachine || 'M1';
                const isM1 = machine === 'M1';

                return (
                  <div
                    key={op.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#201F2B] border-2 border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-[#C9A86A] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-bold font-mono ${
                            isM1
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          Machine {machine}
                        </span>
                        <span className="text-2xl">{op.avatar}</span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-100">
                        {op.name.split(' (')[0]}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Dedicated Operator · Moulding Unit 1
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Moulding Plain Beads (Round, Drop, etc.)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span>Piece-Rate Pay: <strong>₹3.00 / kg good beads</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Waste recycling & direct loose sale dispatch</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickLogin(op)}
                      className="mt-6 w-full py-3 px-4 rounded-2xl bg-[#2B2A4C] hover:bg-[#3D3B6B] dark:bg-[#C9A86A] dark:hover:bg-[#B89658] text-white dark:text-[#1E1D2B] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <span>Enter Machine {machine} Workstation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ADMIN / OWNER LOGIN */}
        {activeTab === 'admin' && (
          <div className="max-w-md mx-auto animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#201F2B] border-2 border-slate-200/90 dark:border-slate-800 shadow-lg text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#2B2A4C] to-[#413F70] dark:from-[#C9A86A] dark:to-[#8C7043] mx-auto flex items-center justify-center text-3xl shadow-sm">
                👑
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100">
                  {adminUser.name.split(' (')[0]}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A86A]/20 text-[#8C7043] dark:text-[#C9A86A] font-bold uppercase tracking-wider inline-block mt-1">
                  Owner · Full Firm Scope
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Full authority over 3 manufacturing units, outsourced karigar jobs, live material journey board, task assignments, billing (GST & kachcha), and profit accounts.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-left text-xs space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
                  Admin Exclusive Permissions:
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Assign production tasks to M1/M2 operators</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Receive live task completion alerts & salary logs</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>View profit, receivables, rates, and audit trail</span>
                </div>
              </div>

              <button
                onClick={() => handleQuickLogin(adminUser)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#2B2A4C] hover:bg-[#3D3B6B] dark:bg-[#C9A86A] dark:hover:bg-[#B89658] text-white dark:text-[#1E1D2B] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Enter Admin Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: UNIT MANAGERS */}
        {activeTab === 'managers' && (
          <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200">
              <span className="font-bold">Unit Manager Scope</span>: Restricted to own unit production entries, stock transfers, and karigar dispatches. Financial rates and profit are hidden.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {managerUsers.map(mgr => (
                <div
                  key={mgr.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{mgr.avatar}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {mgr.unit}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                      {mgr.name.split(' (')[0]}
                    </h4>
                    <p className="text-[11px] text-slate-500 capitalize mt-0.5">
                      {mgr.unit} Unit Manager
                    </p>
                  </div>

                  <button
                    onClick={() => handleQuickLogin(mgr)}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#2B2A4C] hover:text-white dark:hover:bg-[#C9A86A] dark:hover:text-[#1E1D2B] text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Enter Unit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-400">
        <div>MK Plastics / Beads Bazaar · Plot 108, Gala 4-7, Anjurphata Road, Bhiwandi, Maharashtra 421302</div>
        <div className="mt-0.5 text-slate-500">Moulding (M1–M4) · Pearl Coating (P1, P2) · Metalizing (MZ1) · Outsourced Threading</div>
      </footer>
    </div>
  );
};
