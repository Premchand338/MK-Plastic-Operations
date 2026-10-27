import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Coins,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MouldingTask } from '../../types';
import { PLAIN_BEAD_SKUS } from '../../data/seedData';

export const AssignedTasksSection: React.FC = () => {
  const {
    mouldingTasks,
    currentUser,
    startMouldingBatchFromTask,
    assignMouldingTask,
    rawMaterials,
    products,
    productionPrograms,
    createProductionProgram,
    incrementProgramPackets,
    completeProductionProgram,
    setActiveTab
  } = useApp();

  // Machine filter: 'all' | 'M1' | 'M2'
  const initialMachineFilter =
    currentUser.assignedMachine === 'M2'
      ? 'M2'
      : currentUser.assignedMachine === 'M1'
      ? 'M1'
      : 'all';

  const [machineFilter, setMachineFilter] = useState<'all' | 'M1' | 'M2'>(initialMachineFilter);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);

  // New task form state for Admin
  const [assignMachine, setAssignMachine] = useState<'M1' | 'M2'>('M1');
  const [assignRawId, setAssignRawId] = useState(
    rawMaterials.find(rm => rm.applicableUnit === 'moulding')?.id || 'rm-gpps-black'
  );
  const [assignSkuId, setAssignSkuId] = useState(PLAIN_BEAD_SKUS[0].id);
  const [assignAllocatedKg, setAssignAllocatedKg] = useState('200');
  const [assignPieceRate, setAssignPieceRate] = useState('3.0');
  const [assignNotes, setAssignNotes] = useState('Moulding batch for wholesale delivery');

  // New program form state for Admin/Owner
  const [prgMachine, setPrgMachine] = useState<'M1' | 'M2' | 'P1' | 'P2' | 'MZ1'>('M1');
  const [prgProcess, setPrgProcess] = useState<'Moulding' | 'Pearl' | 'Metalizing'>('Moulding');
  const [prgTargetSkuId, setPrgTargetSkuId] = useState(products[0]?.id || '');
  const [prgLotName, setPrgLotName] = useState('Offer Lot #109 (Virgin GPPS White)');
  const [prgAllocatedKg, setPrgAllocatedKg] = useState('200');
  const [prgTargetPackets, setPrgTargetPackets] = useState('120');
  const [prgPackagingUnit, setPrgPackagingUnit] = useState<'bunches_per_packet' | 'kg_per_packet'>('kg_per_packet');
  const [prgNotes, setPrgNotes] = useState('Program from Admin: Surat Wholesale priority');

  // Filter tasks based on machine
  const filteredTasks = mouldingTasks.filter(t => {
    if (machineFilter === 'all') return true;
    return t.machineId === machineFilter;
  });

  const activeCount = mouldingTasks.filter(t => t.status !== 'Completed').length;

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = rawMaterials.find(r => r.id === assignRawId);
    const sku = products.find(p => p.id === assignSkuId) || PLAIN_BEAD_SKUS[0];
    const opName = assignMachine === 'M1' ? 'Pawan Kumar' : 'Raju Vishwakarma';
    const opId = assignMachine === 'M1' ? 'user-staff-m1' : 'user-staff-m2';

    assignMouldingTask({
      adminId: currentUser.id,
      assignedOperatorId: opId,
      assignedOperatorName: opName,
      machineId: assignMachine,
      rawMaterialId: assignRawId,
      rawMaterialName: raw ? raw.name : 'Virgin GPPS',
      targetSkuId: assignSkuId,
      targetSkuName: sku.name,
      rawAllocatedKg: parseFloat(assignAllocatedKg) || 200,
      pieceRatePerKg: parseFloat(assignPieceRate) || 3.0,
      notes: assignNotes
    });

    setShowAssignModal(false);
  };

  const handleProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sku = products.find(p => p.id === prgTargetSkuId) || products[0];
    const op = prgMachine === 'M1' ? 'Pawan Kumar' : prgMachine === 'M2' ? 'Raju Vishwakarma' : prgMachine.startsWith('P') ? 'Santosh Maurya' : 'Imran Khan';
    const opId = prgMachine === 'M1' ? 'user-staff-m1' : prgMachine === 'M2' ? 'user-staff-m2' : prgMachine.startsWith('P') ? 'user-mgr-pearl' : 'user-mgr-metal';

    createProductionProgram({
      date: new Date().toISOString().slice(0, 10),
      machineId: prgMachine,
      operatorId: opId,
      operatorName: op,
      targetSkuId: sku.id,
      targetSkuName: sku.name,
      processType: prgProcess,
      rawLotName: prgLotName,
      rawAllocatedKg: parseFloat(prgAllocatedKg) || 100,
      targetPackets: parseInt(prgTargetPackets) || 100,
      piecesPerPacket: prgPackagingUnit === 'bunches_per_packet' ? 10 : 1,
      packagingUnit: prgPackagingUnit,
      liveCycleSeconds: prgProcess === 'Moulding' ? 42 : prgProcess === 'Pearl' ? 120 : 95,
      notes: prgNotes
    });
    setShowProgramModal(false);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#201F2B] p-4 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80 space-y-4">
      {/* Header with Title, Active Badge, Machine Tabs, and Assign CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Assigned Moulding Tasks
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 text-[11px] font-bold">
              {activeCount} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Admin task assignments for injection moulding machines M1 & M2. Start a batch to log raw kg, separate waste, and credit piece-rate salary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Machine Filter Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setMachineFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                machineFilter === 'all'
                  ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All Machines
            </button>
            <button
              onClick={() => setMachineFilter('M1')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                machineFilter === 'M1'
                  ? 'bg-white dark:bg-[#201F2B] text-blue-700 dark:text-blue-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>M1</span>
              <span className="text-[10px] font-normal opacity-70">(Pawan)</span>
            </button>
            <button
              onClick={() => setMachineFilter('M2')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                machineFilter === 'M2'
                  ? 'bg-white dark:bg-[#201F2B] text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>M2</span>
              <span className="text-[10px] font-normal opacity-70">(Raju)</span>
            </button>
          </div>

          {/* Admin Assign Task and New Program Buttons */}
          {currentUser.role === 'admin' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowProgramModal(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Program From Admin</span>
              </button>
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Shift Task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Production Programs from Admin/Owner (Active Machines & Packet Yield) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-none" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Active Programs from Admin/Owner ({productionPrograms.length})
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Real-time packet count & lot yield
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {productionPrograms.map(prg => {
            const pct = Math.min(100, Math.round((prg.packetsCompleted / prg.targetPackets) * 100));
            return (
              <div
                key={prg.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {prg.machineId}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{prg.programNo}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    prg.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {prg.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
                    {prg.targetSkuName}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
                    {prg.rawLotName}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Packets from Offer:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {prg.packetsCompleted} / {prg.targetPackets} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800 text-[10px]">
                  <span className="text-slate-400">{prg.operatorName.split(' ')[0]}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => incrementProgramPackets(prg.id, 1)}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-bold"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => incrementProgramPackets(prg.id, 5)}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-bold"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <div className="py-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            No pending moulding tasks for this filter.
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Admin can assign a task with polymer grade and piece-rate pay.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTasks.map(task => {
            const isAssigned = task.status === 'Assigned';
            const isInProgress = task.status === 'In_Progress';
            const isCompleted = task.status === 'Completed';

            // Estimated good beads (60% standard yield) & projected piece-rate payout
            const estGoodBeads = Math.round(task.rawAllocatedKg * 0.6);
            const estSalary = Math.round(estGoodBeads * task.pieceRatePerKg);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isInProgress
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80 shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-80'
                    : 'bg-white dark:bg-[#201F2B] border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-[#C9A86A]/60'
                }`}
              >
                <div>
                  {/* Top Bar: Machine + Operator & Status Badge */}
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-lg font-bold font-mono text-[11px] ${
                          task.machineId === 'M1'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {task.machineId}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {task.assignedOperatorName}
                      </span>
                    </div>

                    <div>
                      {isInProgress ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          In Progress
                        </span>
                      ) : isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <Clock className="w-3 h-3" />
                          Ready to Start
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Target Plain Bead Product */}
                  <div className="space-y-1 mb-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Target Product to Mould
                    </div>
                    <div className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {task.targetSkuName}
                    </div>
                  </div>

                  {/* Key Metrics Grid: Allocated Raw, Piece Rate, Est Earnings */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs mb-3 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        Raw Polymer
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {task.rawAllocatedKg} kg
                      </span>
                      <span className="text-[9px] text-slate-400 block truncate">
                        {task.rawMaterialName.split(' ')[0]}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        Piece-Rate
                      </span>
                      <span className="font-bold text-purple-700 dark:text-purple-300">
                        ₹{task.pieceRatePerKg.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-sans">
                        per kg good beads
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        Est. Payout
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{estSalary}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-sans">
                        (~{estGoodBeads} kg)
                      </span>
                    </div>
                  </div>

                  {/* Notes / Instructions */}
                  {task.notes && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-3">
                      "{task.notes}"
                    </div>
                  )}
                </div>

                {/* Footer Action: Start / Resume Moulding Batch */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Assigned: {task.assignedDate}
                  </span>

                  {isCompleted ? (
                    <button
                      onClick={() => setActiveTab('quick_entry')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      View Logged Session
                    </button>
                  ) : (
                    <button
                      onClick={() => startMouldingBatchFromTask(task.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                        isInProgress
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-[#2B2A4C] hover:bg-[#3D3B6B] dark:bg-[#C9A86A] dark:hover:bg-[#B89658] text-white dark:text-[#1E1D2B]'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isInProgress ? 'Resume Moulding Batch' : 'Start Moulding Batch'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Task Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                  Assign Task to Moulding Machine
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dedicated 2-machine operation (M1 & M2) in Bhiwandi unit.
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3.5">
              {/* Machine Selection */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Machine & Dedicated Operator
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignMachine('M1')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      assignMachine === 'M1'
                        ? 'border-[#2B2A4C] dark:border-[#C9A86A] bg-[#2B2A4C]/5 dark:bg-[#C9A86A]/10 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs">Machine M1</div>
                    <div className="text-[10px] text-slate-400 font-normal">Pawan Kumar</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssignMachine('M2')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      assignMachine === 'M2'
                        ? 'border-[#2B2A4C] dark:border-[#C9A86A] bg-[#2B2A4C]/5 dark:bg-[#C9A86A]/10 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs">Machine M2</div>
                    <div className="text-[10px] text-slate-400 font-normal">Raju Vishwakarma</div>
                  </button>
                </div>
              </div>

              {/* Raw Polymer Material */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Raw Material Polymer (Granules)
                </label>
                <select
                  value={assignRawId}
                  onChange={e => setAssignRawId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                >
                  {rawMaterials
                    .filter(rm => rm.applicableUnit === 'moulding')
                    .map(rm => (
                      <option key={rm.id} value={rm.id}>
                        {rm.name} (Stock: {rm.currentStock} {rm.unit})
                      </option>
                    ))}
                </select>
              </div>

              {/* Target Plain Bead Product SKU */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Plain Bead SKU
                </label>
                <select
                  value={assignSkuId}
                  onChange={e => setAssignSkuId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                >
                  {PLAIN_BEAD_SKUS.map(sku => (
                    <option key={sku.id} value={sku.id}>
                      {sku.name} ({sku.grade} - {sku.material})
                    </option>
                  ))}
                </select>
              </div>

              {/* Allocated KG and Piece-Rate Pay */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Allocated Raw (KG)
                  </label>
                  <input
                    type="number"
                    step="25"
                    value={assignAllocatedKg}
                    onChange={e => setAssignAllocatedKg(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-slate-100"
                    placeholder="e.g. 200"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Piece-Rate (₹ / kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={assignPieceRate}
                    onChange={e => setAssignPieceRate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold text-purple-700 dark:text-purple-300"
                    placeholder="e.g. 3.0"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Shift Instructions / Notes
                </label>
                <input
                  type="text"
                  value={assignNotes}
                  onChange={e => setAssignNotes(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  placeholder="e.g. Run 3mm round mould; separate waste clean"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-bold shadow-xs hover:opacity-95"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Program From Admin/Owner */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                  New Production Program from Admin/Owner
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Schedule machine target, raw polymer lot identity, and target finished packet yield.
                </p>
              </div>
              <button
                onClick={() => setShowProgramModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProgramSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Target Machine
                  </label>
                  <select
                    value={prgMachine}
                    onChange={e => {
                      const m = e.target.value as any;
                      setPrgMachine(m);
                      if (m === 'M1' || m === 'M2') setPrgProcess('Moulding');
                      else if (m.startsWith('P')) setPrgProcess('Pearl');
                      else setPrgProcess('Metalizing');
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                  >
                    <option value="M1">Moulding M1 (Pawan Kumar)</option>
                    <option value="M2">Moulding M2 (Raju Vishwakarma)</option>
                    <option value="P1">Pearl Coating P1 (Santosh)</option>
                    <option value="P2">Pearl Coating P2</option>
                    <option value="MZ1">Metalizing MZ1 (Imran Khan)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Process Category
                  </label>
                  <select
                    value={prgProcess}
                    onChange={e => setPrgProcess(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                  >
                    <option value="Moulding">Moulding</option>
                    <option value="Pearl">Pearl Coating</option>
                    <option value="Metalizing">Metalizing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Product SKU
                </label>
                <select
                  value={prgTargetSkuId}
                  onChange={e => setPrgTargetSkuId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.process || 'Plain'} · {p.grade} - {p.material})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Raw Material Lot Identity / Offer Ref
                </label>
                <input
                  type="text"
                  value={prgLotName}
                  onChange={e => setPrgLotName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                  placeholder="e.g. Offer Lot #104 (Virgin GPPS Black)"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Allocated KG
                  </label>
                  <input
                    type="number"
                    value={prgAllocatedKg}
                    onChange={e => setPrgAllocatedKg(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    placeholder="200"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                    Target Packets
                  </label>
                  <input
                    type="number"
                    value={prgTargetPackets}
                    onChange={e => setPrgTargetPackets(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 border-emerald-500 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    placeholder="120"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Packaging Unit
                  </label>
                  <select
                    value={prgPackagingUnit}
                    onChange={e => setPrgPackagingUnit(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                  >
                    <option value="kg_per_packet">KG / Packet</option>
                    <option value="bunches_per_packet">Bunches / Packet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions / Customer Notes
                </label>
                <input
                  type="text"
                  value={prgNotes}
                  onChange={e => setPrgNotes(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  placeholder="e.g. Surat Wholesale order urgent dispatch"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors"
                >
                  Publish Program to Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
