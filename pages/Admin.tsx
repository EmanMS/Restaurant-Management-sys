
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, Sparkles, Users, Plus, Upload, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { analyzeBusinessPerformance } from '../services/geminiService';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { CATEGORIES } from '../constants';
import { Product, Staff } from '../types';

export const AdminPage = () => {
  const { state, dispatch, t } = useApp();
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'INVENTORY' | 'STAFF'>('DASHBOARD');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Add/Edit Product State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
      category: 'Burgers',
      stock: 10,
      price: 0,
      image: ''
  });
  
  // Add/Edit Staff State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
      role: 'CASHIER',
      status: 'ACTIVE'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const salesData = state.orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((acc: any[], order) => {
      const hour = new Date(order.timestamp).getHours() + ":00";
      const existing = acc.find(a => a.name === hour);
      if (existing) {
        existing.sales += order.total;
      } else {
        acc.push({ name: hour, sales: order.total });
      }
      return acc;
    }, []).sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const totalRevenue = state.orders.reduce((acc, o) => acc + o.total, 0);

  const handleGetInsights = async () => {
    setLoadingAi(true);
    const result = await analyzeBusinessPerformance(state.orders);
    setAiInsight(result);
    setLoadingAi(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  // --- Product Handlers ---
  const openAddProductModal = () => {
      setNewProduct({ category: 'Burgers', stock: 10, price: 0, image: '' });
      setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
      setNewProduct(product);
      setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
      if (window.confirm(t('confirmDelete'))) {
          dispatch({ type: 'DELETE_PRODUCT', payload: id });
      }
  };

  const handleSaveProduct = () => {
      if (newProduct.name && newProduct.price) {
          if (newProduct.id) {
              // Update Existing
               dispatch({ type: 'UPDATE_PRODUCT', payload: newProduct as Product });
          } else {
              // Add New
              const product: Product = {
                  id: Date.now().toString(),
                  name: newProduct.name || '',
                  nameAr: newProduct.nameAr || newProduct.name || '',
                  price: Number(newProduct.price),
                  stock: Number(newProduct.stock),
                  category: newProduct.category || 'Burgers',
                  sku: newProduct.sku || `SKU-${Date.now().toString().slice(-4)}`,
                  image: newProduct.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80`,
              };
              dispatch({ type: 'ADD_PRODUCT', payload: product });
          }
          
          setIsProductModalOpen(false);
          setNewProduct({ category: 'Burgers', stock: 10, price: 0, image: '' });
      }
  };

  // --- Staff Handlers ---
  const openAddStaffModal = () => {
      setNewStaff({ role: 'CASHIER', status: 'ACTIVE' });
      setIsStaffModalOpen(true);
  };

  const openEditStaffModal = (staff: Staff) => {
      setNewStaff(staff);
      setIsStaffModalOpen(true);
  };

  const handleDeleteStaff = (id: string) => {
      if (window.confirm(t('confirmDelete'))) {
          dispatch({ type: 'DELETE_STAFF', payload: id });
      }
  };

  const handleSaveStaff = () => {
      if (newStaff.name && newStaff.role) {
          if (newStaff.id) {
              dispatch({ type: 'UPDATE_STAFF', payload: newStaff as Staff });
          } else {
              const staff: Staff = {
                  id: Date.now().toString(),
                  name: newStaff.name || '',
                  role: newStaff.role || 'CASHIER',
                  phone: newStaff.phone || '',
                  status: newStaff.status || 'ACTIVE'
              };
              dispatch({ type: 'ADD_STAFF', payload: staff });
          }
          setIsStaffModalOpen(false);
          setNewStaff({ role: 'CASHIER', status: 'ACTIVE' });
      }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-y-auto p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('adminTitle')}</h1>
            <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                <button 
                    onClick={() => setActiveTab('DASHBOARD')}
                    className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'DASHBOARD' ? 'bg-primary text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                    {t('overview')}
                </button>
                <button 
                    onClick={() => setActiveTab('INVENTORY')}
                    className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'INVENTORY' ? 'bg-primary text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                    {t('inventory')}
                </button>
                <button 
                    onClick={() => setActiveTab('STAFF')}
                    className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'STAFF' ? 'bg-primary text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                    {t('staff')}
                </button>
            </div>
        </div>

        {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><DollarSign size={24} /></div>
                            <span className="text-slate-500 dark:text-slate-400 font-bold">{t('totalRev')}</span>
                        </div>
                        <p className="text-4xl font-black text-slate-900 dark:text-white mt-2">${totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm">
                         <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Package size={24} /></div>
                            <span className="text-slate-500 dark:text-slate-400 font-bold">{t('totalOrders')}</span>
                        </div>
                        <p className="text-4xl font-black text-slate-900 dark:text-white mt-2">{state.orders.length}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                         <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full group-hover:bg-purple-500/30 transition-colors"></div>
                         <div className="flex items-center gap-4 mb-4 relative z-10">
                            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500"><Sparkles size={24} /></div>
                            <span className="text-slate-500 dark:text-slate-400 font-bold">{t('aiInsights')}</span>
                        </div>
                        <Button onClick={handleGetInsights} disabled={loadingAi} size="sm" className="w-full bg-purple-600 hover:bg-purple-700 mt-1 relative z-10 text-white">
                            {loadingAi ? t('analyzing') : t('genReport')}
                        </Button>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm h-96">
                    <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Sales Activity</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={state.theme === 'dark' ? "#334155" : "#e2e8f0"} vertical={false} />
                            <XAxis dataKey="name" stroke={state.theme === 'dark' ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={state.theme === 'dark' ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: state.theme === 'dark' ? '#1e293b' : '#fff', 
                                    borderColor: state.theme === 'dark' ? '#334155' : '#e2e8f0',
                                    color: state.theme === 'dark' ? '#fff' : '#0f172a',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }} 
                                itemStyle={{ color: state.theme === 'dark' ? '#fff' : '#0f172a', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="sales" fill="#f97316" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {activeTab === 'INVENTORY' && (
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Button onClick={openAddProductModal}>
                        <Plus size={20} className="mr-2" /> {t('addProduct')}
                    </Button>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                            <tr>
                                <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('product')}</th>
                                <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('sku')}</th>
                                <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('price')}</th>
                                <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('stock')}</th>
                                <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('status')}</th>
                                <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {state.products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="p-5 flex items-center gap-4">
                                        <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-100 dark:bg-slate-700" />
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {state.language === 'ar' ? p.nameAr : p.name}
                                        </span>
                                    </td>
                                    <td className="p-5 font-mono text-sm text-slate-500">{p.sku}</td>
                                    <td className="p-5 font-bold text-slate-900 dark:text-white">${p.price.toFixed(2)}</td>
                                    <td className="p-5 font-bold text-slate-900 dark:text-white">{p.stock}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            p.stock === 0 ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500' :
                                            p.stock < 20 ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500' :
                                            'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500'
                                        }`}>
                                            {p.stock === 0 ? t('outStock') : p.stock < 20 ? t('lowStock') : t('inStock')}
                                        </span>
                                    </td>
                                    <td className="p-5 flex items-center gap-2">
                                        <button 
                                            onClick={() => openEditProductModal(p)}
                                            className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-primary hover:text-white transition-colors text-slate-500 dark:text-slate-400"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteProduct(p.id)}
                                            className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-red-500 dark:text-red-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
        
        {activeTab === 'STAFF' && (
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Button onClick={openAddStaffModal}>
                        <Plus size={20} className="mr-2" /> {t('addStaff')}
                    </Button>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                         <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                             <tr>
                                 <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('name')}</th>
                                 <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('role')}</th>
                                 <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('phone')}</th>
                                 <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('status')}</th>
                                 <th className="p-5 font-bold text-slate-500 dark:text-slate-400">{t('actions')}</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                             {state.staff.map(s => (
                                 <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                                     <td className="p-5 flex items-center gap-3">
                                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                             s.role === 'MANAGER' ? 'bg-purple-100 text-purple-600' :
                                             s.role === 'CHEF' ? 'bg-orange-100 text-orange-600' :
                                             'bg-blue-100 text-blue-600'
                                         }`}>
                                             {s.name.slice(0, 2).toUpperCase()}
                                         </div>
                                         <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                                     </td>
                                     <td className="p-5 text-slate-600 dark:text-slate-300">{t(s.role.toLowerCase() as any) || s.role}</td>
                                     <td className="p-5 font-mono text-slate-500">{s.phone}</td>
                                     <td className="p-5">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'ACTIVE' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                                            {t(s.status.toLowerCase() as any) || s.status}
                                        </span>
                                     </td>
                                     <td className="p-5 flex items-center gap-2">
                                         <button 
                                             onClick={() => openEditStaffModal(s)}
                                             className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-primary hover:text-white transition-colors text-slate-500 dark:text-slate-400"
                                         >
                                             <Pencil size={16} />
                                         </button>
                                         <button 
                                             onClick={() => handleDeleteStaff(s.id)}
                                             className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-red-500 dark:text-red-400"
                                         >
                                             <Trash2 size={16} />
                                         </button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                </div>
            </div>
        )}
      </div>

      {/* AI Modal */}
      <Modal isOpen={!!aiInsight} onClose={() => setAiInsight(null)} title={t('aiInsights')}>
          <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-200 font-medium">{aiInsight}</div>
          </div>
      </Modal>

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={newProduct.id ? t('editProduct') : t('addProduct')}>
          <div className="space-y-5">
               {/* Image Upload Section */}
               <div className="flex items-start gap-4">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-slate-700 border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all relative overflow-hidden shrink-0 group"
                    >
                        {newProduct.image ? (
                            <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-slate-400 group-hover:text-primary">
                                <Upload size={24} />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-3">
                         <div>
                            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('imageUrl')}</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:right-3 rtl:left-auto" />
                                    <input 
                                            type="text" 
                                            className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg py-2 pl-9 pr-3 rtl:pl-3 rtl:pr-9 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="https://..."
                                            value={newProduct.image || ''}
                                            onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                                    />
                                </div>
                                <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                                    {t('uploadImage')}
                                </Button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                         </div>
                         <div className="text-xs text-slate-400">
                            {t('sku')}: <input 
                                type="text" 
                                className="bg-transparent border-b border-gray-300 dark:border-slate-600 focus:border-primary outline-none w-32 font-mono"
                                placeholder="Auto-generate"
                                value={newProduct.sku || ''}
                                onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                            />
                         </div>
                    </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('productNameEn')}</label>
                        <input 
                                type="text" 
                                className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                value={newProduct.name || ''}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('productNameAr')}</label>
                        <input 
                                type="text" 
                                className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none text-right"
                                value={newProduct.nameAr || ''}
                                onChange={(e) => setNewProduct({...newProduct, nameAr: e.target.value})}
                        />
                    </div>
               </div>

               <div className="grid grid-cols-3 gap-4">
                   <div className="col-span-1">
                       <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('price')}</label>
                       <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:right-3 rtl:left-auto">$</span>
                            <input 
                                    type="number" 
                                    className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-2 pl-7 rtl:pr-7 rtl:pl-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                            />
                       </div>
                   </div>
                   <div className="col-span-1">
                       <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('stock')}</label>
                       <input 
                            type="number" 
                            className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                       />
                   </div>
                   <div className="col-span-1">
                       <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('category')}</label>
                       <select 
                            className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                       >
                           {CATEGORIES.filter(c => c !== 'All').map(c => (
                               <option key={c} value={c}>{c}</option>
                           ))}
                       </select>
                   </div>
               </div>

               <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                   <Button variant="secondary" onClick={() => setIsProductModalOpen(false)}>{t('cancel')}</Button>
                   <Button onClick={handleSaveProduct}>{newProduct.id ? t('update') : t('save')}</Button>
               </div>
          </div>
      </Modal>

      {/* Add/Edit Staff Modal */}
      <Modal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} title={newStaff.id ? t('editStaff') : t('addStaff')}>
          <div className="space-y-5">
              <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('name')}</label>
                  <input 
                      type="text" 
                      className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                      value={newStaff.name || ''}
                      onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('role')}</label>
                      <select 
                          className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                          value={newStaff.role}
                          onChange={(e) => setNewStaff({...newStaff, role: e.target.value as any})}
                      >
                          <option value="MANAGER">{t('manager')}</option>
                          <option value="CASHIER">{t('cashier')}</option>
                          <option value="CHEF">{t('chef')}</option>
                          <option value="WAITER">{t('waiter')}</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('status')}</label>
                      <select 
                          className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                          value={newStaff.status}
                          onChange={(e) => setNewStaff({...newStaff, status: e.target.value as any})}
                      >
                          <option value="ACTIVE">{t('active')}</option>
                          <option value="INACTIVE">{t('inactive')}</option>
                      </select>
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('phone')}</label>
                  <input 
                      type="text" 
                      className="w-full bg-gray-100 dark:bg-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                      value={newStaff.phone || ''}
                      onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                  />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                   <Button variant="secondary" onClick={() => setIsStaffModalOpen(false)}>{t('cancel')}</Button>
                   <Button onClick={handleSaveStaff}>{newStaff.id ? t('update') : t('save')}</Button>
               </div>
          </div>
      </Modal>
    </div>
  );
};
