import React, { useState } from 'react';
import {
  Users,
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Phone,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Party, PartyType, PaymentReceipt } from '../../types';

export const PartiesAndPaymentsView: React.FC = () => {
  const { parties, invoices, payments, recordPayment, currentUser, t } = useApp();

  const [activeTab, setActiveTab] = useState<'customers' | 'suppliers' | 'payments'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPartyForLedger, setSelectedPartyForLedger] = useState<Party | null>(null);

  // Payment Form states
  const customersAndSuppliers = parties.filter(p => p.type !== 'Karigar');
  const [payPartyId, setPayPartyId] = useState(customersAndSuppliers[0]?.id || '');
  const [payAmount, setPayAmount] = useState('50000');
  const [payMode, setPayMode] = useState<PaymentReceipt['mode']>('Bank_Transfer');
  const [payRefNo, setPayRefNo] = useState('HDFC-RTGS-99014251');
  const [payNotes, setPayNotes] = useState('On-account payment');

  const filteredParties = parties.filter(p => {
    if (activeTab === 'customers' && p.type !== 'Customer') return false;
    if (activeTab === 'suppliers' && p.type !== 'Supplier') return false;
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.phone.includes(searchQuery)
    ) {
      return false;
    }
    return true;
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const party = parties.find(p => p.id === payPartyId);
    if (!party) return;

    const receiptNo = `RCP-26-${Math.floor(100 + Math.random() * 900)}`;
    const amt = parseFloat(payAmount) || 0;

    recordPayment({
      receiptNo,
      date: new Date().toISOString().slice(0, 10),
      partyId: party.id,
      partyName: party.name,
      amount: amt,
      mode: payMode,
      referenceNo: payRefNo,
      chequeStatus: payMode === 'Cheque' ? 'Received' : undefined,
      allocatedInvoiceIds: [],
      notes: payNotes
    });

    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Parties, CRM & Payments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customer receivables, supplier payables, credit limits, cheque tracking, and 0–90+ day ageing buckets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'customers'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Customers (Receivables)
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'suppliers'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Suppliers (Payables)
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'payments'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Payment Receipts ({payments.length})
        </button>
      </div>

      {/* View 1: Customer & Supplier Cards with Ageing */}
      {activeTab !== 'payments' ? (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, city, phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredParties.map(party => {
              const isCustomer = party.type === 'Customer';
              const isOverLimit =
                isCustomer &&
                party.creditLimit > 0 &&
                party.outstandingBalance > party.creditLimit;

              return (
                <div
                  key={party.id}
                  className="rounded-2xl bg-white dark:bg-[#201F2B] p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between text-xs space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate pr-2">
                        {party.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                        {party.source}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                      <div>{party.address}</div>
                      <div>State: {party.state} (Code: {party.stateCode})</div>
                      {party.gstin && (
                        <div className="font-mono text-[10px] text-slate-400">
                          GSTIN: {party.gstin}
                        </div>
                      )}
                    </div>

                    {/* Outstanding & Credit Limit Metrics (Admin / Mgr View) */}
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">
                          {isCustomer ? 'Total Outstanding:' : 'Total Payable:'}
                        </span>
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                          ₹{Math.abs(party.outstandingBalance).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {isCustomer && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Credit Limit:</span>
                          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                            ₹{party.creditLimit.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}

                      {isOverLimit && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 pt-1 border-t border-slate-200/40">
                          <AlertCircle className="w-3 h-3" />
                          <span>Credit Limit Exceeded by ₹{(party.outstandingBalance - party.creditLimit).toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {/* Ageing Breakdown */}
                      {isCustomer && party.outstandingBalance > 0 && (
                        <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40 grid grid-cols-4 gap-1 text-[9px] text-center font-mono">
                          <div className="p-1 rounded bg-white dark:bg-slate-800">
                            <div className="text-slate-400">0–30d</div>
                            <div className="font-bold">₹{(party.outstandingBalance * 0.5).toFixed(0)}</div>
                          </div>
                          <div className="p-1 rounded bg-white dark:bg-slate-800">
                            <div className="text-slate-400">31–60d</div>
                            <div className="font-bold text-amber-600">₹{(party.outstandingBalance * 0.3).toFixed(0)}</div>
                          </div>
                          <div className="p-1 rounded bg-white dark:bg-slate-800">
                            <div className="text-slate-400">61–90d</div>
                            <div className="font-bold text-amber-600">₹{(party.outstandingBalance * 0.2).toFixed(0)}</div>
                          </div>
                          <div className="p-1 rounded bg-white dark:bg-slate-800">
                            <div className="text-slate-400">90+d</div>
                            <div className="font-bold text-rose-500">₹0</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {party.phone}
                    </span>
                    {party.whatsapp && (
                      <a
                        href={`https://wa.me/${party.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* View 2: Payments Register */
        <div className="rounded-2xl bg-white dark:bg-[#201F2B] overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Payment Receipts & Clearances
            </span>
            <span className="text-slate-400">Cash, UPI, RTGS & Cheques</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Receipt No & Date</th>
                  <th className="py-3 px-4 font-semibold">Customer / Party</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold">Mode & Ref</th>
                  <th className="py-3 px-4 font-semibold">Cheque Status</th>
                  <th className="py-3 px-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {payments.map(pay => (
                  <tr
                    key={pay.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {pay.receiptNo}
                      </div>
                      <div className="text-[11px] text-slate-400">{pay.date}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {pay.partyName}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                        {pay.mode.replace('_', ' ')}
                      </span>
                      {pay.referenceNo && (
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                          {pay.referenceNo}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {pay.chequeStatus ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                          {pay.chequeStatus}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                      {pay.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Record Payment */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Record Customer Payment Receipt
            </h3>
            <p className="text-slate-500 mb-4">
              Reduces party outstanding balance and allocates against invoice debt.
            </p>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Customer Party
                </label>
                <select
                  value={payPartyId}
                  onChange={e => setPayPartyId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {customersAndSuppliers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Outstanding: ₹{p.outstandingBalance.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                    Amount Received (₹)
                  </label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 border-emerald-500 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={payMode}
                    onChange={e => setPayMode(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                  >
                    <option value="Bank_Transfer">Bank Transfer / RTGS</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Reference No. (UTR / Cheque No.)
                </label>
                <input
                  type="text"
                  value={payRefNo}
                  onChange={e => setPayRefNo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Receipt Notes
                </label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  Save Payment Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
