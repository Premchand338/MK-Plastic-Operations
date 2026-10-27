import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Clock, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineBadge: React.FC = () => {
  const { isOnline, toggleOnlineStatus, offlineOutbox, syncOutbox } = useApp();
  const [showOutboxModal, setShowOutboxModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncOutbox();
      setIsSyncing(false);
    }, 800);
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setShowOutboxModal(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            isOnline
              ? offlineOutbox.length > 0
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-700 animate-pulse'
          }`}
          title="Click to view network & sync queue"
        >
          {isOnline ? (
            <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <WifiOff className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          )}
          <span className="tabular-nums">
            {isOnline
              ? offlineOutbox.length > 0
                ? `${offlineOutbox.length} Queued`
                : 'Online'
              : `Offline (${offlineOutbox.length})`}
          </span>
        </button>
      </div>

      {showOutboxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#201F2B] p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-[#C9A86A] ${isSyncing ? 'animate-spin' : ''}`} />
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                  Offline Sync Outbox
                </h3>
              </div>
              <button
                onClick={() => setShowOutboxModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  )}
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Connection: {isOnline ? 'Online (Connected)' : 'Simulated Offline'}
                  </span>
                </div>
                <button
                  onClick={toggleOnlineStatus}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  Toggle {isOnline ? 'to Offline' : 'to Online'}
                </button>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                <p>
                  Factory internet in Bhiwandi often drops. Entries made offline are preserved in IndexedDB with idempotent UUIDs so syncing never creates duplicate entries.
                </p>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {offlineOutbox.length === 0 ? (
                  <div className="p-4 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-500 opacity-80" />
                    All shop-floor entries are synchronized. No pending queue.
                  </div>
                ) : (
                  offlineOutbox.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {item.actionType.replace('_', ' ')}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                          <span>·</span>
                          <span className="font-mono text-[10px] text-slate-400">{item.id.slice(0, 12)}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        {item.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleSync}
                disabled={offlineOutbox.length === 0 || !isOnline || isSyncing}
                className="flex-1 py-2.5 rounded-xl bg-[#2B2A4C] dark:bg-[#C9A86A] text-white dark:text-[#1E1D2B] text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Outbox Now'}
              </button>
              <button
                onClick={() => setShowOutboxModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
