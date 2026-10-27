import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Users,
  AlertCircle,
  Plus,
  ArrowRightLeft,
  Send,
  PackageCheck,
  Clock,
  ArrowRight,
  X,
  CheckCircle2,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaterialJourneyBoard } from './MaterialJourneyBoard';
import { ProductionSummaryCard } from './ProductionSummaryCard';
import { StockSummaryCard } from './StockSummaryCard';
import { KarigarAlertCard } from './KarigarAlertCard';
import { ReceivablesCard } from './ReceivablesCard';
import { UnitProfitCard } from './UnitProfitCard';
import { WaitingOrdersCard } from './WaitingOrdersCard';
import { ManufacturingUnit, KarigarJobWork } from '../../types';
import { PLAIN_BEAD_SKUS, BROCHURE_PRODUCTS } from '../../data/seedData';
import { UnitTransferModal } from '../stock/UnitTransferModal';
import { StepByStepGuide } from './StepByStepGuide';
import { AssignedTasksSection } from './AssignedTasksSection';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    activeUnitFilter,
    setActiveUnitFilter,
    todayProduction,
    lowStockItems,
    overdueKarigarBatches,
    calculateItemStock,
    karigarWorks,
    parties,
    sendToKarigar,
    receiveFromKarigar,
    setActiveTab,
    flowMode,
    toggleFlowMode,
    t
  } = useApp();

  const [transferModalData, setTransferModalData] = useState<{
    open: boolean;
    fromUnit?: ManufacturingUnit;
    toUnit?: ManufacturingUnit;
    skuId?: string;
    qty?: string;
  } | null>(null);

  // Quick Karigar Dispatch Modal state
  const [quickKarigarData, setQuickKarigarData] = useState<{
    skuId: string;
    skuName: string;
    unit: 'pearl' | 'metalizing';
    qtyKg: number;
  } | null>(null);
  const karigars = parties.filter(p => p.type === 'Karigar');
  const [quickKarigarId, setQuickKarigarId] = useState(karigars[0]?.id || '');
  const [quickDispatchQty, setQuickDispatchQty] = useState('');

  // Quick Karigar Receive Modal state
  const [quickReceiveData, setQuickReceiveData] = useState<KarigarJobWork | null>(null);
  const [quickRecvBunches, setQuickRecvBunches] = useState('');
  const [quickRecvLoose, setQuickRecvLoose] = useState('10');
  const [quickRecvWaste, setQuickRecvWaste] = useState('2');

  const unitChips: { id: ManufacturingUnit | 'all'; label: string; color?: string }[] = [
    { id: 'all', label: t('allUnits') },
    { id: 'moulding', label: t('mouldingUnit'), color: '#4A5A7A' },
    { id: 'pearl', label: t('pearlUnit'), color: '#C98A9B' },
    { id: 'metalizing', label: t('metalizingUnit'), color: '#8E99A8' },
    { id: 'threading', label: t('threadingWork'), color: '#B98B4E' }
  ];

  // Plain beads with stock in Moulding ready for Pearl or Metalizing transfer
  const plainBeadsReady = PLAIN_BEAD_SKUS.map(sku => ({
    ...sku,
    mouldingStock: calculateItemStock(sku.id, 'moulding')
  })).filter(item => item.mouldingStock > 0);

  // Coated beads with stock in Pearl/Metalizing ready for Karigar dispatch
  const coatedBeadsReady = BROCHURE_PRODUCTS.map(sku => {
    const pearlStock = calculateItemStock(sku.id, 'pearl');
    const metalStock = calculateItemStock(sku.id, 'metalizing');
    const unit: 'pearl' | 'metalizing' = pearlStock >= metalStock ? 'pearl' : 'metalizing';
    const readyStock = pearlStock + metalStock;
    return {
      ...sku,
      unit,
      readyStock
    };
  }).filter(item => item.readyStock > 0);

  // Active Karigar Jobs awaiting receipt
  const pendingKarigarJobs = karigarWorks.filter(
    kw => kw.bunchesReceived === 0 || kw.status === 'Pending' || kw.status === 'Partially_Received' || kw.status === 'Overdue'
  );

  const handleQuickKarigarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickKarigarData) return;
    const qty = parseFloat(quickDispatchQty) || quickKarigarData.qtyKg;
    const slipNo = `SLIP-${Date.now().toString().slice(-4)}`;
    sendToKarigar(
      quickKarigarId,
      quickKarigarData.unit,
      quickKarigarData.skuId,
      qty,
      slipNo,
      2.5
    );
    setQuickKarigarData(null);
  };

  const handleQuickReceiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReceiveData) return;
    receiveFromKarigar(
      quickReceiveData.id,
      parseInt(quickRecvBunches) || 800,
      parseFloat(quickRecvLoose) || 0,
      parseFloat(quickRecvWaste) || 0,
      'Quick received via Material Flow Hub'
    );
    setQuickReceiveData(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Card with Nacre Sheen & Unit Quick Switcher */}
      <div className="rounded-3xl nacre-sheen p-4 sm:p-6 shadow-sm border border-[#C9A86A]/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{currentUser.avatar}</span>
              <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#2B2A4C] dark:text-[#C9C8F0]">
                Namaste, {currentUser.name.split(' (')[0]}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
              Supervising Moulding (M1–M4), Pearl (P1, P2), Metalizing (MZ1), and Outsourced Karigars under one unified GST identity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentUser.role === 'staff' ? (
              <button
                onClick={() => setActiveTab('quick_entry')}
                className="px-4 py-2.5 rounded-xl bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>30-Second Machine Log ({currentUser.assignedMachine || 'M1'})</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('production')}
                  className="px-3.5 py-2 rounded-xl bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Production Entry</span>
                </button>
                <button
                  onClick={() => setTransferModalData({ open: true, fromUnit: 'moulding', toUnit: 'pearl' })}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-4 h-4 text-[#C9A86A]" />
                  <span>Unit Transfer</span>
                </button>
                <button
                  onClick={() => setActiveTab('karigar')}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4 text-[#B98B4E]" />
                  <span>Karigar Slip</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 flex items-center justify-center font-mono font-bold text-[#4A5A7A] dark:text-[#7B8CAE] shadow-xs">
              4
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Moulding M1–M4</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {todayProduction.mouldingKg} kg ({todayProduction.avgYieldPct}% yield)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 flex items-center justify-center font-mono font-bold text-[#C98A9B] shadow-xs">
              2
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Pearl P1, P2</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {todayProduction.pearlKg} kg active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 flex items-center justify-center font-mono font-bold text-[#8E99A8] shadow-xs">
              1
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Metalizing MZ1</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {todayProduction.metalizingKg} kg gold/silver
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold shadow-xs ${
                overdueKarigarBatches.length > 0
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
              }`}
            >
              {overdueKarigarBatches.length}
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Overdue Karigar SLA</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {overdueKarigarBatches.length > 0 ? 'Action required (>15d)' : 'All on schedule'}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Unit Scope Filter Chips */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 overflow-x-auto pb-1">
          <span className="text-[11px] font-medium text-slate-400 mr-1 whitespace-nowrap">
            Scope View:
          </span>
          {unitChips.map(chip => (
            <button
              key={chip.id}
              onClick={() => setActiveUnitFilter(chip.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeUnitFilter === chip.id
                  ? 'bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] shadow-xs'
                  : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Beginner-First Interactive Step-by-Step Guide */}
      <StepByStepGuide />

      {/* Assigned Tasks for Machine Operators (Admin-Assignment State with Start Moulding Batch) */}
      <AssignedTasksSection />

      {/* Flagship Feature: Material Journey Board (6 Stages with Live KG/Bunch Totals) */}
      <MaterialJourneyBoard />

      {/* Seamless Flow Action Hub: Real-time Next Material Handoffs */}
      {currentUser.role !== 'staff' && (
        <div className="rounded-2xl bg-white dark:bg-[#201F2B] p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                  Seamless Flow Actions · Next Material Handoffs
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically move stock from Moulding to Coating, and from Coating to Karigar Threading in 1 tap.
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Zero manual ledger overhead
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* 1. Moulding -> Coating */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A5A7A] dark:text-[#7B8CAE]">
                    Step 1 · Moulding Output
                  </span>
                  <div className="p-1 rounded-md bg-white dark:bg-slate-800 shadow-xs">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#4A5A7A]" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Plain Beads Ready for Coating
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Moulded uncoloured stock waiting for Pearl or Metalizing.
                </p>

                <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {plainBeadsReady.length > 0 ? (
                    plainBeadsReady.slice(0, 3).map(item => (
                      <div
                        key={item.id}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div className="truncate mr-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.mouldingStock} kg in Moulding
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setTransferModalData({
                              open: true,
                              fromUnit: 'moulding',
                              toUnit: 'pearl',
                              skuId: item.id,
                              qty: String(item.mouldingStock)
                            })
                          }
                          className="px-2 py-1 rounded-md bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] text-[10px] font-semibold hover:opacity-90 shrink-0 shadow-xs flex items-center gap-1"
                        >
                          <span>Move</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-[11px] text-slate-400">
                      All moulded beads transferred!
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">M1–M4 Injection</span>
                <button
                  onClick={() => setActiveTab('production')}
                  className="font-medium text-[#2B2A4C] dark:text-[#C9A86A] hover:underline"
                >
                  Log New Batch →
                </button>
              </div>
            </div>

            {/* 2. Coating -> Karigar Threading */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C98A9B]">
                    Step 2 · Coating Output
                  </span>
                  <div className="p-1 rounded-md bg-white dark:bg-slate-800 shadow-xs">
                    <Send className="w-3.5 h-3.5 text-[#C98A9B]" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Coated Beads Ready for Threading
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Coloured beads from P1, P2 & MZ1 ready to dispatch out by KG.
                </p>

                <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {coatedBeadsReady.length > 0 ? (
                    coatedBeadsReady.slice(0, 3).map(item => (
                      <div
                        key={item.id}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div className="truncate mr-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.readyStock} kg ({item.unit})
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setQuickKarigarData({
                              skuId: item.id,
                              skuName: item.name,
                              unit: item.unit,
                              qtyKg: item.readyStock
                            });
                            setQuickDispatchQty(String(item.readyStock));
                          }}
                          className="px-2 py-1 rounded-md bg-[#B98B4E] text-white text-[10px] font-semibold hover:opacity-90 shrink-0 shadow-xs flex items-center gap-1"
                        >
                          <span>Send</span>
                          <Send className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-[11px] text-slate-400">
                      No coated stock waiting!
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">P1, P2 & MZ1</span>
                <button
                  onClick={() => setActiveTab('karigar')}
                  className="font-medium text-[#B98B4E] hover:underline"
                >
                  View Karigars →
                </button>
              </div>
            </div>

            {/* 3. Karigars -> Finished Bunches */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F8F6B]">
                    Step 3 · Karigar Return
                  </span>
                  <div className="p-1 rounded-md bg-white dark:bg-slate-800 shadow-xs">
                    <PackageCheck className="w-3.5 h-3.5 text-[#2F8F6B]" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Bunches Returning from Karigars
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Receive strung bunches, calculate loose bead & scrap balance.
                </p>

                <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {pendingKarigarJobs.length > 0 ? (
                    pendingKarigarJobs.slice(0, 3).map(kw => (
                      <div
                        key={kw.id}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div className="truncate mr-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                            {kw.karigarName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {kw.qtySentKg} kg ({kw.daysOut}d out)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setQuickReceiveData(kw);
                            setQuickRecvBunches('800');
                          }}
                          className="px-2 py-1 rounded-md bg-[#2F8F6B] text-white text-[10px] font-semibold hover:opacity-90 shrink-0 shadow-xs flex items-center gap-1"
                        >
                          <span>Receive</span>
                          <Check className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-[11px] text-slate-400">
                      All karigar lots received!
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Warehouse stock</span>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="font-medium text-[#2F8F6B] hover:underline"
                >
                  Create Invoice →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Factory Analytics & Status Cards */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              Unit Summaries & Factory Analytics
            </h3>
            <p className="text-xs text-slate-500">
              Machine yields, karigar SLA status, stock levels, and receivables
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ProductionSummaryCard />
          <KarigarAlertCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <StockSummaryCard />
          <WaitingOrdersCard />
        </div>

        {/* Admin Only Cards */}
        {currentUser.role === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ReceivablesCard />
            <UnitProfitCard />
          </div>
        )}
      </div>

      {/* Triggered Unit Transfer Modal */}
      {transferModalData?.open && (
        <UnitTransferModal
          onClose={() => setTransferModalData(null)}
          initialFromUnit={transferModalData.fromUnit}
          initialToUnit={transferModalData.toUnit}
          initialSkuId={transferModalData.skuId}
          initialQty={transferModalData.qty}
        />
      )}

      {/* Triggered Quick Karigar Dispatch Modal */}
      {quickKarigarData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#B98B4E]/10 text-[#B98B4E]">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                    Dispatch to Karigar for Threading
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    From {quickKarigarData.unit.toUpperCase()} Unit
                  </span>
                </div>
              </div>
              <button
                onClick={() => setQuickKarigarData(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickKarigarSubmit} className="space-y-3.5 pt-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Product SKU:
                </span>
                <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {quickKarigarData.skuName}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Select Karigar
                </label>
                <select
                  value={quickKarigarId}
                  onChange={e => setQuickKarigarId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                  required
                >
                  {karigars.map(k => (
                    <option key={k.id} value={k.id}>
                      {k.name} ({k.address || 'Bhiwandi'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Dispatch Weight (KG)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={quickDispatchQty}
                  onChange={e => setQuickDispatchQty(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickKarigarData(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B98B4E] text-white font-semibold shadow-xs flex items-center gap-1.5 hover:opacity-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate Karigar Slip</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Triggered Quick Karigar Receive Modal */}
      {quickReceiveData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#2F8F6B]/10 text-[#2F8F6B]">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                    Receive Threaded Bunches
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {quickReceiveData.karigarName} · Sent {quickReceiveData.qtySentKg} kg
                  </span>
                </div>
              </div>
              <button
                onClick={() => setQuickReceiveData(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickReceiveSubmit} className="space-y-3.5 pt-3">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Strung Bunches Received
                </label>
                <input
                  type="number"
                  value={quickRecvBunches}
                  onChange={e => setQuickRecvBunches(e.target.value)}
                  placeholder="e.g. 800"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Loose Beads (KG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={quickRecvLoose}
                    onChange={e => setQuickRecvLoose(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Scrap/Waste (KG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={quickRecvWaste}
                    onChange={e => setQuickRecvWaste(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickReceiveData(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2F8F6B] text-white font-semibold shadow-xs flex items-center gap-1.5 hover:opacity-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Inward & Reconcile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
