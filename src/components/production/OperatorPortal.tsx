import React, { useState } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  LogOut,
  Globe,
  Sun,
  Moon,
  ShieldCheck,
  Coins,
  Activity,
  Layers,
  Recycle,
  Send,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OperatorMachineView } from './OperatorMachineView';
import { AssignedTasksSection } from '../dashboard/AssignedTasksSection';
import { LanguageCode } from '../../types';
import { OfflineBadge } from '../common/OfflineBadge';

export const OperatorPortal: React.FC = () => {
  const {
    currentUser,
    logout,
    operatorSessions,
    mouldingTasks,
    getOperatorEarnings,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    t
  } = useApp();

  const [activeOperatorTab, setActiveOperatorTab] = useState<'workstation' | 'tasks' | 'history'>('workstation');

  const assignedMachine = currentUser.assignedMachine || 'M1';
  const earnings = getOperatorEarnings(currentUser.id);

  // Filter sessions logged by this operator today
  const todayDate = new Date().toISOString().slice(0, 10);
  const myTodaySessions = operatorSessions.filter(
    s => s.operatorId === currentUser.id && s.timestamp.startsWith(todayDate)
  );

  // Pending tasks for this operator's machine
  const myPendingTasks = mouldingTasks.filter(
    t => t.machineId === assignedMachine && t.status !== 'Completed'
  );

  return (
    <div className="min-h-screen bg-[#FBFAF7] dark:bg-[#17161F] text-[#1E1D2B] dark:text-[#ECEAF4] flex flex-col transition-colors">
      {/* Operator Dedicated Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#201F2B]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Machine & Operator Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2B2A4C] to-[#413F70] dark:from-[#C9A86A] dark:to-[#8C7043] flex items-center justify-center text-white dark:text-[#1E1D2B] font-bold text-sm shadow-xs">
              {assignedMachine}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {currentUser.name.split(' (')[0]}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 text-[10px] font-bold">
                  Machine {assignedMachine}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                Moulding Unit 1 · Bhiwandi
              </span>
            </div>
          </div>

          {/* Right Controls: Earnings pill, Offline, Language, Theme, Logout */}
          <div className="flex items-center gap-2">
            <OfflineBadge />

            {/* Real-time Earnings Quick Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>Today: ₹{earnings.todayEarned.toFixed(0)}</span>
            </div>

            {/* Language Switch */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
              {(['en', 'hi', 'hinglish'] as LanguageCode[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-1.5 py-0.5 rounded uppercase ${
                    language === l
                      ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Logout / Switch Role Button */}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5"
              title="Logout / Switch Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Operator Sub-Navigation Tabs */}
      <div className="bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-2 py-2 overflow-x-auto">
          <button
            onClick={() => setActiveOperatorTab('workstation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeOperatorTab === 'workstation'
                ? 'bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white/70 dark:bg-[#201F2B]/70'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Machine Workstation & Salary</span>
          </button>

          <button
            onClick={() => setActiveOperatorTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeOperatorTab === 'tasks'
                ? 'bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white/70 dark:bg-[#201F2B]/70'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Assigned Tasks Queue</span>
            {myPendingTasks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {myPendingTasks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveOperatorTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeOperatorTab === 'history'
                ? 'bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white/70 dark:bg-[#201F2B]/70'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Today's Work Log ({myTodaySessions.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto p-3 sm:p-6 flex-1">
        {/* TAB 1: WORKSTATION */}
        {activeOperatorTab === 'workstation' && (
          <div className="space-y-4">
            <OperatorMachineView />
          </div>
        )}

        {/* TAB 2: ASSIGNED TASKS */}
        {activeOperatorTab === 'tasks' && (
          <div className="space-y-4">
            <AssignedTasksSection />
          </div>
        )}

        {/* TAB 3: TODAY'S LOGS */}
        {activeOperatorTab === 'history' && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-white dark:bg-[#201F2B] p-4 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-100">
                    Today's Completed Batches · {currentUser.name.split(' (')[0]}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live record of all moulding shots logged today with piece-rate earnings.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Today's Payout</div>
                  <div className="font-heading text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{earnings.todayEarned.toFixed(0)}
                  </div>
                </div>
              </div>

              {myTodaySessions.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-xs font-semibold">No batches logged yet today.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Feed raw polymer on your workstation and submit your first batch!
                  </p>
                  <button
                    onClick={() => setActiveOperatorTab('workstation')}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] text-xs font-bold"
                  >
                    Go to Machine Workstation
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myTodaySessions.map((session, idx) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            Batch #{myTodaySessions.length - idx} · {session.targetSkuName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                            {session.yieldPct}% Yield
                          </span>
                        </div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          Raw GPPS in: {session.rawMaterialUsedKg} kg · Waste extracted: {session.wasteGeneratedKg} kg · Moulded beads: {session.mouldedBeadsKg} kg
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Logged at {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-mono">
                            {session.mouldedBeadsKg} kg × ₹{session.pieceRatePerKg}
                          </div>
                          <div className="font-heading font-bold text-base text-purple-700 dark:text-purple-300">
                            +₹{session.salaryEarned.toFixed(0)}
                          </div>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
                          ✓
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
