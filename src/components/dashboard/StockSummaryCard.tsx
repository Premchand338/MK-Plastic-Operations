import React from 'react';
import { Package, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StockSummaryCard: React.FC = () => {
  const { rawMaterials, lowStockItems, setActiveTab, t } = useApp();

  return (
    <div className="rounded-2xl bg-white dark:bg-[#201F2B] p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#C9A86A]/10 text-[#C9A86A]">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              Raw Materials & Low Stock
            </h3>
          </div>
          {lowStockItems.length > 0 ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-3 h-3" />
              {lowStockItems.length} Low Stock
            </span>
          ) : (
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              All Levels Adequate
            </span>
          )}
        </div>

        {/* Low Stock Items List */}
        <div className="mt-3 space-y-2">
          {rawMaterials.slice(0, 4).map(rm => {
            const isLow = rm.currentStock <= rm.reorderLevel;
            const pct = Math.min(100, Math.round((rm.currentStock / (rm.reorderLevel * 2)) * 100));

            return (
              <div
                key={rm.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                    {rm.name}
                  </div>
                  <span
                    className={`font-mono font-bold whitespace-nowrap ${
                      isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {rm.currentStock} {rm.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Reorder limit: {rm.reorderLevel} {rm.unit}</span>
                  <span className="capitalize">{rm.applicableUnit} Unit</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isLow ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={() => setActiveTab('raw_materials')}
          className="text-xs font-medium text-[#2B2A4C] dark:text-[#C9A86A] hover:underline flex items-center gap-1"
        >
          <span>Purchase Inward & Inventory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
