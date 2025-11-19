
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FloorPlan } from './FloorPlan';
import { MenuOrder } from './MenuOrder';
import { Button } from '../../components/ui/Button';
import { Lock, Eye, EyeOff } from 'lucide-react';

export const POSMain = () => {
  const { state, dispatch, t } = useApp();
  const [cashInput, setCashInput] = useState('');
  const [cashierName, setCashierName] = useState('Ahmed Ali');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'MANAGER' | 'CASHIER'>('CASHIER');
  const [error, setError] = useState('');

  const handleLogin = () => {
      setError('');
      
      if (!cashierName.trim()) return;

      if (selectedRole === 'MANAGER') {
          // Backend Auth Simulation:
          if (!password.trim()) {
              setError(t('invalidPassword'));
              return;
          }
      }

      dispatch({ 
          type: 'START_SHIFT', 
          payload: { 
              cashier: cashierName, 
              amount: Number(cashInput) || 0,
              role: selectedRole 
          } 
      });
  };

  // 1. Login / Shift Start Screen
  if (!state.shift.isOpen) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900 p-4 overflow-y-auto">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
          <div className="flex justify-center mb-6">
             <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Lock size={32} />
             </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-white">{t('startShift')}</h2>
          <div className="space-y-6">
            {/* Role Selection */}
            <div>
               <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{t('role')}</label>
               <div className="flex bg-gray-50 dark:bg-slate-900 rounded-xl p-1 border border-gray-200 dark:border-slate-700">
                   <button 
                        onClick={() => { setSelectedRole('CASHIER'); setError(''); }}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${selectedRole === 'CASHIER' ? 'bg-white dark:bg-slate-800 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                   >
                       {t('cashier')}
                   </button>
                   <button 
                        onClick={() => { setSelectedRole('MANAGER'); setError(''); }}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${selectedRole === 'MANAGER' ? 'bg-white dark:bg-slate-800 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                   >
                       {t('manager')}
                   </button>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{t('cashier')}</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-bold" 
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                placeholder={t('cashier')}
              />
            </div>

            {selectedRole === 'MANAGER' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{t('password')}</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-bold" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="****"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rtl:right-auto rtl:left-4"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
            )}

            {selectedRole === 'CASHIER' && (
                <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{t('openCash')}</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold rtl:left-auto rtl:right-4">$</span>
                    <input 
                        type="number" 
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 pl-8 rtl:pl-4 rtl:pr-8 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-xl font-mono font-bold" 
                        placeholder="0.00"
                        value={cashInput}
                        onChange={(e) => setCashInput(e.target.value)}
                    />
                </div>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold text-center animate-pulse">
                    {error}
                </div>
            )}
            
            <div className="pt-4 mb-4">
                <Button 
                    fullWidth 
                    size="lg"
                    onClick={handleLogin}
                    className="py-4 text-lg shadow-xl shadow-primary/20 mb-6"
                    disabled={!cashierName.trim()}
                >
                    {t('openRegister')}
                </Button>
            </div>
          </div>
        </div>
        {/* Large spacer to ensure distance from bottom screen */}
        <div className="h-24 w-full shrink-0"></div>
      </div>
    );
  }

  if (state.activeTableId) {
    return <MenuOrder />;
  }

  return <FloorPlan />;
};
