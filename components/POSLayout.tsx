import React, { useEffect, useState, PropsWithChildren } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutGrid, Coffee, LogOut, LayoutDashboard, ChefHat, Sun, Moon, Globe, UtensilsCrossed, MoreVertical, X } from 'lucide-react';

export const POSLayout = ({ children }: PropsWithChildren) => {
  const { state, dispatch, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isManager = state.shift.role === 'MANAGER';

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'F2') { /* Search logic could go here */ }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-slate-900 transition-colors duration-300 font-sans overflow-hidden">
      
      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200" onClick={() => setMobileMenuOpen(false)}>
           <div 
             className="absolute top-0 bottom-0 left-0 rtl:left-auto rtl:right-0 w-72 bg-white dark:bg-slate-950 p-6 shadow-2xl flex flex-col animate-in slide-in-from-left rtl:slide-in-from-right duration-300"
             onClick={e => e.stopPropagation()}
           >
              <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary">
                          <Coffee size={24} />
                      </div>
                      <span className="font-bold text-xl text-slate-800 dark:text-white">RestoFlow</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                      <X size={24} className="text-slate-500 dark:text-slate-400" />
                  </button>
              </div>
              
              <nav className="flex-1 flex flex-col gap-2">
                {isManager && (
                    <NavItem 
                        active={state.view === 'ADMIN'} 
                        onClick={() => { dispatch({ type: 'SET_VIEW', payload: 'ADMIN' }); setMobileMenuOpen(false); }}
                        icon={<LayoutDashboard size={24} />}
                        label={t('admin')}
                        mobile
                    />
                )}
                <NavItem 
                    active={state.view === 'POS'} 
                    onClick={() => { dispatch({ type: 'SET_VIEW', payload: 'POS' }); setMobileMenuOpen(false); }}
                    icon={<LayoutGrid size={24} />}
                    label={t('pos')}
                    mobile
                />
                {/* KDS is now available for everyone */}
                <NavItem 
                    active={state.view === 'KDS'} 
                    onClick={() => { dispatch({ type: 'SET_VIEW', payload: 'KDS' }); setMobileMenuOpen(false); }}
                    icon={<ChefHat size={24} />}
                    label={t('kds')}
                    mobile
                />
              </nav>

               <div className="mt-auto border-t border-gray-100 dark:border-slate-800 pt-4">
                    <button 
                        onClick={() => { dispatch({ type: 'END_SHIFT' }); setMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <LogOut size={24} className="rtl:rotate-180" />
                        <span className="font-bold">{isManager ? t('logout') : t('exit')}</span>
                    </button>
               </div>
           </div>
        </div>
      )}

      {/* Persistent Sidebar (Desktop Only) */}
      <aside className="hidden md:flex group relative z-30 h-full w-20 hover:w-64 bg-white dark:bg-slate-950 border-r rtl:border-r-0 rtl:border-l border-gray-200 dark:border-slate-800 flex-col items-start py-6 transition-[width] duration-300 shadow-xl shrink-0 print:hidden">
        
        {/* Logo Area */}
        <div className="w-full px-5 mb-8 flex items-center gap-4 overflow-hidden whitespace-nowrap shrink-0">
            <div className="min-w-[40px] min-h-[40px] rounded-xl bg-primary/10 flex items-center justify-center">
                <Coffee className="text-primary" size={24} />
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 font-sans">
                RestoFlow
            </span>
        </div>

        {/* Navigation Links - ORDER: Admin -> POS -> KDS */}
        <nav className="flex-1 w-full flex flex-col gap-2 px-2 overflow-y-auto overflow-x-hidden no-scrollbar">
          {isManager && (
            <NavItem 
                active={state.view === 'ADMIN'} 
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'ADMIN' })}
                icon={<LayoutDashboard size={24} />}
                label={t('admin')}
            />
          )}
          <NavItem 
            active={state.view === 'POS'} 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'POS' })}
            icon={<LayoutGrid size={24} />}
            label={t('pos')}
          />
          {/* KDS is now available for everyone */}
          <NavItem 
            active={state.view === 'KDS'} 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'KDS' })}
            icon={<ChefHat size={24} />}
            label={t('kds')}
          />
        </nav>

        {/* Logout (Kept in Sidebar) */}
        <div className="w-full px-2 mt-auto flex flex-col gap-2 shrink-0 border-t border-gray-100 dark:border-slate-800 pt-4">
            <button 
                onClick={() => dispatch({ type: 'END_SHIFT' })}
                className="w-full flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all whitespace-nowrap"
            >
                <div className="min-w-[24px] flex justify-center">
                    <LogOut size={24} className="rtl:rotate-180" />
                </div>
                <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    {isManager ? t('logout') : t('exit')}
                </span>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden relative flex flex-col min-w-0 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 print:hidden z-20">
            <div className="flex items-center gap-3 md:gap-4">
                {/* Mobile Menu Trigger (3 Dots) */}
                <button 
                    onClick={() => setMobileMenuOpen(true)}
                    className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <MoreVertical size={24} />
                </button>

                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary hidden md:block">
                        <UtensilsCrossed size={20} />
                    </div>
                    {/* LOGO NAME IS HARDCODED AS REQUESTED */}
                    <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white tracking-tight font-sans">
                        RestoFlow Pro
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                {/* Language Toggle */}
                <button 
                    onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: state.language === 'en' ? 'ar' : 'en' })}
                    className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors relative group"
                    title={t('language')}
                >
                    <Globe size={20} />
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 hidden md:block">
                        {state.language === 'en' ? 'العربية' : 'English'}
                    </span>
                </button>

                {/* Theme Toggle */}
                <button 
                    onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                    className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors relative group"
                    title={t('theme')}
                >
                    {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 hidden md:block">
                        {state.theme === 'dark' ? t('lightMode') : t('darkMode')}
                    </span>
                </button>
            </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden relative">
            {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label, mobile }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all whitespace-nowrap relative overflow-hidden group/item
      ${active 
        ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-lg dark:border dark:border-slate-700' 
        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    <div className="min-w-[24px] flex justify-center">
        {icon}
    </div>
    <span className={`font-medium transition-opacity duration-300 delay-75 ${mobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {label}
    </span>
    {active && (
        <div className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary ltr:rounded-l-full rtl:rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
    )}
  </button>
);