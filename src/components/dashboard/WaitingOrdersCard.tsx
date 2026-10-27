import React from 'react';
import { ShoppingBag, AlertTriangle, ArrowRight, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WaitingOrdersCard: React.FC = () => {
  const { orders, setActiveTab, t } = useApp();

  const waitingOrders = orders.filter(
    o => o.status === 'Waiting_for_stock' || o.status === 'Pending'
  );

  return (
    <div className="rounded-2xl bg-white dark:bg-[#201F2B] p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
              {t('waitingOrders')}
            </h3>
            <span className="text-[11px] text-slate-400">Production needed to fulfill</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
          {waitingOrders.length} Waiting
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {waitingOrders.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            No orders waiting for stock. All pending items ready for dispatch.
          </div>
        ) : (
          waitingOrders.map(order => {
            const shortageItems = order.items.filter(i => i.isShortage);
            return (
              <div
                key={order.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
                    {order.partyName}
                  </div>
                  <span className="font-mono text-slate-500 text-[11px] shrink-0">
                    {order.orderNo}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Promised: {order.promisedDate}</span>
                  <span>·</span>
                  <span className="font-mono font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {shortageItems.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-[11px]">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      Shortage: {shortageItems.map(s => `${s.skuName} (${s.stockAvailable}/${s.qty} ${s.uom})`).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={() => setActiveTab('orders')}
          className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1"
        >
          <span>View Orders & Partial Dispatch</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
