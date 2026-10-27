import React from 'react';
import { Activity, Plus, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BeadStringProgress } from '../common/BeadStringProgress';

export const ProductionSummaryCard: React.FC = () => {
  const { todayProduction, mouldingEntries, coatingBatches, setActiveTab, currentUser, t } = useApp();

  return (
    <div className="rounded-2xl bg-white dark:bg-[#201F2B] p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#4A5A7A]/10 text-[#4A5A7A] dark:text-[#7B8CAE]">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
            {t('todayProduction')}
          </h3>
        </div>
        <button
          onClick={() => setActiveTab(currentUser.role === 'staff' ? 'quick_entry' : 'production')}
          className="flex items-center gap-1 text-xs font-semibold text-[#C9A86A] hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 my-4">
        {/* Moulding */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Moulding (Plain)
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
            {todayProduction.mouldingKg.toFixed(1)} <span className="text-xs font-normal">kg</span>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            +6.2% vs y’day
          </div>
        </div>

        {/* Pearl */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Pearl Coating
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
            {todayProduction.pearlKg.toFixed(1)} <span className="text-xs font-normal">kg</span>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            Double-dip active
          </div>
        </div>

        {/* Metalizing */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Metalizing MZ1
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
            {todayProduction.metalizingKg.toFixed(1)} <span className="text-xs font-normal">kg</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Vacuum cycle OK
          </div>
        </div>
      </div>

      {/* Machine-Level Breakdown with Bead-String Progress */}
      <div className="space-y-2.5 pt-1">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Machine Yield & Performance
        </div>

        {mouldingEntries.slice(0, 3).map(entry => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#4A5A7A] dark:text-[#7B8CAE] px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">
                {entry.machineId}
              </span>
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                  {entry.skuName}
                </div>
                <div className="text-[11px] text-slate-400">
                  {entry.goodBeadsKg} kg · {entry.bagsPacked} bags · Op: {entry.operatorName}
                </div>
              </div>
            </div>

            <div className="text-right">
              <BeadStringProgress value={entry.yieldPct} unitColor="#4A5A7A" />
              {entry.downtimeMinutes ? (
                <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                  DT: {entry.downtimeMinutes}m ({entry.downtimeReason?.slice(0, 16)}...)
                </div>
              ) : (
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                  0m downtime
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={() => setActiveTab('production')}
          className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1"
        >
          <span>View all production batches</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
