
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../constants';
import { Product, OrderItem, Modifier } from '../../types';
import { Search, Plus, Minus, Trash2, CreditCard, ShoppingBag, Printer, Check, Utensils, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const MenuOrder = () => {
  const { state, dispatch, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  
  // Split Bill State
  const [splitCount, setSplitCount] = useState(1);
  const [isSplitActive, setIsSplitActive] = useState(false);
  
  // Modifier State
  const [modifierModalOpen, setModifierModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentModifiers, setCurrentModifiers] = useState<Modifier[]>([]);

  const getProductName = (p: Product) => state.language === 'ar' ? p.nameAr : p.name;

  const filteredProducts = useMemo(() => {
    return state.products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const name = getProductName(p);
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [state.products, selectedCategory, searchQuery, state.language]);

  const handleBack = () => {
      dispatch({ type: 'SELECT_TABLE', payload: null });
  };

  const handleProductClick = (product: Product) => {
    if (product.stock <= 0) return;

    if (product.availableModifiers && product.availableModifiers.length > 0) {
        // Open Modifier Modal
        setSelectedProduct(product);
        setCurrentModifiers([]);
        setModifierModalOpen(true);
    } else {
        // Add directly
        addToCart(product, []);
    }
  };

  const toggleModifier = (mod: Modifier) => {
      setCurrentModifiers(prev => {
          const exists = prev.find(m => m.id === mod.id);
          if (exists) return prev.filter(m => m.id !== mod.id);
          return [...prev, mod];
      });
  };

  const confirmModifiers = () => {
      if (selectedProduct) {
          addToCart(selectedProduct, currentModifiers);
          setModifierModalOpen(false);
          setSelectedProduct(null);
      }
  };

  const addToCart = (product: Product, modifiers: Modifier[]) => {
    const modifierTotal = modifiers.reduce((sum, m) => sum + m.price, 0);
    const finalPrice = product.price + modifierTotal;

    const newItem: OrderItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: getProductName(product), // Store the localized name
      price: finalPrice,
      quantity: 1,
      modifiers: modifiers
    };
    dispatch({ type: 'ADD_TO_CART', payload: newItem });
  };

  const cartTotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = cartTotal * 0.1;
  const grandTotal = cartTotal + tax;
  const splitAmount = isSplitActive ? grandTotal / splitCount : grandTotal;

  const handlePayment = (method: string) => {
    dispatch({ 
        type: 'SUBMIT_ORDER', 
        payload: { paymentMethod: method, customerName: 'Walk-in' } 
    });
    setIsPayModalOpen(false);
    setIsSplitActive(false);
    setSplitCount(1);
    setTimeout(() => {
        window.print();
    }, 500);
  };

  const handlePrintBill = () => {
      window.print();
  };

  return (
    <div className="flex h-full bg-gray-50 dark:bg-slate-900 pb-32 md:pb-0">
      {/* LEFT: Menu Section */}
      <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-slate-800 min-w-0">
        {/* Top Bar with BACK BUTTON */}
        <div className="h-20 border-b border-gray-200 dark:border-slate-800 flex items-center px-4 gap-3 bg-white dark:bg-slate-900/95 backdrop-blur sticky top-0 z-10 shrink-0">
            <button 
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all shadow-sm group"
            >
                <ArrowLeft className={`transition-transform duration-300 ${state.language === 'ar' ? 'rotate-180' : ''}`} size={20} />
            </button>
            
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:right-3 rtl:left-auto" size={18} />
                <input 
                    type="text" 
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-slate-800 border-none rounded-full py-3 pl-10 pr-4 rtl:pr-10 rtl:pl-4 text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                />
            </div>
        </div>

        {/* Categories */}
        <div className="h-16 border-b border-gray-200 dark:border-slate-800 flex items-center px-6 gap-3 overflow-x-auto no-scrollbar bg-white dark:bg-slate-900 shrink-0">
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                >
                    {/* @ts-ignore */}
                    {t(`cat_${cat}`)}
                </button>
            ))}
        </div>

        {/* Product Grid - ADD PADDING BOTTOM FOR MOBILE/SCROLL */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-slate-900/50 pb-32">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map(product => (
                    <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        disabled={product.stock === 0}
                        className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all text-left disabled:opacity-60 relative"
                    >
                        <div className="aspect-[4/3] overflow-hidden relative">
                            <img src={product.image} alt={getProductName(product)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {product.stock === 0 && (
                                <div className="absolute inset-0 bg-white/80 dark:bg-black/60 flex items-center justify-center">
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{t('outStock')}</span>
                                </div>
                            )}
                            {/* Modifier Indicator */}
                            {product.availableModifiers && product.availableModifiers.length > 0 && (
                                <div className="absolute top-2 right-2 left-auto rtl:left-2 rtl:right-auto bg-white/90 dark:bg-black/60 backdrop-blur p-1.5 rounded-full text-primary">
                                    <Utensils size={12} />
                                </div>
                            )}
                            <div className="absolute bottom-2 right-2 left-auto rtl:left-2 rtl:right-auto bg-black/70 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-mono">
                                {product.sku}
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1 truncate text-base">
                                {getProductName(product)}
                            </h3>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-primary font-extrabold text-lg">${product.price.toFixed(2)}</span>
                                <span className={`text-xs font-medium ${product.stock < 10 ? 'text-red-500' : 'text-slate-500'}`}>
                                    {product.stock} {t('inStock')}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* RIGHT: Cart Sidebar */}
      <div className="w-96 bg-white dark:bg-slate-950 border-l border-gray-200 dark:border-slate-800 flex flex-col shadow-2xl z-20 h-full">
        <div className="h-20 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 bg-gray-50 dark:bg-slate-950 shrink-0">
            <div>
                <h2 className="font-bold text-xl text-slate-900 dark:text-white">{t('currentOrder')}</h2>
                <div className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {state.activeTableId === 'TAKEAWAY' ? t('takeaway') : `${t('table')} ${state.tables.find(t => t.id === state.activeTableId)?.name}`}
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <button onClick={handlePrintBill} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary transition-colors">
                    <Printer size={20} />
                 </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-950/50">
            {state.cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center">
                        <ShoppingBag size={32} />
                    </div>
                    <p className="font-medium">{t('emptyCart')}</p>
                </div>
            ) : (
                state.cart.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-gray-100 dark:border-slate-800 shadow-sm animate-in slide-in-from-right-10 duration-200 group">
                        <div className="flex justify-between items-start mb-2">
                             <div>
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.name}</h4>
                                {item.modifiers && item.modifiers.length > 0 && (
                                    <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                                        {item.modifiers.map(m => (
                                            <div key={m.id} className="flex items-center gap-1">
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span>{m.name} (+${m.price})</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>
                             <span className="font-bold text-primary text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50 dark:border-slate-800">
                            <div className="flex items-center gap-3 bg-gray-100 dark:bg-slate-800 rounded-lg px-2 h-8">
                                <button 
                                    onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { id: item.id, delta: -1 } })}
                                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="text-sm font-bold w-4 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                                <button 
                                    onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { id: item.id, delta: 1 } })}
                                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <button 
                                onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                                className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Totals Area */}
        <div className="bg-white dark:bg-slate-900 p-6 border-t border-gray-200 dark:border-slate-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-30 shrink-0">
            <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>{t('subtotal')}</span>
                    <span className="font-mono">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>{t('tax')} (10%)</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-slate-900 dark:text-white pt-4 border-t border-gray-100 dark:border-slate-800">
                    <span>{t('total')}</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                 <Button 
                    variant="outline" 
                    onClick={() => dispatch({ type: 'CLEAR_CART' })}
                    disabled={state.cart.length === 0}
                    className="col-span-1 border-gray-300 dark:border-slate-600 text-slate-500"
                 >
                    {t('clear')}
                 </Button>
                 <Button 
                    variant="primary" 
                    disabled={state.cart.length === 0}
                    onClick={() => setIsPayModalOpen(true)}
                    className="col-span-2 shadow-lg shadow-primary/25"
                 >
                    {t('checkout')}
                 </Button>
            </div>
        </div>
      </div>

      {/* MODIFIER MODAL */}
      <Modal isOpen={modifierModalOpen} onClose={() => setModifierModalOpen(false)} title={selectedProduct ? getProductName(selectedProduct) : 'Customize'}>
          <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-700">
                 <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('items')}</h4>
                 <div className="grid grid-cols-1 gap-3">
                    {selectedProduct?.availableModifiers?.map(mod => {
                        const isSelected = currentModifiers.some(m => m.id === mod.id);
                        return (
                            <button
                                key={mod.id}
                                onClick={() => toggleModifier(mod)}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                    isSelected 
                                    ? 'bg-primary/10 border-primary text-primary' 
                                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        isSelected ? 'bg-primary border-primary text-white' : 'border-slate-400'
                                    }`}>
                                        {isSelected && <Check size={14} />}
                                    </div>
                                    <span className="font-medium">{mod.name}</span>
                                </div>
                                <span className="font-mono font-bold">+{mod.price > 0 ? `$${mod.price.toFixed(2)}` : 'Free'}</span>
                            </button>
                        );
                    })}
                 </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                   <div className="flex flex-col">
                       <span className="text-sm text-slate-500">{t('total')}</span>
                       <span className="text-2xl font-black text-slate-900 dark:text-white">
                           ${((selectedProduct?.price || 0) + currentModifiers.reduce((a,b) => a + b.price, 0)).toFixed(2)}
                       </span>
                   </div>
                   <Button onClick={confirmModifiers} size="lg" className="px-8">
                       {t('order')}
                   </Button>
              </div>
          </div>
      </Modal>

      {/* Payment Modal with Split Bill */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title={t('payMethod')}>
        <div className="space-y-6">
            {/* ... Payment Modal Content ... */}
            <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-900/50 p-1 rounded-xl mb-6">
                <button 
                    onClick={() => { setIsSplitActive(false); setSplitCount(1); }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isSplitActive ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500'}`}
                >
                    {t('payFull')}
                </button>
                <button 
                     onClick={() => setIsSplitActive(true)}
                     className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isSplitActive ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500'}`}
                >
                    {t('splitBill')}
                </button>
            </div>

            {isSplitActive && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex flex-col items-center mb-6">
                    <span className="text-sm text-slate-500 dark:text-slate-400 mb-2">{t('splitCount')}</span>
                    <div className="flex items-center gap-4 mb-4">
                         <button onClick={() => setSplitCount(Math.max(2, splitCount - 1))} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow flex items-center justify-center text-slate-700 dark:text-white hover:bg-gray-50">
                             <Minus size={18} />
                         </button>
                         <span className="text-2xl font-black text-slate-900 dark:text-white w-8 text-center">{splitCount}</span>
                         <button onClick={() => setSplitCount(splitCount + 1)} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow flex items-center justify-center text-slate-700 dark:text-white hover:bg-gray-50">
                             <Plus size={18} />
                         </button>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('amountPerPerson')}</div>
                        <div className="text-3xl font-black text-blue-600 dark:text-blue-400">${splitAmount.toFixed(2)}</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handlePayment('CASH')} className="h-24 bg-gray-50 dark:bg-slate-700/50 hover:bg-green-500 dark:hover:bg-green-600 hover:text-white transition-colors rounded-2xl flex flex-col items-center justify-center gap-2 group border border-gray-200 dark:border-slate-700 hover:border-transparent">
                    <span className="text-2xl group-hover:scale-110 transition-transform">💵</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-white">{t('cash')}</span>
                </button>
                <button onClick={() => handlePayment('CARD')} className="h-24 bg-gray-50 dark:bg-slate-700/50 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white transition-colors rounded-2xl flex flex-col items-center justify-center gap-2 group border border-gray-200 dark:border-slate-700 hover:border-transparent">
                    <CreditCard size={24} className="text-slate-700 dark:text-slate-300 group-hover:text-white group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-white">{t('card')}</span>
                </button>
            </div>
            
            {!isSplitActive && (
                 <div className="pt-4 border-t border-gray-200 dark:border-slate-700 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">{t('payTotal')}</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">${grandTotal.toFixed(2)}</p>
                </div>
            )}
        </div>
      </Modal>

      {/* HIDDEN PRINT RECEIPT TEMPLATE */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8">
            {/* ... Print Template ... */}
            <div className="w-[300px] mx-auto text-black font-mono text-sm">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">RestoFlow Pro</h1>
                    <p>123 Tasty Street, Food City</p>
                    <p>Tel: +1 234 567 890</p>
                </div>
                
                <div className="border-b border-black border-dashed my-4"></div>
                
                <div className="flex justify-between mb-2">
                    <span>Order #: {Date.now().toString().slice(-4)}</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="mb-4">
                    Table: {state.activeTableId === 'TAKEAWAY' ? 'Takeaway' : state.tables.find(t => t.id === state.activeTableId)?.name}
                </div>

                <div className="border-b border-black border-dashed my-4"></div>

                <div className="space-y-2">
                    {state.cart.map((item, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between font-bold">
                                <span>{item.quantity}x {item.name}</span>
                                <span>{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            {item.modifiers?.map(m => (
                                <div key={m.id} className="text-xs pl-4 text-gray-600">
                                    + {m.name} ({m.price})
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="border-b border-black border-dashed my-4"></div>

                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-2">
                    <span>TOTAL</span>
                    <span>${grandTotal.toFixed(2)}</span>
                </div>

                <div className="border-b border-black border-dashed my-4"></div>
                
                <div className="text-center mt-8">
                    <p>Thank you for dining with us!</p>
                    <p>Please come again.</p>
                </div>
            </div>
      </div>
    </div>
  );
};
