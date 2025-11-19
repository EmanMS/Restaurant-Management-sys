
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Table as TableType } from '../../types';
import { Users, ShoppingBag, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const FloorPlan = () => {
  const { state, dispatch, t } = useApp();
  
  // Add Table State
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableSeats, setNewTableSeats] = useState(4);

  const isManager = state.shift.role === 'MANAGER';

  const handleTableClick = (tableId: string) => {
    dispatch({ type: 'SELECT_TABLE', payload: tableId });
  };

  const handleTakeaway = () => {
    dispatch({ type: 'SELECT_TABLE', payload: 'TAKEAWAY' });
  };

  const handleAddTable = () => {
    if (newTableName.trim()) {
      dispatch({ 
        type: 'ADD_TABLE', 
        payload: { name: newTableName, seats: newTableSeats } 
      });
      setIsAddTableModalOpen(false);
      setNewTableName('');
      setNewTableSeats(4);
    }
  };

  const handleDeleteTable = (e: React.MouseEvent, table: TableType) => {
    e.stopPropagation();
    if (table.status !== 'AVAILABLE') {
      alert(t('cantDeleteOccupied'));
      return;
    }
    if (window.confirm(t('confirmDelete'))) {
      dispatch({ type: 'DELETE_TABLE', payload: table.id });
    }
  };

  return (
    <div className="h-full p-8 flex flex-col animate-in fade-in duration-300 overflow-y-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('floorTitle')}</h1>
            <p className="text-slate-500 dark:text-slate-400">{t('floorSubtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
             {isManager && (
               <Button onClick={() => setIsAddTableModalOpen(true)} className="shadow-lg">
                 <Plus size={20} className="mr-2" /> {t('addTable')}
               </Button>
             )}
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
            className={`aspect-square rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 relative shadow-sm hover:shadow-md group
              ${table.status === 'AVAILABLE' 
                ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200' 
                : ''}
              ${table.status === 'OCCUPIED' 
                ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400' 
                : ''}
            `}
          >
            {/* Delete Button (Manager Only) */}
            {isManager && (
              <div 
                onClick={(e) => handleDeleteTable(e, table)}
                className="absolute top-3 left-3 rtl:left-auto rtl:right-3 p-2 bg-white/80 dark:bg-black/30 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 size={16} />
              </div>
            )}

            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex items-center gap-1 text-xs opacity-60 bg-slate-100 dark:bg-black/20 px-2 py-1 rounded-full">
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

      {/* Add Table Modal */}
      <Modal isOpen={isAddTableModalOpen} onClose={() => setIsAddTableModalOpen(false)} title={t('addTable')}>
          <div className="space-y-5">
              <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('tableName')}</label>
                  <input 
                      type="text" 
                      className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none font-bold"
                      value={newTableName}
                      onChange={(e) => setNewTableName(e.target.value)}
                      placeholder="e.g., T20 or VIP-1"
                      autoFocus
                  />
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('seats')}</label>
                  <div className="flex items-center gap-4 bg-gray-100 dark:bg-slate-700 p-2 rounded-lg">
                      <button 
                        onClick={() => setNewTableSeats(Math.max(1, newTableSeats - 1))}
                        className="w-10 h-10 bg-white dark:bg-slate-600 rounded-lg flex items-center justify-center text-lg font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-slate-500"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center text-xl font-black text-slate-900 dark:text-white">
                        {newTableSeats}
                      </div>
                      <button 
                        onClick={() => setNewTableSeats(newTableSeats + 1)}
                        className="w-10 h-10 bg-white dark:bg-slate-600 rounded-lg flex items-center justify-center text-lg font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-slate-500"
                      >
                        +
                      </button>
                  </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                   <Button variant="secondary" onClick={() => setIsAddTableModalOpen(false)}>{t('cancel')}</Button>
                   <Button onClick={handleAddTable} disabled={!newTableName.trim()}>{t('save')}</Button>
               </div>
          </div>
      </Modal>
    </div>
  );
};
