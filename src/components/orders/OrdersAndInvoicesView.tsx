import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Truck,
  Printer,
  Share2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X,
  CreditCard,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  SalesOrder,
  Invoice,
  SalesOrderItem,
  InvoiceType,
  SellingUOM
} from '../../types';

export const OrdersAndInvoicesView: React.FC = () => {
  const {
    orders,
    invoices,
    parties,
    products,
    createSalesOrder,
    recordDispatch,
    dispatchOrderWithInvoice,
    createInvoice,
    currentUser,
    calculateItemStock,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'invoices'>('orders');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<SalesOrder | null>(null);
  const [showInvoiceGeneratorModal, setShowInvoiceGeneratorModal] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  // New Order Form states
  const customers = parties.filter(p => p.type === 'Customer');
  const [orderPartyId, setOrderPartyId] = useState(customers[0]?.id || '');
  const [orderPromisedDate, setOrderPromisedDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10)
  );
  const [orderNotes, setOrderNotes] = useState('');
  const [orderLines, setOrderLines] = useState<
    { skuId: string; qty: number; uom: SellingUOM; rate: number }[]
  >([
    {
      skuId: products[products.length - 1]?.id || '',
      qty: 500,
      uom: 'Bunch',
      rate: products[products.length - 1]?.defaultRatePerUOM.rate || 35
    }
  ]);
  const [creditOverrideReason, setCreditOverrideReason] = useState('');

  // Dispatch Form states
  const [dispatchVehicleNo, setDispatchVehicleNo] = useState('MH-04-GF-4102');
  const [dispatchTransporter, setDispatchTransporter] = useState('VRL Logistics Bhiwandi');
  const [dispatchQuantities, setDispatchQuantities] = useState<Record<string, number>>({});
  const [dispatchPackets, setDispatchPackets] = useState<Record<string, number>>({});

  // Invoice Generator states
  const [invType, setInvType] = useState<InvoiceType>('GST_Tax_Invoice');
  const [invPartyId, setInvPartyId] = useState(customers[0]?.id || '');
  const [invOrderId, setInvOrderId] = useState<string>('');
  const [invEwayBill, setInvEwayBill] = useState('');

  const selectedParty = customers.find(c => c.id === orderPartyId);
  const totalOrderAmount = orderLines.reduce((sum, line) => sum + line.qty * line.rate, 0);
  const isCreditLimitExceeded =
    selectedParty &&
    selectedParty.creditLimit > 0 &&
    selectedParty.outstandingBalance + totalOrderAmount > selectedParty.creditLimit;

  // Add line to order
  const handleAddOrderLine = () => {
    setOrderLines(prev => [
      ...prev,
      {
        skuId: products[0].id,
        qty: 100,
        uom: 'Bunch',
        rate: products[0].defaultRatePerUOM.rate || 30
      }
    ]);
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParty) return;

    if (isCreditLimitExceeded && !creditOverrideReason && currentUser.role !== 'admin') {
      alert('Credit limit exceeded! Admin authorization and reason required.');
      return;
    }

    const items: SalesOrderItem[] = orderLines.map(line => {
      const sku = products.find(p => p.id === line.skuId);
      const stock = calculateItemStock(line.skuId, 'warehouse');
      const isShort = stock < line.qty;

      return {
        skuId: line.skuId,
        skuName: sku ? sku.name : 'Beads',
        qty: line.qty,
        uom: line.uom,
        rate: line.rate,
        amount: line.qty * line.rate,
        stockAvailable: Math.max(0, stock),
        isShortage: isShort
      };
    });

    const hasShortage = items.some(i => i.isShortage);
    const orderNo = `ORD-26-${Math.floor(1000 + Math.random() * 9000)}`;

    createSalesOrder({
      orderNo,
      date: new Date().toISOString().slice(0, 10),
      partyId: selectedParty.id,
      partyName: selectedParty.name,
      items,
      subtotal: totalOrderAmount,
      promisedDate: orderPromisedDate,
      status: hasShortage ? 'Waiting_for_stock' : 'Ready',
      notes: orderNotes,
      creditOverrideReason: isCreditLimitExceeded ? creditOverrideReason : undefined,
      dispatches: []
    });

    setShowNewOrderModal(false);
  };

  const handleOpenDispatch = (order: SalesOrder) => {
    setSelectedOrderForDispatch(order);
    const initialQtys: Record<string, number> = {};
    const initialPackets: Record<string, number> = {};
    order.items.forEach(item => {
      initialQtys[item.skuId] = item.qty;
      initialPackets[item.skuId] = item.uom === 'Bunch' ? Math.max(1, Math.floor(item.qty / 10)) : Math.max(1, Math.floor(item.qty));
    });
    setDispatchQuantities(initialQtys);
    setDispatchPackets(initialPackets);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDispatch) return;

    const dispatchItems = selectedOrderForDispatch.items.map(item => ({
      skuId: item.skuId,
      qty: dispatchQuantities[item.skuId] || 0,
      uom: item.uom,
      packets: dispatchPackets[item.skuId] || 1
    }));

    recordDispatch(selectedOrderForDispatch.id, dispatchVehicleNo, dispatchItems);
    setSelectedOrderForDispatch(null);
  };

  const handle1ClickInvoiceDispatch = (invoiceType: 'GST_Tax_Invoice' | 'Kachcha_Bill') => {
    if (!selectedOrderForDispatch) return;

    const dispatchItems = selectedOrderForDispatch.items.map(item => ({
      skuId: item.skuId,
      qty: dispatchQuantities[item.skuId] || 0,
      uom: item.uom,
      packets: dispatchPackets[item.skuId] || 1
    }));

    dispatchOrderWithInvoice(
      selectedOrderForDispatch.id,
      dispatchVehicleNo,
      dispatchItems,
      invoiceType,
      dispatchTransporter
    );

    setSelectedOrderForDispatch(null);
    setActiveTab('invoices');
  };

  // Generate Invoice Submit
  const handleGenerateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const party = parties.find(p => p.id === invPartyId);
    if (!party) return;

    const isSameState = party.stateCode === '27'; // Maharashtra
    const isGst = invType === 'GST_Tax_Invoice';
    const invNo = isGst
      ? `MK/26-27/${Math.floor(100 + Math.random() * 900)}`
      : `EST/26-27/${Math.floor(100 + Math.random() * 900)}`;

    const items = orderLines.map(line => {
      const sku = products.find(p => p.id === line.skuId);
      const taxable = line.qty * line.rate;
      const cgstRate = isGst && isSameState ? 9 : 0;
      const sgstRate = isGst && isSameState ? 9 : 0;
      const igstRate = isGst && !isSameState ? 18 : 0;

      const cgstAmt = (taxable * cgstRate) / 100;
      const sgstAmt = (taxable * sgstRate) / 100;
      const igstAmt = (taxable * igstRate) / 100;

      return {
        skuId: line.skuId,
        skuName: sku ? sku.name : 'Beads',
        hsnCode: '39269099',
        qty: line.qty,
        uom: line.uom,
        rate: line.rate,
        taxableAmount: taxable,
        cgstRate,
        cgstAmount: cgstAmt,
        sgstRate,
        sgstAmount: sgstAmt,
        igstRate,
        igstAmount: igstAmt,
        totalAmount: taxable + cgstAmt + sgstAmt + igstAmt
      };
    });

    const taxableSubtotal = items.reduce((s, i) => s + i.taxableAmount, 0);
    const totalCgst = items.reduce((s, i) => s + i.cgstAmount, 0);
    const totalSgst = items.reduce((s, i) => s + i.sgstAmount, 0);
    const totalIgst = items.reduce((s, i) => s + i.igstAmount, 0);
    const exactTotal = taxableSubtotal + totalCgst + totalSgst + totalIgst;
    const grandTotal = Math.round(exactTotal);
    const roundOff = Number((grandTotal - exactTotal).toFixed(2));

    const whatsappShareText = `Namaste ${party.name}, your ${isGst ? 'GST Tax Invoice' : 'Bill'} ${invNo} for ₹${grandTotal.toLocaleString('en-IN')} has been generated. Regards, MK Plastics Bhiwandi.`;

    createInvoice({
      invoiceNo: invNo,
      type: invType,
      date: new Date().toISOString().slice(0, 10),
      orderId: invOrderId || undefined,
      partyId: party.id,
      partyName: party.name,
      partyGstin: party.gstin,
      partyAddress: party.address,
      partyState: party.state,
      items,
      taxableSubtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      roundOff,
      grandTotal,
      eWayBillNo: invEwayBill || undefined,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      whatsappShareText
    });

    setShowInvoiceGeneratorModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Orders, Dispatch & Invoicing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage negotiated rate party orders, automatic stock check, partial dispatches, and GST vs. Kachcha bills.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] text-xs font-semibold shadow-xs hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('newOrder')}</span>
          </button>

          <button
            onClick={() => setShowInvoiceGeneratorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Bill</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher: Orders vs Invoices */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'invoices'
              ? 'bg-white dark:bg-[#201F2B] text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Invoices & Bills ({invoices.length})
        </button>
      </div>

      {/* View 1: Orders List */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-white dark:bg-[#201F2B] overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80">
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Sales Orders Register
              </span>
              <span className="text-slate-400">Multi-Dispatch Tracking</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Order No & Date</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Items & Qty</th>
                    <th className="py-3 px-4 font-semibold text-right">Order Value</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold">Promised Date</th>
                    <th className="py-3 px-4 font-semibold text-center">Dispatch Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {orders.map(ord => (
                    <tr
                      key={ord.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {ord.orderNo}
                        </div>
                        <div className="text-[11px] text-slate-400">{ord.date}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                          {ord.partyName}
                        </div>
                        {ord.creditOverrideReason && (
                          <span className="text-[10px] text-amber-600 block">
                            Credit Override: {ord.creditOverrideReason}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="text-slate-700 dark:text-slate-300">
                                {item.qty} {item.uom} {item.skuName}
                              </span>
                              {item.isShortage && (
                                <span className="text-[10px] text-rose-500 font-bold px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/40">
                                  Shortage
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        ₹{ord.subtotal.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === 'Ready'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : ord.status === 'Waiting_for_stock'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : ord.status === 'Partially_dispatched'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : ord.status === 'Dispatched'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600 dark:text-slate-400">
                        {ord.promisedDate}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          {ord.status !== 'Dispatched' && ord.status !== 'Cancelled' ? (
                            <button
                              onClick={() => handleOpenDispatch(ord)}
                              className="px-3 py-1 rounded-lg bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] text-xs font-semibold shadow-xs hover:opacity-90 flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Dispatch</span>
                            </button>
                          ) : (
                            <span className="text-emerald-600 text-[11px] font-bold">
                              Dispatched
                            </span>
                          )}
                          {ord.dispatches?.length > 0 && (
                            <div className="text-[10px] text-slate-500 font-mono">
                              {ord.dispatches.reduce((acc, d) => acc + (d.packets || 0), 0)} pkts sent
                              {ord.dispatches.some(d => d.invoiced) && (
                                <span className="text-emerald-600 ml-1 font-bold">
                                  (Invoiced)
                                </span>
                              )}
                            </div>
                          )}
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

      {/* View 2: Invoices List */}
      {activeTab === 'invoices' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-white dark:bg-[#201F2B] overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80">
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Invoices & Estimates ({invoices.length})
              </span>
              <span className="text-slate-400">GSTIN 27AABCM1234F1Z5</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Invoice No & Date</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Customer & State</th>
                    <th className="py-3 px-4 font-semibold text-right">Taxable</th>
                    <th className="py-3 px-4 font-semibold text-right">GST Total</th>
                    <th className="py-3 px-4 font-semibold text-right">Grand Total</th>
                    <th className="py-3 px-4 font-semibold text-center">Payment Status</th>
                    <th className="py-3 px-4 font-semibold text-center">Print / Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {invoices.map(inv => {
                    const isGst = inv.type === 'GST_Tax_Invoice';
                    const gstTotal = inv.totalCgst + inv.totalSgst + inv.totalIgst;
                    return (
                      <tr
                        key={inv.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                            {inv.invoiceNo}
                          </div>
                          <div className="text-[11px] text-slate-400">{inv.date}</div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              isGst
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {isGst ? 'GST Tax Invoice' : 'Kachcha Bill'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {inv.partyName}
                          </div>
                          <div className="text-[11px] text-slate-400">{inv.partyState}</div>
                        </td>

                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          ₹{inv.taxableSubtotal.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-500">
                          ₹{gstTotal.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                          ₹{inv.grandTotal.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.paymentStatus === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : inv.paymentStatus === 'Partially_Paid'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {inv.paymentStatus.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedInvoiceForPrint(inv)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                              title="Print GST / Estimate Bill"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {inv.whatsappShareText && (
                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(inv.whatsappShareText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 transition-colors"
                                title="Share invoice summary on WhatsApp"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Sales Order */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 text-xs">
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              New Customer Order
            </h3>
            <p className="text-slate-500 mb-4">
              Enter negotiated rate and items. Stock check and credit limits are evaluated live.
            </p>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Customer
                </label>
                <select
                  value={orderPartyId}
                  onChange={e => setOrderPartyId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state}) — Limit: ₹{(c.creditLimit / 1000).toFixed(0)}k | Balance: ₹{c.outstandingBalance.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Credit Limit Alert Banner */}
              {isCreditLimitExceeded && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Credit Limit Warning!</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Order total ₹{totalOrderAmount.toLocaleString('en-IN')} exceeds party credit limit (Available: ₹{(selectedParty.creditLimit - selectedParty.outstandingBalance).toLocaleString('en-IN')}).
                  </p>
                  <div>
                    <label className="block font-semibold text-[11px] text-amber-900 dark:text-amber-300 mb-1">
                      Admin Override Reason:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cheque in transit from Surat party"
                      value={creditOverrideReason}
                      onChange={e => setCreditOverrideReason(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-amber-400 bg-white dark:bg-slate-900 text-xs"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Order Lines */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Order Items & Negotiated Rates
                  </span>
                  <button
                    type="button"
                    onClick={handleAddOrderLine}
                    className="text-xs font-semibold text-[#C9A86A] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {orderLines.map((line, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <select
                        value={line.skuId}
                        onChange={e => {
                          const sku = products.find(p => p.id === e.target.value);
                          setOrderLines(prev =>
                            prev.map((l, i) =>
                              i === idx
                                ? {
                                    ...l,
                                    skuId: e.target.value,
                                    rate: sku?.defaultRatePerUOM.rate || l.rate
                                  }
                                : l
                            )
                          );
                        }}
                        className="flex-1 h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 mr-2"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>

                      {orderLines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setOrderLines(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 rounded text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Quantity</label>
                        <input
                          type="number"
                          value={line.qty}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            setOrderLines(prev =>
                              prev.map((l, i) => (i === idx ? { ...l, qty: val } : l))
                            );
                          }}
                          className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-center"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Unit</label>
                        <select
                          value={line.uom}
                          onChange={e => {
                            setOrderLines(prev =>
                              prev.map((l, i) =>
                                i === idx ? { ...l, uom: e.target.value as any } : l
                              )
                            );
                          }}
                          className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        >
                          <option value="Bunch">Bunch</option>
                          <option value="KG">KG</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Agreed Rate (₹)</label>
                        <input
                          type="number"
                          value={line.rate}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            setOrderLines(prev =>
                              prev.map((l, i) => (i === idx ? { ...l, rate: val } : l))
                            );
                          }}
                          className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-center"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Promised Delivery Date
                  </label>
                  <input
                    type="date"
                    value={orderPromisedDate}
                    onChange={e => setOrderPromisedDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Order Value Total
                  </label>
                  <div className="h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex items-center justify-between font-mono font-bold text-sm">
                    <span>₹</span>
                    <span>{totalOrderAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Order Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Packed in standard corrugated master cartons"
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] font-semibold"
                >
                  Confirm & Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dispatch Items & 1-Click Invoicing */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                    Dispatch Order {selectedOrderForDispatch.orderNo}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                    Packets to Party
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Customer Party: <strong className="text-slate-900 dark:text-slate-100">{selectedOrderForDispatch.partyName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForDispatch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Transport Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={dispatchVehicleNo}
                    onChange={e => setDispatchVehicleNo(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Transporter / Courier
                  </label>
                  <input
                    type="text"
                    value={dispatchTransporter}
                    onChange={e => setDispatchTransporter(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                    placeholder="e.g. VRL Logistics Bhiwandi"
                  />
                </div>
              </div>

              {/* Items to dispatch with packets count */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
                  <span>Items & Packet Allocation to Party</span>
                  <span className="text-[10px] text-slate-400">Qty / Packets</span>
                </div>

                {selectedOrderForDispatch.items.map(item => {
                  const qty = dispatchQuantities[item.skuId] || 0;
                  const packets = dispatchPackets[item.skuId] || 1;
                  return (
                    <div
                      key={item.skuId}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.skuName}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          Ordered: {item.qty} {item.uom}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">
                            Dispatch Qty ({item.uom})
                          </label>
                          <input
                            type="number"
                            max={item.qty}
                            value={qty}
                            onChange={e => {
                              const val = parseFloat(e.target.value) || 0;
                              setDispatchQuantities(prev => ({ ...prev, [item.skuId]: val }));
                              const autoPkt = item.uom === 'Bunch' ? Math.max(1, Math.floor(val / 10)) : Math.max(1, Math.floor(val));
                              setDispatchPackets(prev => ({ ...prev, [item.skuId]: autoPkt }));
                            }}
                            className="w-full h-9 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">
                            Packets to Party
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={packets}
                            onChange={e => {
                              const val = parseInt(e.target.value) || 1;
                              setDispatchPackets(prev => ({ ...prev, [item.skuId]: val }));
                            }}
                            className="w-full h-9 px-2.5 rounded-xl border-2 border-emerald-500 bg-white dark:bg-slate-800 font-mono font-bold text-emerald-700 dark:text-emerald-300 text-center"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Packets Dispatched Summary */}
              {(() => {
                const totalPkts = Object.values(dispatchPackets).reduce((s, n) => s + (n || 0), 0);
                return (
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider">
                        Total Delivery to {selectedOrderForDispatch.partyName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono">
                        Vehicle: {dispatchVehicleNo}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-heading font-extrabold font-mono text-indigo-700 dark:text-indigo-300">
                        {totalPkts} Packets
                      </div>
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                        Ready for dispatch
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ⚡ 1-Click Invoicing Actions (GST or Kachcha Bill) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 text-center">
                  1-Click Dispatch & Invoice Generation:
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handle1ClickInvoiceDispatch('GST_Tax_Invoice')}
                    className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <span>⚡ 1-Click GST Tax Invoice</span>
                    <span className="text-[10px] opacity-80 font-normal">With 18% GST (Official)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handle1ClickInvoiceDispatch('Kachcha_Bill')}
                    className="py-2.5 px-3 rounded-xl bg-[#B98B4E] hover:bg-[#A3783D] text-white font-bold text-xs shadow-xs transition-colors flex flex-col items-center cursor-pointer"
                  >
                    <span>⚡ 1-Click Kachcha Bill</span>
                    <span className="text-[10px] opacity-80 font-normal">Estimate (No Tax)</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForDispatch(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer text-xs"
                  >
                    Dispatch Only (Bill Later)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generate GST or Kachcha Invoice */}
      {showInvoiceGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#201F2B] p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 text-xs">
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              Generate Bill / Tax Invoice
            </h3>
            <p className="text-slate-500 mb-4">
              Support both official GST Tax Invoices and Kachcha Bills (estimates).
            </p>

            <form onSubmit={handleGenerateInvoiceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Invoice Type
                  </label>
                  <select
                    value={invType}
                    onChange={e => setInvType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold"
                  >
                    <option value="GST_Tax_Invoice">GST Tax Invoice (with Tax)</option>
                    <option value="Kachcha_Bill">Kachcha Bill (Estimate, No Tax)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    E-Way Bill Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 241088492019"
                    value={invEwayBill}
                    onChange={e => setInvEwayBill(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Customer Party
                </label>
                <select
                  value={invPartyId}
                  onChange={e => setInvPartyId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state}) {c.gstin ? `· GSTIN: ${c.gstin}` : '· Unregistered'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Tax Calculation Rule:
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {invType === 'GST_Tax_Invoice'
                    ? 'Within Maharashtra: CGST 9% + SGST 9%. Outside Maharashtra: IGST 18%. Indian round-off rule applied.'
                    : 'Kachcha Bill: Zero tax added. Direct estimate slip for local mandi trading.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInvoiceGeneratorModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  Generate Invoice & Update Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal (Official Format) */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-300 text-slate-900 text-xs my-8">
            {/* Header */}
            <div className="border-b-2 border-slate-800 pb-4 text-center">
              <h2 className="font-heading text-2xl font-bold tracking-tight">MK PLASTICS / BEADS BAZAAR</h2>
              <p className="text-[11px] text-slate-600">
                Plot 108, Gala 4-7, Anjurphata Road, Bhiwandi, Thane, Maharashtra 421302
              </p>
              <p className="font-mono text-xs font-bold mt-1">
                GSTIN: 27AABCM1234F1Z5 · State Code: 27 (Maharashtra)
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-100 font-bold uppercase tracking-wider text-xs">
                {selectedInvoiceForPrint.type === 'GST_Tax_Invoice' ? 'TAX INVOICE' : 'ESTIMATE / KACHCHA BILL'}
              </div>
            </div>

            {/* Bill Details */}
            <div className="grid grid-cols-2 gap-4 my-4 pb-3 border-b border-slate-200">
              <div>
                <div><strong>Invoice No:</strong> <span className="font-mono">{selectedInvoiceForPrint.invoiceNo}</span></div>
                <div><strong>Invoice Date:</strong> {selectedInvoiceForPrint.date}</div>
                {selectedInvoiceForPrint.eWayBillNo && (
                  <div><strong>E-Way Bill:</strong> <span className="font-mono">{selectedInvoiceForPrint.eWayBillNo}</span></div>
                )}
              </div>
              <div>
                <div><strong>Billed To:</strong> {selectedInvoiceForPrint.partyName}</div>
                <div><strong>Address:</strong> {selectedInvoiceForPrint.partyAddress}</div>
                <div><strong>State:</strong> {selectedInvoiceForPrint.partyState}</div>
                {selectedInvoiceForPrint.partyGstin && (
                  <div><strong>GSTIN:</strong> <span className="font-mono">{selectedInvoiceForPrint.partyGstin}</span></div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left border border-slate-300 mb-4 text-[11px]">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="p-2">Description</th>
                  <th className="p-2">HSN</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">Rate</th>
                  <th className="p-2 text-right">Taxable</th>
                  {selectedInvoiceForPrint.type === 'GST_Tax_Invoice' && (
                    <th className="p-2 text-right">GST</th>
                  )}
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedInvoiceForPrint.items.map((item, idx) => {
                  const gst = item.cgstAmount + item.sgstAmount + item.igstAmount;
                  return (
                    <tr key={idx}>
                      <td className="p-2 font-semibold">{item.skuName}</td>
                      <td className="p-2 font-mono">{item.hsnCode}</td>
                      <td className="p-2 text-right font-mono">{item.qty} {item.uom}</td>
                      <td className="p-2 text-right font-mono">₹{item.rate}</td>
                      <td className="p-2 text-right font-mono">₹{item.taxableAmount.toLocaleString('en-IN')}</td>
                      {selectedInvoiceForPrint.type === 'GST_Tax_Invoice' && (
                        <td className="p-2 text-right font-mono">₹{gst.toFixed(0)}</td>
                      )}
                      <td className="p-2 text-right font-mono font-bold">₹{item.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Calculations Breakdown */}
            <div className="flex justify-end mb-6">
              <div className="w-64 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Taxable Subtotal:</span>
                  <span>₹{selectedInvoiceForPrint.taxableSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedInvoiceForPrint.totalCgst > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (9%):</span>
                    <span>₹{selectedInvoiceForPrint.totalCgst.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedInvoiceForPrint.totalSgst > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (9%):</span>
                    <span>₹{selectedInvoiceForPrint.totalSgst.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedInvoiceForPrint.totalIgst > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>IGST (18%):</span>
                    <span>₹{selectedInvoiceForPrint.totalIgst.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Round Off:</span>
                  <span>₹{selectedInvoiceForPrint.roundOff}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-300">
                  <span>Grand Total:</span>
                  <span>₹{selectedInvoiceForPrint.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-dashed border-slate-300 pt-6 flex justify-between items-end">
              <div>
                <p className="font-semibold text-[10px]">Bank Details for RTGS/NEFT/UPI:</p>
                <p className="text-[10px] text-slate-600">Bank: HDFC Bank Ltd, Bhiwandi Branch</p>
                <p className="text-[10px] text-slate-600">A/C: 50200049182301 · IFSC: HDFC0000214</p>
              </div>
              <div className="text-center">
                <div className="h-10"></div>
                <p className="font-bold">For MK PLASTICS</p>
                <p className="text-[10px] text-slate-400">Authorized Signatory</p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 flex justify-end gap-2 no-print">
              <button
                onClick={() => setSelectedInvoiceForPrint(null)}
                className="px-4 py-2 rounded-lg border border-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-[#2B2A4C] text-white font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
