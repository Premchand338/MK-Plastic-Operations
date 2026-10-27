import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  ArrowRightLeft,
  Send,
  Recycle,
  FileText,
  DollarSign,
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  X,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PLAIN_BEAD_SKUS } from '../../data/seedData';
import { UnitTransferModal } from '../stock/UnitTransferModal';

export const OperatorMachineView: React.FC = () => {
  const {
    currentUser,
    mouldingTasks,
    operatorSessions,
    selectedMouldingTaskId,
    setSelectedMouldingTaskId,
    assignMouldingTask,
    submitOperatorMouldingSession,
    recycleMouldingWaste,
    getOperatorEarnings,
    rawMaterials,
    products,
    setActiveTab,
    createSalesOrder,
    sendToKarigar,
    parties,
    productionPrograms,
    incrementProgramPackets,
    completeProductionProgram,
    t
  } = useApp();

  // Machine selection: M1 or M2
  const [machineId, setMachineId] = useState<'M1' | 'M2'>(
    currentUser.assignedMachine === 'M2' ? 'M2' : 'M1'
  );

  // Dedicated operator for chosen machine
  const operatorName = machineId === 'M1' ? 'Pawan Kumar' : 'Raju Vishwakarma';
  const operatorId = machineId === 'M1' ? 'user-staff-m1' : 'user-staff-m2';

  // Active task assigned by Admin for this machine
  const activeTask = mouldingTasks.find(
    t => t.machineId === machineId && (t.status === 'In_Progress' || t.status === 'Assigned')
  );

  // Active program from Admin/Owner for this machine
  const activeProgram = productionPrograms.find(
    p => p.machineId === machineId && p.status === 'Running'
  ) || productionPrograms.find(p => p.machineId === machineId);

  // Session inputs
  const [rawUsedKg, setRawUsedKg] = useState<string>('200');
  const [wasteKg, setWasteKg] = useState<string>('80');
  const [mouldedBeadsKg, setMouldedBeadsKg] = useState<string>('120');
  const [pieceRate, setPieceRate] = useState<string>(activeTask ? String(activeTask.pieceRatePerKg) : '3.0');
  const [selectedRawId, setSelectedRawId] = useState<string>(
    activeTask?.rawMaterialId || 'rm-gpps-black'
  );
  const [selectedSkuId, setSelectedSkuId] = useState<string>(
    activeTask?.targetSkuId || PLAIN_BEAD_SKUS[0].id
  );

  // Auto-sync form when a specific task is selected from Dashboard
  useEffect(() => {
    if (selectedMouldingTaskId) {
      const task = mouldingTasks.find(t => t.id === selectedMouldingTaskId);
      if (task) {
        setMachineId(task.machineId);
        setSelectedRawId(task.rawMaterialId);
        setSelectedSkuId(task.targetSkuId);
        setRawUsedKg(String(task.rawAllocatedKg));
        setPieceRate(String(task.pieceRatePerKg));
        const defBeads = Math.round(task.rawAllocatedKg * 0.6);
        const defWaste = task.rawAllocatedKg - defBeads;
        setMouldedBeadsKg(String(defBeads));
        setWasteKg(String(defWaste));
      }
    }
  }, [selectedMouldingTaskId, mouldingTasks]);

  // Modal states for Post-Session Actions
  const [submittedSession, setSubmittedSession] = useState<{
    sessionId: string;
    mouldedKg: number;
    wasteKg: number;
    skuId: string;
    skuName: string;
    salaryEarned: number;
  } | null>(null);

  const [showLooseSaleModal, setShowLooseSaleModal] = useState(false);
  const [showMoveToThreadingModal, setShowMoveToThreadingModal] = useState(false);
  const [wasteRecycledSuccess, setWasteRecycledSuccess] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Loose Sale modal form
  const customers = parties.filter(p => p.type === 'Customer');
  const [salePartyId, setSalePartyId] = useState(customers[0]?.id || '');
  const [saleRate, setSaleRate] = useState('165');
  const [saleBillType, setSaleBillType] = useState<'GST_Tax_Invoice' | 'Kachcha_Estimate'>('GST_Tax_Invoice');
  const [saleVehicleNo, setSaleVehicleNo] = useState('MH-04-AB-1234');

  // Threading Move modal form
  const karigars = parties.filter(p => p.type === 'Karigar');
  const [karigarId, setKarigarId] = useState(karigars[0]?.id || '');
  const [threadingRate, setThreadingRate] = useState('2.5');

  // Admin Task Assignment Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignMachine, setAssignMachine] = useState<'M1' | 'M2'>('M1');
  const [assignRawId, setAssignRawId] = useState('rm-gpps-black');
  const [assignSkuId, setAssignSkuId] = useState(PLAIN_BEAD_SKUS[0].id);
  const [assignAllocatedKg, setAssignAllocatedKg] = useState('200');
  const [assignPieceRate, setAssignPieceRate] = useState('3.0');
  const [assignNotes, setAssignNotes] = useState('Black bead batch for wholesale order');

  // Auto-calculate Moulded Beads when Raw or Waste changes
  const handleRawChange = (val: string) => {
    setRawUsedKg(val);
    const raw = parseFloat(val) || 0;
    const wst = parseFloat(wasteKg) || 0;
    setMouldedBeadsKg(String(Math.max(0, raw - wst)));
  };

  const handleWasteChange = (val: string) => {
    setWasteKg(val);
    const raw = parseFloat(rawUsedKg) || 0;
    const wst = parseFloat(val) || 0;
    setMouldedBeadsKg(String(Math.max(0, raw - wst)));
  };

  // Real-time computations
  const rawNum = parseFloat(rawUsedKg) || 0;
  const wasteNum = parseFloat(wasteKg) || 0;
  const mouldedNum = parseFloat(mouldedBeadsKg) || 0;
  const rateNum = parseFloat(pieceRate) || 3.0;
  const currentSessionSalary = mouldedNum * rateNum;
  const liveYield = rawNum > 0 ? (mouldedNum / rawNum) * 100 : 0;

  // Real-time Earnings of this operator
  const earnings = getOperatorEarnings(operatorId);

  // Handle Session Submission
  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawMat = rawMaterials.find(rm => rm.id === selectedRawId);
    const sku = products.find(p => p.id === selectedSkuId) || PLAIN_BEAD_SKUS[0];

    const result = submitOperatorMouldingSession({
      taskId: activeTask?.id,
      operatorId,
      operatorName,
      machineId,
      rawMaterialId: selectedRawId,
      rawMaterialName: rawMat ? rawMat.name : 'Virgin GPPS Granules',
      targetSkuId: sku.id,
      targetSkuName: sku.name,
      rawMaterialUsedKg: rawNum,
      wasteGeneratedKg: wasteNum,
      mouldedBeadsKg: mouldedNum,
      pieceRatePerKg: rateNum,
      salaryEarned: currentSessionSalary,
      yieldPct: Number(liveYield.toFixed(1)),
      bagsPacked: Math.ceil(mouldedNum / 25),
      postActionTaken: 'Stored_In_Moulding'
    });

    setSubmittedSession({
      sessionId: result.sessionId,
      mouldedKg: mouldedNum,
      wasteKg: wasteNum,
      skuId: sku.id,
      skuName: sku.name,
      salaryEarned: result.salaryEarned
    });
    setWasteRecycledSuccess(false);
  };

  // Post Action 1: Loose Sale Submit
  const handleDirectLooseSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedSession) return;
    const customer = customers.find(c => c.id === salePartyId);
    if (!customer) return;

    createSalesOrder({
      orderNo: `ORD-LOOSE-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      partyId: customer.id,
      partyName: customer.name,
      promisedDate: new Date().toISOString().slice(0, 10),
      subtotal: submittedSession.mouldedKg * (parseFloat(saleRate) || 165),
      status: 'Dispatched',
      items: [
        {
          skuId: submittedSession.skuId,
          skuName: submittedSession.skuName,
          qty: submittedSession.mouldedKg,
          uom: 'KG',
          rate: parseFloat(saleRate) || 165,
          amount: submittedSession.mouldedKg * (parseFloat(saleRate) || 165),
          stockAvailable: submittedSession.mouldedKg,
          isShortage: false
        }
      ],
      dispatches: [
        {
          dispatchId: `DSP-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          vehicleNo: saleVehicleNo,
          items: [{ skuId: submittedSession.skuId, qty: submittedSession.mouldedKg, uom: 'KG' }]
        }
      ],
      notes: `Direct loose sale from Moulding machine ${machineId}. Bill: ${saleBillType.replace('_', ' ')}`
    });

    setShowLooseSaleModal(false);
    setActionFeedback(`Loose sale invoice recorded for ${submittedSession.mouldedKg} kg to ${customer.name}!`);
  };

  // Post Action 2: Move to Threading Submit
  const handleMoveToThreading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedSession) return;
    const slipNo = `SLIP-TH-${Date.now().toString().slice(-4)}`;
    sendToKarigar(
      karigarId,
      'pearl', // internal dispatch route
      submittedSession.skuId,
      submittedSession.mouldedKg,
      slipNo,
      parseFloat(threadingRate) || 2.5
    );
    setShowMoveToThreadingModal(false);
    setActionFeedback(`Moulded beads (${submittedSession.mouldedKg} kg) moved directly to Threading slip ${slipNo}!`);
  };

  // Post Action 3: Recycle Waste
  const handleRecycleWaste = () => {
    if (!submittedSession || submittedSession.wasteKg <= 0) return;
    recycleMouldingWaste(submittedSession.sessionId, submittedSession.wasteKg);
    setWasteRecycledSuccess(true);
  };

  // Admin Task Assignment Submit
  const handleAssignTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawMat = rawMaterials.find(rm => rm.id === assignRawId);
    const sku = products.find(p => p.id === assignSkuId) || PLAIN_BEAD_SKUS[0];
    const opName = assignMachine === 'M1' ? 'Pawan Kumar' : 'Raju Vishwakarma';
    const opId = assignMachine === 'M1' ? 'user-staff-m1' : 'user-staff-m2';

    assignMouldingTask({
      adminId: currentUser.id,
      assignedOperatorId: opId,
      assignedOperatorName: opName,
      machineId: assignMachine,
      rawMaterialId: assignRawId,
      rawMaterialName: rawMat ? rawMat.name : 'Virgin GPPS Granules',
      targetSkuId: sku.id,
      targetSkuName: sku.name,
      rawAllocatedKg: parseFloat(assignAllocatedKg) || 200,
      pieceRatePerKg: parseFloat(assignPieceRate) || 3.0,
      notes: assignNotes
    });

    setShowAssignModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-xs">
      {/* Header & Machine Persona Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Moulding Machine Console
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] font-bold">
              {machineId}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Dedicated 2-Machine Operation · Melt raw plastic granules, separate waste, calculate piece-rate salary in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-3 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-semibold flex items-center gap-1.5 shadow-xs hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign New Task</span>
            </button>
          )}

          {/* Machine 1 vs Machine 2 Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setMachineId('M1')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 ${
                machineId === 'M1'
                  ? 'bg-white dark:bg-[#201F2B] text-[#2B2A4C] dark:text-[#C9A86A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Machine M1</span>
              <span className="text-[10px] font-normal opacity-70">(Pawan)</span>
            </button>
            <button
              onClick={() => setMachineId('M2')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 ${
                machineId === 'M2'
                  ? 'bg-white dark:bg-[#201F2B] text-[#2B2A4C] dark:text-[#C9A86A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Machine M2</span>
              <span className="text-[10px] font-normal opacity-70">(Raju)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-xs">{actionFeedback}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 🔴 LIVE PROCESS UPDATE: WHAT'S RUNNING IN MACHINE (Client Requirement) */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-[#1E1D2B] to-[#2B2A4C] text-white p-5 sm:p-6 border border-indigo-800/50 shadow-md relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-300">
                Live Process Update · What's Running In {machineId}
              </span>
              {activeProgram && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-900/80 border border-indigo-700/60 text-indigo-200 font-bold">
                  {activeProgram.programNo}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-extrabold text-white mt-1">
              {activeProgram ? activeProgram.targetSkuName : `Moulding Cycle Active on ${machineId}`}
            </h2>
            <div className="text-xs text-indigo-200/80 flex items-center gap-2 mt-0.5 font-mono">
              <span>Lot/Offer: {activeProgram?.rawLotName || 'Virgin GPPS Black'}</span>
              <span>·</span>
              <span>Cycle: {activeProgram?.liveCycleSeconds || 42}s / mould</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeProgram?.status === 'Running' ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
                RUNNING (Active)
              </span>
            ) : (
              <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 font-bold text-xs">
                Standby / Ready
              </span>
            )}
          </div>
        </div>

        {/* Live Packet Counter & Progress from Offer */}
        {activeProgram && (
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-3 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[11px] text-indigo-200 font-medium">
                  How much packets we've got from this offer:
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold font-mono text-emerald-300 tabular-nums">
                    {activeProgram.packetsCompleted}
                  </span>
                  <span className="text-sm font-mono text-indigo-200">
                    / {activeProgram.targetPackets} Packets Target
                  </span>
                  <span className="text-xs text-indigo-300 font-medium">
                    ({Math.min(100, Math.round((activeProgram.packetsCompleted / activeProgram.targetPackets) * 100))}%)
                  </span>
                </div>
              </div>

              {/* 1-Tap packet counters for the worker */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => incrementProgramPackets(activeProgram.id, 1)}
                  className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  +1 Packet
                </button>
                <button
                  type="button"
                  onClick={() => incrementProgramPackets(activeProgram.id, 5)}
                  className="px-3 py-2 rounded-xl bg-emerald-500/80 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  +5 Pkts
                </button>
                <button
                  type="button"
                  onClick={() => incrementProgramPackets(activeProgram.id, 10)}
                  className="px-3 py-2 rounded-xl bg-emerald-500/60 hover:bg-emerald-400 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  +10 Pkts
                </button>
                {activeProgram.status === 'Running' && (
                  <button
                    type="button"
                    onClick={() => completeProductionProgram(activeProgram.id)}
                    className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
                    title="Mark program completed"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 via-emerald-400 to-emerald-300 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((activeProgram.packetsCompleted / activeProgram.targetPackets) * 100))}%`
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-indigo-200/80 font-mono">
              <span>Allocated Raw: {activeProgram.rawAllocatedKg} kg ({activeProgram.packagingUnit.replace('_', ' ')})</span>
              <span>Remaining: {Math.max(0, activeProgram.targetPackets - activeProgram.packetsCompleted)} Packets</span>
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Piece-Rate Operator Earnings Banner */}
      <div className="rounded-3xl nacre-sheen p-4 sm:p-5 border border-[#C9A86A]/40 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2B2A4C] text-white dark:bg-[#C9A86A] dark:text-[#1E1D2B] flex items-center justify-center font-bold text-sm">
              ₹
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Real-Time Operator Payout · {operatorName}
              </div>
              <div className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                Piece-Rate: ₹{rateNum.toFixed(2)} per kg of moulded beads
              </div>
            </div>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            Earnings update instantly upon submission
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Today's Payout
            </span>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              ₹{earnings.todayEarned.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500">Credited to salary</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Current Session Value
            </span>
            <div className="text-xl font-bold font-mono text-[#2B2A4C] dark:text-[#C9A86A] mt-0.5">
              ₹{currentSessionSalary.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500">{mouldedNum} kg × ₹{rateNum}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Weekly Cumulative
            </span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
              ₹{earnings.weekEarned.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500">Total earned this week</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Beads Moulded
            </span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
              {earnings.totalKgProduced} kg
            </div>
            <span className="text-[10px] text-slate-500">Good beads output</span>
          </div>
        </div>
      </div>

      {/* Active Admin Assigned Task Notification */}
      {activeTask ? (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  Assigned Job by Admin
                </span>
                <span className="text-blue-300">·</span>
                <span className="text-xs text-blue-600 dark:text-blue-400">{activeTask.assignedDate}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {activeTask.rawMaterialName} → {activeTask.targetSkuName}
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Target Raw: {activeTask.rawAllocatedKg} kg · Piece-Rate: ₹{activeTask.pieceRatePerKg}/kg · {activeTask.notes}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shrink-0 self-start sm:self-center">
            Task In Progress
          </span>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-center">
          No pending admin task assigned for {machineId}. You can log a standard shift session below.
        </div>
      )}

      {/* Main Single-Session Operation Log Form */}
      <div className="rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Log Machine Session ({machineId} · {operatorName})
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            Input the total raw material fed into {machineId}, separated waste, and extracted good beads.
          </p>
        </div>

        <form onSubmit={handleSessionSubmit} className="space-y-4">
          {/* Material & SKU Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Raw Material Granules
              </label>
              <select
                value={selectedRawId}
                onChange={e => setSelectedRawId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
              >
                {rawMaterials
                  .filter(rm => rm.applicableUnit === 'moulding')
                  .map(rm => (
                    <option key={rm.id} value={rm.id}>
                      {rm.name} (Stock: {rm.currentStock} kg)
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Plain Bead Shape & Size
              </label>
              <select
                value={selectedSkuId}
                onChange={e => setSelectedSkuId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
              >
                {PLAIN_BEAD_SKUS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Bag Presets */}
          <div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] font-semibold text-slate-400">Standard 25kg Bag Presets:</span>
              <button
                type="button"
                onClick={() => {
                  handleRawChange('25');
                  handleWasteChange('10');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                1 Bag (25 kg → 15 kg Beads + 10 kg Waste)
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRawChange('200');
                  handleWasteChange('80');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                8 Bags (200 kg → 120 kg Beads + 80 kg Waste)
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRawChange('250');
                  handleWasteChange('15');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                10 Bags (250 kg → 235 kg Beads)
              </button>
            </div>
          </div>

          {/* Core Calculation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Input 1: Raw Material Used */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                1. Total Raw In (KG)
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                value={rawUsedKg}
                onChange={e => handleRawChange(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-lg font-bold"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                ={Math.floor(rawNum / 25)} bags (25kg standard)
              </span>
            </div>

            {/* Input 2: Waste Extracted */}
            <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
              <label className="block text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider mb-1">
                2. Waste Extracted (KG)
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                value={wasteKg}
                onChange={e => handleWasteChange(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 font-mono text-lg font-bold text-rose-600"
                required
              />
              <span className="text-[10px] text-rose-500 mt-1 block">
                Can be recycled into regrind
              </span>
            </div>

            {/* Input 3: Moulded Beads Generated */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border-2 border-emerald-500">
              <label className="block text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1">
                3. Moulded Beads (KG)
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                value={mouldedBeadsKg}
                onChange={e => setMouldedBeadsKg(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-emerald-300 bg-white dark:bg-slate-800 font-mono text-lg font-bold text-emerald-600"
                required
              />
              <span className="text-[10px] text-emerald-600 mt-1 block font-medium">
                Yield: {liveYield.toFixed(1)}% · Basis for salary
              </span>
            </div>
          </div>

          {/* Real-time Piece-Rate Salary Calculation Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-[#F6FAF6] dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Calculated Operator Salary for this Session
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-200 mt-0.5">
                ₹{currentSessionSalary.toFixed(2)}
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-300">
                Formula: {mouldedNum} kg moulded beads × ₹{rateNum.toFixed(2)}/kg
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500">Rate/kg (₹):</label>
              <input
                type="number"
                step="0.25"
                value={pieceRate}
                onChange={e => setPieceRate(e.target.value)}
                className="w-20 h-9 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center font-bold"
              />
            </div>
          </div>

          {/* Submit Task Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-heading font-bold text-sm shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Submit Task & Notify Admin</span>
            </button>
            <span className="text-[10px] text-slate-400 block text-center mt-1.5">
              Admin will simultaneously receive a real-time notification alert of this completion.
            </span>
          </div>
        </form>
      </div>

      {/* Immediate Post-Task Decisions Card (3 Options Specified by Owner) */}
      {submittedSession && (
        <div className="p-5 rounded-3xl bg-slate-900 text-white dark:bg-slate-900 dark:text-slate-100 border border-[#C9A86A] shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-emerald-500 text-white">
                  <Check className="w-4 h-4" />
                </span>
                <h3 className="font-heading text-base font-bold">
                  Task Submitted! Salary Credited: ₹{submittedSession.salaryEarned.toFixed(0)}
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Produced {submittedSession.mouldedKg} kg moulded beads and {submittedSession.wasteKg} kg waste. What would you like to do next?
              </p>
            </div>
            <button
              onClick={() => setSubmittedSession(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Option 1: Directly Sell Loose Beads with Invoice */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#C9A86A]">
                  <FileText className="w-4 h-4" />
                  <span>Option 1 · Direct Sale</span>
                </div>
                <h4 className="font-bold text-sm text-white mt-1">
                  Sell Loose Beads with Invoice
                </h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  Generate instant GST Tax Invoice or Kachcha Bill for {submittedSession.mouldedKg} kg without coating.
                </p>
              </div>

              <button
                onClick={() => setShowLooseSaleModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs"
              >
                Create Loose Sale Bill →
              </button>
            </div>

            {/* Option 2: Move to Threading */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Send className="w-4 h-4" />
                  <span>Option 2 · Threading</span>
                </div>
                <h4 className="font-bold text-sm text-white mt-1">
                  Move to Threading Karigars
                </h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  Dispatch the {submittedSession.mouldedKg} kg beads directly to outsourced threading karigars.
                </p>
              </div>

              <button
                onClick={() => setShowMoveToThreadingModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-[#B98B4E] text-white font-bold text-xs hover:bg-[#A3783D] transition-colors shadow-xs"
              >
                Send to Karigar →
              </button>
            </div>

            {/* Option 3: Recycle Waste */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Recycle className="w-4 h-4" />
                  <span>Option 3 · Recycling</span>
                </div>
                <h4 className="font-bold text-sm text-white mt-1">
                  Recycle {submittedSession.wasteKg} kg Waste
                </h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  Feed waste back into the regrind hopper to melt and reuse for future batches.
                </p>
              </div>

              <button
                disabled={wasteRecycledSuccess}
                onClick={handleRecycleWaste}
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-colors shadow-xs ${
                  wasteRecycledSuccess
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {wasteRecycledSuccess ? '✓ Waste Added to Regrind!' : 'Recycle Waste Now →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Direct Loose Bead Sale Invoice */}
      {showLooseSaleModal && submittedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              Direct Loose Bead Sale · {submittedSession.mouldedKg} KG
            </h3>
            <p className="text-slate-500 mt-0.5">
              Generate invoice directly from Moulding unit without coating.
            </p>

            <form onSubmit={handleDirectLooseSale} className="space-y-3 pt-3">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Select Customer Party
                </label>
                <select
                  value={salePartyId}
                  onChange={e => setSalePartyId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.address})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Bill Format
                  </label>
                  <select
                    value={saleBillType}
                    onChange={e => setSaleBillType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                  >
                    <option value="GST_Tax_Invoice">GST Tax Invoice (18%)</option>
                    <option value="Kachcha_Estimate">Kachcha Bill / Estimate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Rate / KG (₹)
                  </label>
                  <input
                    type="number"
                    value={saleRate}
                    onChange={e => setSaleRate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Dispatch Vehicle / Tempo No
                </label>
                <input
                  type="text"
                  value={saleVehicleNo}
                  onChange={e => setSaleVehicleNo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 flex justify-between items-center font-mono font-bold">
                <span>Invoice Total:</span>
                <span className="text-base text-emerald-600">
                  ₹{(submittedSession.mouldedKg * (parseFloat(saleRate) || 165)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLooseSaleModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-xs hover:bg-emerald-700"
                >
                  Issue Invoice & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Move to Threading */}
      {showMoveToThreadingModal && submittedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              Move {submittedSession.mouldedKg} KG to Threading Karigar
            </h3>
            <p className="text-slate-500 mt-0.5">
              Generate dispatch challan slip for outsourced threading work.
            </p>

            <form onSubmit={handleMoveToThreading} className="space-y-3 pt-3">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Select Karigar
                </label>
                <select
                  value={karigarId}
                  onChange={e => setKarigarId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {karigars.map(k => (
                    <option key={k.id} value={k.id}>
                      {k.name} ({k.address})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Agreed Labour Rate per Bunch (₹)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={threadingRate}
                  onChange={e => setThreadingRate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMoveToThreadingModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B98B4E] text-white font-semibold shadow-xs hover:bg-[#A3783D]"
                >
                  Issue Challan & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admin Assign New Task */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              Admin: Assign Moulding Task to Operator
            </h3>
            <p className="text-slate-500 mt-0.5">
              Task will immediately appear on the operator's dedicated machine console.
            </p>

            <form onSubmit={handleAssignTaskSubmit} className="space-y-3 pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Target Machine
                  </label>
                  <select
                    value={assignMachine}
                    onChange={e => setAssignMachine(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                  >
                    <option value="M1">Machine M1 (Pawan Kumar)</option>
                    <option value="M2">Machine M2 (Raju Vishwakarma)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Piece-Rate / KG (₹)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={assignPieceRate}
                    onChange={e => setAssignPieceRate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Raw Material to Feed
                </label>
                <select
                  value={assignRawId}
                  onChange={e => setAssignRawId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {rawMaterials
                    .filter(rm => rm.applicableUnit === 'moulding')
                    .map(rm => (
                      <option key={rm.id} value={rm.id}>
                        {rm.name} ({rm.currentStock} kg available)
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Allocated Raw (KG)
                  </label>
                  <input
                    type="number"
                    step="25"
                    value={assignAllocatedKg}
                    onChange={e => setAssignAllocatedKg(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Target Plain SKU
                  </label>
                  <select
                    value={assignSkuId}
                    onChange={e => setAssignSkuId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                  >
                    {PLAIN_BEAD_SKUS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Special Instructions
                </label>
                <input
                  type="text"
                  value={assignNotes}
                  onChange={e => setAssignNotes(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-semibold shadow-xs"
                >
                  Dispatch Task Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
