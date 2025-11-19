
import React from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { Clock, ChefHat } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const KDSPage = () => {
  const { state, dispatch, t } = useApp();

  const activeOrders = state.orders.filter(o => o.status !== OrderStatus.COMPLETED);

  const advanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus = OrderStatus.PENDING;
    if (currentStatus === OrderStatus.PENDING) nextStatus = OrderStatus.PREPARING;
    else if (currentStatus === OrderStatus.PREPARING) nextStatus = OrderStatus.READY;
    else if (currentStatus === OrderStatus.READY) nextStatus = OrderStatus.COMPLETED;

    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: nextStatus } });
  };

  return (
    <div className="h-full bg-gray-100 dark:bg-slate-900 p-6 overflow-hidden flex flex-col pb-32">
       <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
             <div className="p-3 bg-white dark:bg-slate-800 shadow rounded-xl text-primary border border-gray-200 dark:border-slate-700">
                <ChefHat size={24} />
             </div>
             <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('kdsTitle')}</h1>
        </div>
        <div className="text-slate-500 dark:text-slate-400 font-mono font-bold text-lg bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            {new Date().toLocaleTimeString()}
        </div>
       </header>

       {activeOrders.length === 0 ? (
           <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-600 flex-col gap-4">
               <ChefHat size={80} className="opacity-20" />
               <h2 className="text-2xl font-medium">{t('noOrders')}</h2>
           </div>
       ) : (
           <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
               <div className="flex gap-4 h-full">
                   {activeOrders.map(order => {
                       const elapsed = Math.floor((Date.now() - order.timestamp) / 60000);
                       return (
                           <div 
                                key={order.id} 
                                className={`
                                    min-w-[320px] w-[320px] rounded-2xl border flex flex-col shadow-lg transition-all
                                    ${order.status === OrderStatus.PENDING ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700' : ''}
                                    ${order.status === OrderStatus.PREPARING ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' : ''}
                                    ${order.status === OrderStatus.READY ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : ''}
                                `}
                           >
                               {/* Header */}
                               <div className={`p-5 border-b flex justify-between items-start ${
                                   order.status === 'PENDING' ? 'border-gray-100 dark:border-slate-700' : 
                                   order.status === 'PREPARING' ? 'border-blue-200 dark:border-blue-800' : 'border-green-200 dark:border-green-800'
                               }`}>
                                   <div>
                                        <div className="font-black text-xl text-slate-900 dark:text-white">
                                            #{order.id.slice(-4)}
                                        </div>
                                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                            {order.tableId === 'TAKEAWAY' || !order.tableId ? t('takeaway') : `${t('table')} ${state.tables.find(t => t.id === order.tableId)?.name}`}
                                        </div>
                                   </div>
                                   <div className={`flex items-center gap-1 font-mono font-bold text-sm px-3 py-1.5 rounded-full ${elapsed > 15 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                       <Clock size={14} />
                                       {elapsed}{t('mins')}
                                   </div>
                               </div>

                               {/* Items */}
                               <div className="flex-1 p-5 overflow-y-auto space-y-4">
                                   {order.items.map((item, idx) => (
                                       <div key={idx} className="flex gap-4">
                                           <span className="font-bold text-lg min-w-[28px] h-7 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-800 dark:text-white">
                                            {item.quantity}
                                           </span>
                                           <div className="flex-1">
                                               <p className="font-bold text-lg leading-tight text-slate-800 dark:text-slate-200">{item.name}</p>
                                               {item.notes && <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1 bg-yellow-50 dark:bg-yellow-900/30 p-1 rounded">⚠️ {item.notes}</p>}
                                           </div>
                                       </div>
                                   ))}
                               </div>

                               {/* Footer Actions */}
                               <div className="p-4 mt-auto bg-gray-50/50 dark:bg-black/20">
                                   <Button 
                                        fullWidth 
                                        variant={order.status === OrderStatus.READY ? 'success' : 'primary'}
                                        onClick={() => advanceStatus(order.id, order.status)}
                                        className="py-3 text-lg shadow-md"
                                    >
                                        {order.status === OrderStatus.PENDING && t('startPrep')}
                                        {order.status === OrderStatus.PREPARING && t('markReady')}
                                        {order.status === OrderStatus.READY && t('complete')}
                                    </Button>
                               </div>
                           </div>
                       );
                   })}
               </div>
           </div>
       )}
    </div>
  );
};
