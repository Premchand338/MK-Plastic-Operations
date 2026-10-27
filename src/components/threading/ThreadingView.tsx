import React, { useState } from 'react';
import {
  Users,
  Send,
  PackageCheck,
  Printer,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KarigarJobWork } from '../../types';

export const ThreadingView: React.FC = () => {
  const {
    karigarWorks,
    parties,
    products,
    sendToKarigar,
    receiveFromKarigar,
    overdueDaysThreshold,
    karigarChargesEnabled,
    setKarigarChargesEnabled,
    currentUser,
    t
  } = useApp();

  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedWorkForReceipt, setSelectedWorkForReceipt] = useState<KarigarJobWork | null>(null);
  const [selectedSlipForPrint, setSelectedSlipForPrint] = useState<KarigarJobWork | null>(null);

  // Send form states
  const karigars = parties.filter(p => p.type === 'Karigar');
  const coatedProducts = products.filter(p => p.process === 'Pearl' || p.process === 'Metalizing');
  const [sendKarigarId, setSendKarigarId] = useState(karigars[0]?.id || '');
  const [sendSourceUnit, setSendSourceUnit] = useState<'pearl' | 'metalizing'>('pearl');
  const [sendSkuId, setSendSkuId] = useState(coatedProducts[0]?.id || '');
  const [sendQtyKg, setSendQtyKg] = useState('100');
  const [sendRate, setSendRate] = useState('2.5');

  // Receive form states
  const [recvBunches, setRecvBunches] = useState('800');
  const [recvLooseKg, setRecvLooseKg] = useState('12.5');
  const [recvWasteKg, setRecvWasteKg] = useState('2.0');
  const [threadWeightKg, setThreadWeightKg] = useState('1.0');
  const [kachchaBillNo, setKachchaBillNo] = useState(`KB-26-${Math.floor(1000 + Math.random() * 9000)}`);
  const [kachchaBillAmount, setKachchaBillAmount] = useState('2000');
  const [recvRemarks, setRecvRemarks] = useState('Lot verified & stringing approved');
  const [recvPackagingMode, setRecvPackagingMode] = useState<'bunches_per_packet' | 'kg_per_packet'>('bunches_per_packet');
  const [recvPacketSize, setRecvPacketSize] = useState('10');
  const [recvRawLotRef, setRecvRawLotRef] = useState('Offer Lot #105');

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slipNo = `SLIP-26-${Math.floor(100 + Math.random() * 900)}`;
    sendToKarigar(
      sendKarigarId,
      sendSourceUnit,
      sendSkuId,
      parseFloat(sendQtyKg) || 0,
      slipNo,
      parseFloat(sendRate) || 2.5
    );
    setShowSendModal(false);
  };

  const handleReceiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkForReceipt) return;

    const bunches = parseInt(recvBunches) || 0;
    const threadWt = parseFloat(threadWeightKg) || 0;
    const beadWt = bunches * 0.082;
    const totalWt = beadWt + threadWt;
    const pSize = parseFloat(recvPacketSize) || (recvPackagingMode === 'bunches_per_packet' ? 10 : 1);
    const calculatedPackets = recvPackagingMode === 'bunches_per_packet'
      ? Math.max(1, Math.floor(bunches / pSize))
      : Math.max(1, Math.floor(totalWt / pSize));

    receiveFromKarigar(
      selectedWorkForReceipt.id,
      bunches,
      parseFloat(recvLooseKg) || 0,
      parseFloat(recvWasteKg) || 0,
      recvRemarks,
      threadWt,
      kachchaBillNo,
      parseFloat(kachchaBillAmount) || 0,
      calculatedPackets,
      recvPackagingMode,
      pSize,
      recvRawLotRef
    );
    setSelectedWorkForReceipt(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Threading Job Work (Karigar Management)
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#B98B4E]/10 text-[#B98B4E] font-medium hidden sm:inline">
              SLA: {overdueDaysThreshold} Days
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Coated beads sent out by KG, coming back as strung bunches + loose beads + scrap. Shared by Pearl and Metalizing units.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setKarigarChargesEnabled(!karigarChargesEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                karigarChargesEnabled
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              }`}
            >
              Labour Charges: {karigarChargesEnabled ? 'Active' : 'Off (Brochure Default)'}
            </button>
          )}

          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B98B4E] hover:bg-[#A3783D] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Out to Karigar</span>
          </button>
        </div>
      </div>

      {/* Karigars Balances Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {karigars.map(k => {
          const karigarBatches = karigarWorks.filter(w => w.karigarId === k.id);
          const totalSentKg = karigarBatches.reduce((acc, b) => acc + b.qtySentKg, 0);
          const totalBunches = karigarBatches.reduce((acc, b) => acc + b.bunchesReceived, 0);
          const totalLooseKg = karigarBatches.reduce((acc, b) => acc + b.looseReturnedKg, 0);
          const pendingKg = Math.max(0, totalSentKg - (totalBunches * 0.082 + totalLooseKg));

          return (
            <div
              key={k.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#201F2B] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate pr-2">
                  {k.name}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">{k.phone}</span>
              </div>
              <div className="text-[11px] text-slate-500 truncate">{k.address}</div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-1 text-center">
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className="text-[10px] text-slate-400">Total Sent</div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{totalSentKg} kg</div>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className="text-[10px] text-slate-400">Received</div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{totalBunches} bn</div>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40">
                  <div className="text-[10px] text-amber-800 dark:text-amber-300">Pending KG</div>
                  <div className="font-mono font-bold text-amber-700 dark:text-amber-300">~{pendingKg.toFixed(1)} kg</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Karigar Job Work Slips Table */}
      <div className="rounded-2xl bg-white dark:bg-[#201F2B] overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80">
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Active & Past Threading Slips ({karigarWorks.length})
          </span>
          <span className="text-slate-400">Partial Returns Permitted</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Slip No & Date</th>
                <th className="py-3 px-4 font-semibold">Karigar</th>
                <th className="py-3 px-4 font-semibold">Coated Bead Item</th>
                <th className="py-3 px-4 font-semibold text-right">Sent (KG)</th>
                <th className="py-3 px-4 font-semibold text-center">Status & Days Out</th>
                <th className="py-3 px-4 font-semibold text-right">Bunches Recv</th>
                <th className="py-3 px-4 font-semibold text-right">Loose (KG)</th>
                {karigarChargesEnabled && (
                  <th className="py-3 px-4 font-semibold text-right">Labour Amount</th>
                )}
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {karigarWorks.map(kw => {
                const isOverdue = kw.status === 'Overdue' || kw.daysOut > overdueDaysThreshold;
                return (
                  <tr
                    key={kw.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {kw.slipNo}
                      </div>
                      <div className="text-[11px] text-slate-400">{kw.dateSent}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {kw.karigarName}
                      </div>
                      <span className="capitalize text-[10px] text-slate-400">
                        From {kw.sourceUnit} unit
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {kw.coatedSkuName}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      {kw.qtySentKg} kg
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
                          <AlertCircle className="w-3 h-3" />
                          {kw.daysOut}d Out (OVERDUE)
                        </span>
                      ) : kw.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <Clock className="w-3 h-3" />
                          {kw.daysOut}d Out ({kw.status.replace('_', ' ')})
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="flex items-center justify-end gap-1.5">
                        <span>{kw.bunchesReceived} bn</span>
                        {kw.receiptHistory?.length > 0 && kw.receiptHistory[kw.receiptHistory.length - 1].packetsReceived ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                            {kw.receiptHistory[kw.receiptHistory.length - 1].packetsReceived} pkts
                          </span>
                        ) : null}
                      </div>
                      {kw.receiptHistory?.length > 0 && kw.receiptHistory[kw.receiptHistory.length - 1].threadWeightAddedKg ? (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                          +{kw.receiptHistory[kw.receiptHistory.length - 1].threadWeightAddedKg}kg thread
                        </div>
                      ) : null}
                      {kw.receiptHistory?.length > 0 && kw.receiptHistory[kw.receiptHistory.length - 1].rawLotRef ? (
                        <div className="text-[9px] text-slate-400 truncate max-w-[110px] ml-auto">
                          {kw.receiptHistory[kw.receiptHistory.length - 1].rawLotRef}
                        </div>
                      ) : null}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      <div>{kw.looseReturnedKg} kg</div>
                      {kw.receiptHistory?.length > 0 && kw.receiptHistory[kw.receiptHistory.length - 1].kachchaBillNo ? (
                        <div className="text-[10px] text-slate-400 font-normal truncate max-w-[90px] ml-auto">
                          {kw.receiptHistory[kw.receiptHistory.length - 1].kachchaBillNo}
                        </div>
                      ) : null}
                    </td>

                    {karigarChargesEnabled && (
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-700 dark:text-amber-400">
                        ₹{kw.totalLabourAmount?.toFixed(0) || 0}
                      </td>
                    )}

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedWorkForReceipt(kw)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800"
                          title="Record bunches/loose returned"
                        >
                          Receive
                        </button>
                        <button
                          onClick={() => setSelectedSlipForPrint(kw)}
                          className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="View and print dispatch slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Send To Karigar */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Dispatch Coated Beads to Karigar
            </h3>
            <p className="text-slate-500 mb-4">
              Weighed in KG before dispatch. Karigar will return strung bunches + loose beads.
            </p>

            <form onSubmit={handleSendSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Select Karigar
                </label>
                <select
                  value={sendKarigarId}
                  onChange={e => setSendKarigarId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {karigars.map(k => (
                    <option key={k.id} value={k.id}>
                      {k.name} ({k.address.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Source Unit
                  </label>
                  <select
                    value={sendSourceUnit}
                    onChange={e => setSendSourceUnit(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 capitalize font-medium"
                  >
                    <option value="pearl">Pearl Coating</option>
                    <option value="metalizing">Metalizing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Quantity (KG)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sendQtyKg}
                    onChange={e => setSendQtyKg(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Coated Bead SKU
                </label>
                <select
                  value={sendSkuId}
                  onChange={e => setSendSkuId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {coatedProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {karigarChargesEnabled && (
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Threading Labour Rate per Bunch (₹)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={sendRate}
                    onChange={e => setSendRate(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B98B4E] text-white font-semibold shadow-xs hover:bg-[#A3783D]"
                >
                  Generate Dispatch Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Receive from Karigar */}
      {selectedWorkForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Receive from {selectedWorkForReceipt.karigarName}
            </h3>
            <p className="text-slate-500 mb-4 font-mono">
              Slip: {selectedWorkForReceipt.slipNo} · Sent: {selectedWorkForReceipt.qtySentKg} kg {selectedWorkForReceipt.coatedSkuName}
            </p>

            <form onSubmit={handleReceiveSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  Finished Bunches Returned
                </label>
                <input
                  type="number"
                  value={recvBunches}
                  onChange={e => setRecvBunches(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border-2 border-emerald-500 bg-slate-50 dark:bg-slate-900 font-mono text-base font-bold text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Loose Beads Returned (KG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={recvLooseKg}
                    onChange={e => setRecvLooseKg(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-rose-600 mb-1">
                    Wastage / Scrap (KG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={recvWasteKg}
                    onChange={e => setRecvWasteKg(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Packaging Mode & Offer Yield (Pearl bunches-wise, Metalizing dual option) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>Packaging & Packet Count</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {selectedWorkForReceipt.sourceUnit === 'pearl' ? 'Pearl (Bunches-wise)' : 'Metalizing (Dual Option)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">How much packets from offer</span>
                </div>

                {selectedWorkForReceipt.sourceUnit === 'metalizing' ? (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Select Metalizing Packing Method for 1 Packet:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRecvPackagingMode('bunches_per_packet');
                          setRecvPacketSize('10');
                        }}
                        className={`py-2 px-3 rounded-xl border text-left transition-all ${
                          recvPackagingMode === 'bunches_per_packet'
                            ? 'bg-[#B98B4E]/10 border-[#B98B4E] text-[#B98B4E] font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="text-[11px] font-bold">Bunches / Packet</div>
                        <div className="text-[10px] opacity-75">e.g. 10 Bunches per Packet</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRecvPackagingMode('kg_per_packet');
                          setRecvPacketSize('1.0');
                        }}
                        className={`py-2 px-3 rounded-xl border text-left transition-all ${
                          recvPackagingMode === 'kg_per_packet'
                            ? 'bg-[#B98B4E]/10 border-[#B98B4E] text-[#B98B4E] font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="text-[11px] font-bold">KG / Packet</div>
                        <div className="text-[10px] opacity-75">e.g. 1.0 KG per Packet</div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    Pearl counting standard: Bunches-wise counting in 1 packet (10 Bunches / Packet).
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1 text-[11px]">
                      {recvPackagingMode === 'bunches_per_packet' ? 'Bunches per 1 Packet' : 'KG per 1 Packet'}
                    </label>
                    <input
                      type="number"
                      step={recvPackagingMode === 'bunches_per_packet' ? '1' : '0.1'}
                      value={recvPacketSize}
                      onChange={e => setRecvPacketSize(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1 text-[11px]">
                      Offer / Lot Identity Ref
                    </label>
                    <input
                      type="text"
                      value={recvRawLotRef}
                      onChange={e => setRecvRawLotRef(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px] text-slate-900 dark:text-slate-100"
                      placeholder="e.g. Offer Lot #105"
                    />
                  </div>
                </div>

                {/* Offer Yield Packet Computation Display */}
                {(() => {
                  const bunches = parseInt(recvBunches) || 0;
                  const thrd = parseFloat(threadWeightKg) || 0;
                  const totalKg = (bunches * 0.082) + thrd;
                  const sizeVal = parseFloat(recvPacketSize) || (recvPackagingMode === 'bunches_per_packet' ? 10 : 1);
                  const packetsYield = recvPackagingMode === 'bunches_per_packet'
                    ? Math.max(1, Math.floor(bunches / sizeVal))
                    : Math.max(1, Math.floor(totalKg / sizeVal));

                  return (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold tracking-wider">
                          Offer / Lot Finished Yield
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {recvPackagingMode === 'bunches_per_packet'
                            ? `${bunches} bunches ÷ ${sizeVal} bn/pkt`
                            : `${totalKg.toFixed(1)} kg ÷ ${sizeVal} kg/pkt`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-heading font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                          {packetsYield} Packets
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Ready for dispatch
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Thread Weight Added (Karigar Outsourcing Feature) */}
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#B98B4E] dark:text-[#D4AF37] text-xs">
                    Thread Weight Added (KG)
                  </label>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                    Moulded Beads + Threads = Finished Packets
                  </span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={threadWeightKg}
                  onChange={e => setThreadWeightKg(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-slate-100"
                  placeholder="e.g. 1.0"
                />

                {/* Live Formula Display */}
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-black/30 border border-amber-100 dark:border-amber-900/40 text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Moulded Beads (~{((parseInt(recvBunches) || 0) * 0.082).toFixed(1)} kg)</span>
                  <span className="font-bold text-amber-600">+</span>
                  <span>Threads ({parseFloat(threadWeightKg) || 0} kg)</span>
                  <span className="font-bold text-emerald-600">=</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                    {(((parseInt(recvBunches) || 0) * 0.082) + (parseFloat(threadWeightKg) || 0)).toFixed(1)} kg Total
                  </span>
                </div>
              </div>

              {/* Kachcha Bill from Karigar */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                    Karigar Kachcha Bill No.
                  </label>
                  <input
                    type="text"
                    value={kachchaBillNo}
                    onChange={e => setKachchaBillNo(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-medium text-slate-900 dark:text-slate-100"
                    placeholder="e.g. KB-8492"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                    Labour Charges (₹)
                  </label>
                  <input
                    type="number"
                    value={kachchaBillAmount}
                    onChange={e => setKachchaBillAmount(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-medium text-slate-900 dark:text-slate-100"
                    placeholder="e.g. 2000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Receipt Remarks
                </label>
                <input
                  type="text"
                  value={recvRemarks}
                  onChange={e => setRecvRemarks(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedWorkForReceipt(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-xs hover:bg-emerald-700"
                >
                  Confirm Goods Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Dispatch Slip Modal */}
      {selectedSlipForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-300 text-slate-900 text-xs">
            <div className="border-b-2 border-slate-800 pb-3 mb-4 text-center">
              <h2 className="font-heading text-xl font-bold tracking-tight">MK PLASTICS / BEADS BAZAAR</h2>
              <p className="text-[11px] text-slate-600">Plot 108, Gala 4-7, Anjurphata Road, Bhiwandi, Maharashtra 421302</p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-100 font-bold uppercase tracking-wider text-xs">
                JOB WORK THREADING DISPATCH SLIP
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-[11px]">
              <div>
                <div><strong>Slip No:</strong> {selectedSlipForPrint.slipNo}</div>
                <div><strong>Date:</strong> {selectedSlipForPrint.dateSent}</div>
                <div><strong>Source:</strong> {selectedSlipForPrint.sourceUnit.toUpperCase()} Unit</div>
              </div>
              <div>
                <div><strong>Karigar:</strong> {selectedSlipForPrint.karigarName}</div>
                <div><strong>Days Out:</strong> {selectedSlipForPrint.daysOut} days</div>
                <div><strong>Status:</strong> {selectedSlipForPrint.status}</div>
              </div>
            </div>

            <table className="w-full text-left border border-slate-300 mb-4">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="p-2">Item Description</th>
                  <th className="p-2 text-right">Sent (KG)</th>
                  <th className="p-2 text-right">Bunches Recv</th>
                  <th className="p-2 text-right">Loose (KG)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 font-semibold">{selectedSlipForPrint.coatedSkuName}</td>
                  <td className="p-2 text-right font-mono font-bold">{selectedSlipForPrint.qtySentKg} kg</td>
                  <td className="p-2 text-right font-mono">{selectedSlipForPrint.bunchesReceived} bn</td>
                  <td className="p-2 text-right font-mono">{selectedSlipForPrint.looseReturnedKg} kg</td>
                </tr>
              </tbody>
            </table>

            <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 mb-6">
              * Note: Please return bunches tightly strung on standard nylon thread with loose beads bagged separately. Discrepancies must be reported within 24 hours.
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-dashed border-slate-400 font-medium">
              <div className="text-center">
                <div className="h-8"></div>
                <div>Authorized Signatory</div>
                <div className="text-[10px] text-slate-400">MK Plastics Bhiwandi</div>
              </div>
              <div className="text-center">
                <div className="h-8"></div>
                <div>Karigar Signature</div>
                <div className="text-[10px] text-slate-400">Receiver's Seal</div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 flex justify-end gap-2 no-print">
              <button
                onClick={() => setSelectedSlipForPrint(null)}
                className="px-4 py-2 rounded-lg border border-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-[#2B2A4C] text-white font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
