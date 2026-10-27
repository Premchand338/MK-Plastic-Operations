import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Truck,
  Palette,
  Users,
  CheckCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MaterialJourneyBoard: React.FC = () => {
  const { stageTotals, setActiveTab, t } = useApp();
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const stages = [
    {
      num: 1,
      name: 'Raw Materials',
      subtitle: 'GPPS & Chemicals',
      qtyDisplay: `${stageTotals.rawKg.toLocaleString('en-IN')} kg`,
      uomNote: 'Granules in store',
      unitTag: 'Moulding & Stores',
      color: '#4A5A7A', // Slate
      icon: <Layers className="w-5 h-5 text-[#4A5A7A]" />,
      drilldown: {
        title: 'Raw Material Inventory Breakdown',
        desc: 'Virgin GPPS (Shalimar SR & Treemurti TR), Pearl essence, lacquer, and aluminum wire inward balance.',
        targetTab: 'raw_materials' as const
      }
    },
    {
      num: 2,
      name: 'Plain Beads',
      subtitle: 'Moulding (M1–M4)',
      qtyDisplay: `${stageTotals.plainKg.toLocaleString('en-IN')} kg`,
      uomNote: 'Uncoloured in 25kg bags',
      unitTag: 'Moulding Unit',
      color: '#4A5A7A',
      icon: <Sparkles className="w-5 h-5 text-[#4A5A7A]" />,
      drilldown: {
        title: 'Moulded Plain Beads Stock',
        desc: 'Uncoloured beads molded on M1–M4 from GPPS. Ready for internal transfer to Pearl/Metalizing or direct loose sale.',
        targetTab: 'production' as const
      }
    },
    {
      num: 3,
      name: 'Unit Transfers',
      subtitle: 'Moulding → Coating',
      qtyDisplay: `${stageTotals.transferredKg.toLocaleString('en-IN')} kg`,
      uomNote: 'Internal stock move',
      unitTag: 'One Firm Transfer',
      color: '#8E99A8', // Steel
      icon: <Truck className="w-5 h-5 text-[#8E99A8]" />,
      drilldown: {
        title: 'Internal Inter-Unit Movements',
        desc: 'One firm, one GST number. Movements between Moulding, Pearl, and Metalizing are stock transfers without challan.',
        targetTab: 'transfers' as const
      }
    },
    {
      num: 4,
      name: 'Coated Beads',
      subtitle: 'Pearl & Metalizing',
      qtyDisplay: `${stageTotals.coatedKg.toLocaleString('en-IN')} kg`,
      uomNote: 'P1-P2 & MZ1 coated',
      unitTag: 'Pearl / Metalizing',
      color: '#C98A9B', // Rose pearl
      icon: <Palette className="w-5 h-5 text-[#C98A9B]" />,
      drilldown: {
        title: 'Coated Bead Stock Ready for Threading',
        desc: '16 brochure shades (Off White, Ferozi, Magenta, Red, Gold Metallic). Weighed in KG before dispatch to karigars.',
        targetTab: 'stock' as const
      }
    },
    {
      num: 5,
      name: 'At Karigars',
      subtitle: 'Threading Job Work',
      qtyDisplay: `${stageTotals.atKarigarKg.toLocaleString('en-IN')} kg`,
      uomNote: 'Material out with karigars',
      unitTag: 'Outsourced Karigars',
      color: '#B98B4E', // Amber
      icon: <Users className="w-5 h-5 text-[#B98B4E]" />,
      drilldown: {
        title: 'Outsourced Karigar Threading Pipeline',
        desc: 'Beads sent out by KG, returning as strung bunches + loose beads + scrap. Live balance monitored against 15-day SLA.',
        targetTab: 'karigar' as const
      }
    },
    {
      num: 6,
      name: 'Finished & Sold',
      subtitle: 'Warehouse & Sales',
      qtyDisplay: `${stageTotals.finishedBunches.toLocaleString('en-IN')} bn`,
      uomNote: 'Bunches in warehouse',
      unitTag: 'GST & Kachcha Sales',
      color: '#2F8F6B', // Success emerald
      icon: <CheckCircle className="w-5 h-5 text-[#2F8F6B]" />,
      drilldown: {
        title: 'Finished Goods & Sales Dispatches',
        desc: 'Bunches and bulk KG ready for invoicing via GST Tax Invoice or Kachcha Bill with vehicle tracking.',
        targetTab: 'orders' as const
      }
    }
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-[#201F2B] p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {t('materialJourney')}
            </h2>
            <span className="text-xs text-slate-500 hidden sm:inline">· End-to-end GPPS Traceability</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tap any stage to drill down into unit inventory, batches, and movements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Total Dispatched to Date:
          </span>
          <span className="text-xs font-bold font-mono text-[#2B2A4C] dark:text-[#C9A86A] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            {stageTotals.dispatchedTotalKg.toLocaleString('en-IN')} kg
          </span>
        </div>
      </div>

      {/* Horizontal Flow Container (Scrollable on small mobile, grid on desktop) */}
      <div className="mt-4 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-stretch gap-3 min-w-[760px] lg:min-w-0 lg:grid lg:grid-cols-6">
          {stages.map((st, idx) => {
            const isSelected = selectedStage === st.num;
            return (
              <div key={st.num} className="relative flex items-center flex-1">
                <button
                  onClick={() => setSelectedStage(isSelected ? null : st.num)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'nacre-sheen border-[#C9A86A] shadow-md -translate-y-0.5'
                      : 'bg-slate-50/80 hover:bg-slate-100/90 dark:bg-slate-900/50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Stage 0{st.num}
                    </span>
                    <div className="p-1 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-xs">
                      {st.icon}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {st.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {st.subtitle}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-baseline justify-between">
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
                      {st.qtyDisplay}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {st.uomNote}
                  </div>

                  {/* Visual bottom indicator bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 transition-all"
                    style={{ backgroundColor: st.color }}
                  />
                </button>

                {/* Arrow connector between stages (hidden on last stage) */}
                {idx < stages.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2 z-10 w-4 h-4 rounded-full bg-white dark:bg-[#201F2B] border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-400">
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Drill-Down Panel when a stage is tapped */}
      {selectedStage !== null && (
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-[#FBFAF7] dark:from-slate-900 dark:to-[#17161F] border border-[#C9A86A]/40 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#C9A86A]/10 text-[#C9A86A] mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {stages[selectedStage - 1].drilldown.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                  {stages[selectedStage - 1].drilldown.desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab(stages[selectedStage - 1].drilldown.targetTab)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap self-end sm:self-center shadow-xs"
            >
              <span>View Complete {stages[selectedStage - 1].name} Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
