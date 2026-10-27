import React, { useState } from 'react';
import {
  Plus,
  Activity,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  Send,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PLAIN_BEAD_SKUS, BROCHURE_PRODUCTS } from '../../data/seedData';
import { BeadStringProgress } from '../common/BeadStringProgress';
import { UnitTransferModal } from '../stock/UnitTransferModal';
import { OperatorMachineView } from './OperatorMachineView';

export const ProductionView: React.FC = () => {
  const {
    mouldingEntries,
    coatingBatches,
    addMouldingProduction,
    addCoatingBatch,
    currentUser,
    setActiveTab,
    sendToKarigar,
    parties,
    t
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'operator_moulding' | 'moulding' | 'coating'>('operator_moulding');
  const [showMouldingModal, setShowMouldingModal] = useState(false);
  const [showCoatingModal, setShowCoatingModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Seamless Flow Banner States
  const [mouldingFlowSuccess, setMouldingFlowSuccess] = useState<{
    skuId: string;
    skuName: string;
    goodKg: number;
  } | null>(null);

  const [coatingFlowSuccess, setCoatingFlowSuccess] = useState<{
    skuId: string;
    skuName: string;
    outputKg: number;
    unit: 'pearl' | 'metalizing';
  } | null>(null);

  // Quick Karigar Dispatch Modal state from Coating
  const [showQuickKarigarModal, setShowQuickKarigarModal] = useState(false);
  const karigars = parties.filter(p => p.type === 'Karigar');
  const [quickKarigarId, setQuickKarigarId] = useState(karigars[0]?.id || '');

  // Form states for Moulding
  const [mDate, setMDate] = useState(new Date().toISOString().slice(0, 10));
  const [mShift, setMShift] = useState<'Day' | 'Night'>('Day');
  const [mMachine, setMMachine] = useState<'M1' | 'M2' | 'M3' | 'M4'>('M1');
  const [mMould, setMMould] = useState('MLD-3R-64CAV');
  const [mSkuId, setMSkuId] = useState(PLAIN_BEAD_SKUS[0].id);
  const [mGpps, setMGpps] = useState('250');
  const [mGood, setMGood] = useState('240');
  const [mWaste, setMWaste] = useState('10');
  const [mRegrind, setMRegrind] = useState('15');
  const [mBags, setMBags] = useState('10');
  const [mDowntime, setMDowntime] = useState('0');
  const [mDtReason, setMDtReason] = useState('');
  const [mRemarks, setMRemarks] = useState('');

  // Form states for Coating (Pearl / Metalizing)
  const [cDate, setCDate] = useState(new Date().toISOString().slice(0, 10));
  const [cShift, setCShift] = useState<'Day' | 'Night'>('Day');
  const [cUnit, setCUnit] = useState<'pearl' | 'metalizing'>('pearl');
  const [cMachine, setCMachine] = useState<'P1' | 'P2' | 'MZ1'>('P1');
  const [cInputSkuId, setCInputSkuId] = useState(PLAIN_BEAD_SKUS[0].id);
  const [cInputKg, setCInputKg] = useState('150');
  const [cOutputSkuId, setCOutputSkuId] = useState(BROCHURE_PRODUCTS[0].id);
  const [cOutputKg, setCOutputKg] = useState('148');
  const [cRejectsKg, setCRejectsKg] = useState('2');
  const [cRemarks, setCRemarks] = useState('High gloss finish');

  // Live yield calculation for Moulding modal
  const liveGpps = parseFloat(mGpps) || 0;
  const liveGood = parseFloat(mGood) || 0;
  const liveRegrind = parseFloat(mRegrind) || 0;
  const liveInputTotal = liveGpps + liveRegrind;
  const liveYieldPct = liveInputTotal > 0 ? (liveGood / liveInputTotal) * 100 : 0;

  const handleMouldingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sku = PLAIN_BEAD_SKUS.find(p => p.id === mSkuId);
    if (!sku) return;

    addMouldingProduction({
      date: mDate,
      shift: mShift,
      machineId: mMachine,
      mouldId: mMould,
      skuId: sku.id,
      skuName: sku.name,
      gppsUsedKg: liveGpps,
      goodBeadsKg: liveGood,
      wasteKg: parseFloat(mWaste) || 0,
      regrindReusedKg: liveRegrind,
      bagsPacked: parseInt(mBags) || 1,
      yieldPct: Number(liveYieldPct.toFixed(2)),
      operatorName: currentUser.name.split(' (')[0],
      downtimeMinutes: parseInt(mDowntime) || 0,
      downtimeReason: mDtReason,
      remarks: mRemarks
    });

    setMouldingFlowSuccess({
      skuId: sku.id,
      skuName: sku.name,
      goodKg: liveGood
    });
    setShowMouldingModal(false);
  };

  const handleCoatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const outSku = BROCHURE_PRODUCTS.find(p => p.id === cOutputSkuId);
    if (!outSku) return;

    const outKgNum = parseFloat(cOutputKg) || 0;

    addCoatingBatch({
      date: cDate,
      shift: cShift,
      unit: cUnit,
      machineId: cMachine,
      inputPlainSkuId: cInputSkuId,
      inputPlainKg: parseFloat(cInputKg) || 0,
      materialsUsed: [
        {
          materialId: cUnit === 'pearl' ? 'rm-pearl-essence' : 'rm-al-wire',
          materialName: cUnit === 'pearl' ? 'Pearl Essence' : 'Aluminium Wire',
          qty: cUnit === 'pearl' ? 3.5 : 2.0,
          unit: cUnit === 'pearl' ? 'litre' : 'kg'
        }
      ],
      outputSkuId: outSku.id,
      outputSkuName: outSku.name,
      outputColour: outSku.colour,
      outputKg: outKgNum,
      rejectsKg: parseFloat(cRejectsKg) || 0,
      operatorName: currentUser.name.split(' (')[0],
      remarks: cRemarks
    });

    setCoatingFlowSuccess({
      skuId: outSku.id,
      skuName: outSku.name,
      outputKg: outKgNum,
      unit: cUnit
    });
    setShowCoatingModal(false);
  };

  const handleQuickKarigarSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coatingFlowSuccess) return;
    const slipNo = `SLIP-26-${Math.floor(100 + Math.random() * 900)}`;
    sendToKarigar(
      quickKarigarId,
      coatingFlowSuccess.unit,
      coatingFlowSuccess.skuId,
      coatingFlowSuccess.outputKg,
      slipNo,
      2.5
    );
    setShowQuickKarigarModal(false);
    setCoatingFlowSuccess(null);
    setActiveTab('karigar');
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-xs">
      {/* Top Header & New Entry Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Production Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Log moulding shots and coating batches. Raw polymer consumption and output stock are automatically updated.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMouldingModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#4A5A7A] hover:bg-[#3B4862] text-white font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Moulding Entry (M1–M4)</span>
          </button>

          <button
            onClick={() => setShowCoatingModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C98A9B] hover:bg-[#B67688] text-white font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Coating Batch (P/MZ)</span>
          </button>
        </div>
      </div>

      {/* Seamless Material Flow Trigger: Moulding to Coating */}
      {mouldingFlowSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
              Moulding Shot Recorded ({mouldingFlowSuccess.goodKg} kg {mouldingFlowSuccess.skuName})
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#201F2B] border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Next Step: Move plain beads to Pearl or Metalizing unit?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTransferModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#C98A9B] text-white font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Transfer to Coating</span>
              </button>
              <button
                onClick={() => setMouldingFlowSuccess(null)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seamless Material Flow Trigger: Coating to Karigar Threading */}
      {coatingFlowSuccess && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-bold text-sm text-amber-900 dark:text-amber-200">
              Coating Batch Completed ({coatingFlowSuccess.outputKg} kg {coatingFlowSuccess.skuName})
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#201F2B] border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Next Step: Dispatch directly to Karigar for threading?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuickKarigarModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#B98B4E] text-white font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Karigar Now</span>
              </button>
              <button
                onClick={() => setCoatingFlowSuccess(null)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Segmented Switcher for Moulding vs Coating Batches */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('operator_moulding')}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'operator_moulding'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          M1/M2 Operator Workstation & Salary
        </button>
        <button
          onClick={() => setActiveSubTab('moulding')}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'moulding'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Moulding Logs (M1–M4)
        </button>
        <button
          onClick={() => setActiveSubTab('coating')}
          className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
            activeSubTab === 'coating'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Coating Batches (Pearl & Metalizing)
        </button>
      </div>

      {/* SubTab 0: M1 & M2 Dedicated Operator Workstation with Real-time Piece-Rate Earnings */}
      {activeSubTab === 'operator_moulding' && (
        <OperatorMachineView />
      )}

      {/* SubTab 1: Moulding Batches */}
      {activeSubTab === 'moulding' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-white dark:bg-[#201F2B] overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80">
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Moulding Machine Production Logs
              </span>
              <span className="text-slate-400">{mouldingEntries.length} total entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Date & Shift</th>
                    <th className="py-3 px-4 font-semibold">Machine</th>
                    <th className="py-3 px-4 font-semibold">Plain Bead SKU</th>
                    <th className="py-3 px-4 font-semibold text-right">GPPS Used</th>
                    <th className="py-3 px-4 font-semibold text-right">Good Beads</th>
                    <th className="py-3 px-4 font-semibold text-right">Waste</th>
                    <th className="py-3 px-4 font-semibold text-center">Yield</th>
                    <th className="py-3 px-4 font-semibold">Bags & Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {mouldingEntries.map(entry => (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {entry.date}
                        </div>
                        <div className="text-[11px] text-slate-400">{entry.shift} Shift</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-[#4A5A7A] dark:text-[#7B8CAE] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          {entry.machineId}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                          {entry.skuName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {entry.mouldId}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        {entry.gppsUsedKg} kg
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                        {entry.goodBeadsKg} kg
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-rose-500">
                        {entry.wasteKg} kg
                      </td>

                      <td className="py-3 px-4 text-center">
                        <BeadStringProgress value={entry.yieldPct} unitColor="#4A5A7A" />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-700 dark:text-slate-300">
                          {entry.bagsPacked} bags (25kg)
                        </div>
                        <div className="text-[11px] text-slate-400">Op: {entry.operatorName}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Coating Batches */}
      {activeSubTab === 'coating' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-white dark:bg-[#201F2B] overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80">
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Pearl & Metalizing Coating Batches
              </span>
              <span className="text-slate-400">{coatingBatches.length} batches recorded</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Date & Shift</th>
                    <th className="py-3 px-4 font-semibold">Unit & Machine</th>
                    <th className="py-3 px-4 font-semibold">Plain Input (KG)</th>
                    <th className="py-3 px-4 font-semibold">Finished Coated Output</th>
                    <th className="py-3 px-4 font-semibold text-right">Output (KG)</th>
                    <th className="py-3 px-4 font-semibold text-right">Rejects</th>
                    <th className="py-3 px-4 font-semibold">Operator & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {coatingBatches.map(batch => (
                    <tr
                      key={batch.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {batch.date}
                        </div>
                        <div className="text-[11px] text-slate-400">{batch.shift} Shift</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 capitalize text-slate-700 dark:text-slate-300">
                          {batch.unit} · {batch.machineId}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        {batch.inputPlainKg} kg
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {batch.outputSkuName}
                        </div>
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          {batch.outputColour}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                        {batch.outputKg} kg
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-rose-500">
                        {batch.rejectsKg} kg
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-700 dark:text-slate-300">{batch.operatorName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {batch.remarks}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Moulding Production Entry */}
      {showMouldingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              New Moulding Production Log
            </h3>
            <p className="text-slate-500 mb-4">
              Melt GPPS into plain beads, weigh in KG, pack in 25kg bags.
            </p>

            <form onSubmit={handleMouldingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={mDate}
                    onChange={e => setMDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Shift
                  </label>
                  <select
                    value={mShift}
                    onChange={e => setMShift(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    <option value="Day">Day Shift</option>
                    <option value="Night">Night Shift</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Machine
                  </label>
                  <select
                    value={mMachine}
                    onChange={e => setMMachine(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    <option value="M1">Machine M1</option>
                    <option value="M2">Machine M2</option>
                    <option value="M3">Machine M3</option>
                    <option value="M4">Machine M4</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Mould Code
                  </label>
                  <input
                    type="text"
                    value={mMould}
                    onChange={e => setMMould(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Product (Plain Bead)
                </label>
                <select
                  value={mSkuId}
                  onChange={e => setMSkuId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                >
                  {PLAIN_BEAD_SKUS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Beginner Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[10px] font-semibold text-slate-400">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setMGpps('250');
                    setMGood('240');
                    setMWaste('10');
                    setMBags('10');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  10 Bags (250 kg)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMGpps('300');
                    setMGood('288');
                    setMWaste('12');
                    setMBags('12');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  12 Bags (300 kg)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMGpps('125');
                    setMGood('120');
                    setMWaste('5');
                    setMBags('5');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  5 Bags (125 kg)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    GPPS Used (KG)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    value={mGpps}
                    onChange={e => setMGpps(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    Good Beads (KG)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    value={mGood}
                    onChange={e => setMGood(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 border-emerald-500 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-rose-600 mb-1">Waste (KG)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={mWaste}
                    onChange={e => setMWaste(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Regrind (KG)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    value={mRegrind}
                    onChange={e => setMRegrind(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Bags Packed
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={mBags}
                    onChange={e => setMBags(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-center"
                  />
                </div>
              </div>

              {/* Yield visualizer inside modal */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Calculated Yield %
                  </span>
                  <div className="text-[10px] text-slate-400">
                    Good Beads / (GPPS + Regrind)
                  </div>
                </div>
                <BeadStringProgress value={liveYieldPct} unitColor="#4A5A7A" />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMouldingModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4A5A7A] text-white font-semibold shadow-xs hover:bg-[#3B4862]"
                >
                  Save Moulding Shot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Coating Batch Entry */}
      {showCoatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              New Coating Batch (Pearl / Metalizing)
            </h3>
            <p className="text-slate-500 mb-4">
              Add colours and finishes to plain beads before threading.
            </p>

            <form onSubmit={handleCoatingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Coating Unit
                  </label>
                  <select
                    value={cUnit}
                    onChange={e => {
                      const u = e.target.value as any;
                      setCUnit(u);
                      setCMachine(u === 'pearl' ? 'P1' : 'MZ1');
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 capitalize"
                  >
                    <option value="pearl">Pearl Coating (P1, P2)</option>
                    <option value="metalizing">Metalizing (MZ1)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Machine
                  </label>
                  <select
                    value={cMachine}
                    onChange={e => setCMachine(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    {cUnit === 'pearl' ? (
                      <>
                        <option value="P1">Barrel P1</option>
                        <option value="P2">Barrel P2</option>
                      </>
                    ) : (
                      <option value="MZ1">Vacuum Chamber MZ1</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Input Plain Bead SKU
                </label>
                <select
                  value={cInputSkuId}
                  onChange={e => setCInputSkuId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                >
                  {PLAIN_BEAD_SKUS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Beginner Coating Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[10px] font-semibold text-slate-400">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCInputKg('150');
                    setCOutputKg('148');
                    setCRejectsKg('2');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  1 Drum (150 kg)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCInputKg('300');
                    setCOutputKg('296');
                    setCRejectsKg('4');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  2 Drums (300 kg)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCInputKg('75');
                    setCOutputKg('74');
                    setCRejectsKg('1');
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Half Drum (75 kg)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Input Plain Beads (KG)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    value={cInputKg}
                    onChange={e => setCInputKg(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    Output Coated Beads (KG)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    value={cOutputKg}
                    onChange={e => setCOutputKg(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 border-emerald-500 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Finished Output SKU & Colour
                </label>
                <select
                  value={cOutputSkuId}
                  onChange={e => setCOutputSkuId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                >
                  {BROCHURE_PRODUCTS.filter(
                    b => (cUnit === 'pearl' ? b.process === 'Pearl' : b.process === 'Metalizing')
                  ).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.colour})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-rose-600 mb-1">
                    Rejects / Dust (KG)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={cRejectsKg}
                    onChange={e => setCRejectsKg(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Batch Notes
                  </label>
                  <input
                    type="text"
                    value={cRemarks}
                    onChange={e => setCRemarks(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCoatingModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C98A9B] text-white font-semibold shadow-xs hover:bg-[#B67688]"
                >
                  Save Coating Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Unit Transfer Modal */}
      {showTransferModal && (
        <UnitTransferModal onClose={() => setShowTransferModal(false)} />
      )}

      {/* Modal: Quick Karigar Dispatch directly after Coating */}
      {showQuickKarigarModal && coatingFlowSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Dispatch Directly to Karigar
            </h3>
            <p className="text-slate-500 mb-4">
              Sending {coatingFlowSuccess.outputKg} kg of {coatingFlowSuccess.skuName} from {coatingFlowSuccess.unit} unit.
            </p>

            <form onSubmit={handleQuickKarigarSend} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Choose Karigar
                </label>
                <select
                  value={quickKarigarId}
                  onChange={e => setQuickKarigarId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {karigars.map(k => (
                    <option key={k.id} value={k.id}>
                      {k.name} ({k.address.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Weight to Dispatch:</span>
                  <span className="font-bold">{coatingFlowSuccess.outputKg} kg</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Threading SLA:</span>
                  <span>15 Days</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQuickKarigarModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B98B4E] text-white font-semibold flex items-center gap-1.5 shadow-xs hover:bg-[#A3783D]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate Slip & Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
