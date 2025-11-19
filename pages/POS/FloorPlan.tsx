
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Table as TableType } from '../../types';
import { Users, ShoppingBag } from 'lucide-react';

export const FloorPlan = () => {
  const { state, dispatch, t } = useApp();

  const handleTableClick = (tableId: string) => {
    dispatch({ type: 'SELECT_TABLE', payload: tableId });
  };

  const handleTakeaway = () => {
    dispatch({ type: 'SELECT_TABLE', payload: 'TAKEAWAY' });
  };

  return (
    <div className="h-full p-8 flex flex-col animate-in fade-in duration-300 overflow-y-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('floorTitle')}</h1>
            <p className="text-slate-500 dark:text-slate-400">{t('floorSubtitle')}</p>
        </div>
        <div className="flex gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-400 dark:border-slate-500"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">{t('available')}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-500"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">{t('occupied')}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full pb-10">
        {/* Takeaway "Table" */}
        <button
             onClick={handleTakeaway}
             className="aspect-square rounded-3xl bg-primary/5 dark:bg-primary/10 border-2 border-dashed border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary transition-all flex flex-col items-center justify-center gap-3 group"
        >
            <div className="p-4 bg-primary/20 rounded-full group-hover:scale-110 transition-transform">
                <ShoppingBag className="text-primary" size={32} />
            </div>
            <span className="font-bold text-primary text-lg">{t('takeaway')}</span>
        </button>

        {state.tables.map((table: TableType) => (
          <button
            key={table.id}
            onClick={() => handleTableClick(table.id)}
            disabled={table.status === 'RESERVED'}
            className={`aspect-square rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 relative shadow-sm hover:shadow-md
              ${table.status === 'AVAILABLE' 
                ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200' 
                : ''}
              ${table.status === 'OCCUPIED' 
                ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400' 
                : ''}
            `}
          >
            <div className="absolute top-4 right-4 flex items-center gap-1 text-xs opacity-60 bg-slate-100 dark:bg-black/20 px-2 py-1 rounded-full">
                <Users size={12} />
                <span>{table.seats}</span>
            </div>
            <span className="text-3xl font-bold">{table.name}</span>
            <span className="text-xs uppercase tracking-wider font-bold opacity-70">
                {table.status === 'AVAILABLE' ? t('available') : t('occupied')}
            </span>
            {table.currentOrderId && (
                 <span className="absolute bottom-4 text-[10px] bg-primary text-white px-2 py-1 rounded-full font-bold shadow-sm animate-pulse">
                    {t('orderActive')}
                 </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};