"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Wrench, Plus, Edit, Trash2, Menu, X, BarChart3, Package, Users, TrendingUp, LogOut, Heart, ArrowLeft } from 'lucide-react';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { User, VehicleProduct, SparePart } from '@/lib/supabaseClient';
import { getVehicleImageUrl, getSparePartImageUrl } from '@/lib/imageUtils';
import { toggleFavorite, isFavorited } from '@/lib/favorites';
import ProductModal from '@/components/ProductModal';
import AddProductModal from '@/components/AddProductModal';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminProducts() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'spare-parts'>('vehicles');
  const [vehicles, setVehicles] = useState<VehicleProduct[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<VehicleProduct | SparePart | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<'vehicle' | 'spare_part'>('vehicle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadVehicles();
      loadSpareParts();
      loadFavorites();
    }
  }, [user, activeTab]);

  const loadFavorites = async () => {
    if (!user) return;
    const favs = new Set<string>();
    for (const vehicle of vehicles) {
      const favorited = await isFavorited(user.id, vehicle.id, 'vehicle');
      if (favorited) favs.add(vehicle.id);
    }
    for (const part of spareParts) {
      const favorited = await isFavorited(user.id, part.id, 'spare_part');
      if (favorited) favs.add(part.id);
    }
    setFavorites(favs);
  };

  const handleToggleFavorite = async (productId: string, productType: 'vehicle' | 'spare_part') => {
    if (!user) return;
    const isFav = favorites.has(productId);
    const result = await toggleFavorite(user.id, productId, productType, isFav);
    if (result.success) {
      const newFavorites = new Set(favorites);
      if (result.isFavorited) {
        newFavorites.add(productId);
      } else {
        newFavorites.delete(productId);
      }
      setFavorites(newFavorites);
    }
  };

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login?role=admin');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  };

  const loadVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error: any) {
      console.error('Error loading vehicles:', error);
    }
  };

  const loadSpareParts = async () => {
    try {
      const { data, error } = await supabase
        .from('spare_parts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSpareParts(data || []);
    } catch (error: any) {
      console.error('Error loading spare parts:', error);
    }
  };

  const handleDelete = async (id: string, type: 'vehicle' | 'spare') => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const table = type === 'vehicle' ? 'vehicle_products' : 'spare_parts';
      const { error } = await supabase.from(table).delete().eq('id', id);
      
      if (error) throw error;
      
      if (type === 'vehicle') {
        setVehicles(vehicles.filter(v => v.id !== id));
      } else {
        setSpareParts(spareParts.filter(sp => sp.id !== id));
      }
    } catch (error: any) {
      alert('Error deleting item: ' + error.message);
    }
  };

  const filteredVehicles = vehicles.filter(v =>
    v.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSpareParts = spareParts.filter(sp =>
    sp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logoutUser();
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 z-40 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <Car className="text-indigo-400" size={32} />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              JEN Automobiles
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/employees" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <Users size={20} />
            <span>Employees</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <TrendingUp size={20} />
            <span>Analytics</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="bg-slate-800 border-b border-slate-700 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold">Product Management</h1>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {/* Tabs */}
          <div className="mb-6 flex space-x-4 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`pb-4 px-4 font-semibold transition-colors ${
                activeTab === 'vehicles'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Car className="inline mr-2" size={20} />
              Vehicles ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('spare-parts')}
              className={`pb-4 px-4 font-semibold transition-colors ${
                activeTab === 'spare-parts'
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Wrench className="inline mr-2" size={20} />
              Spare Parts ({spareParts.length})
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'vehicles' ? 'vehicles' : 'spare parts'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Content */}
          {activeTab === 'vehicles' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    setSelectedProduct(vehicle);
                    setSelectedProductType('vehicle');
                    setIsModalOpen(true);
                  }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer"
                >
                  <div className="aspect-video bg-slate-700 rounded-lg mb-4 overflow-hidden relative group">
                    <img 
                      src={vehicle.image_url || getVehicleImageUrl(vehicle.type, vehicle.brand, vehicle.model)} 
                      alt={`${vehicle.brand} ${vehicle.model}` || 'Vehicle'} 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getVehicleImageUrl(vehicle.type, vehicle.brand, vehicle.model);
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(vehicle.id, 'vehicle');
                      }}
                      className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
                        favorites.has(vehicle.id)
                          ? 'bg-red-500/90 text-white'
                          : 'bg-slate-800/70 text-slate-300 hover:bg-red-500/90 hover:text-white'
                      }`}
                    >
                      <Heart size={18} className={favorites.has(vehicle.id) ? 'fill-current' : ''} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-slate-400 text-sm mb-2">Type: {vehicle.type}</p>
                  <p className="text-indigo-400 text-2xl font-bold mb-4">
                    ₹{vehicle.price_in_inr?.toLocaleString('en-IN')}
                  </p>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id, 'vehicle')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpareParts.map((part) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-all"
                >
                  <div className="aspect-video bg-slate-700 rounded-lg mb-4 overflow-hidden relative group">
                    <img 
                      src={part.image_url || getSparePartImageUrl(part.type, part.name)} 
                      alt={part.name || 'Spare Part'} 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getSparePartImageUrl(part.type, part.name);
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(part.id, 'spare_part');
                      }}
                      className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
                        favorites.has(part.id)
                          ? 'bg-red-500/90 text-white'
                          : 'bg-slate-800/70 text-slate-300 hover:bg-red-500/90 hover:text-white'
                      }`}
                    >
                      <Heart size={18} className={favorites.has(part.id) ? 'fill-current' : ''} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{part.name}</h3>
                  <p className="text-slate-400 text-sm mb-2">Type: {part.type}</p>
                  <p className="text-slate-400 text-sm mb-2">Stock: {part.stock || 0}</p>
                  <p className="text-indigo-400 text-2xl font-bold mb-4">
                    ₹{part.price_in_inr?.toLocaleString('en-IN')}
                  </p>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(part.id, 'spare')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        productType={selectedProductType}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isFavorited={selectedProduct ? favorites.has(selectedProduct.id) : false}
        onToggleFavorite={() => {
          if (selectedProduct) {
            handleToggleFavorite(selectedProduct.id, selectedProductType);
          }
        }}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        type={activeTab === 'vehicles' ? 'vehicle' : 'spare-part'}
        onAdd={async (data) => {
          if (!user) return;
          
          const table = activeTab === 'vehicles' ? 'vehicle_products' : 'spare_parts';
          const insertData = {
            ...data,
            created_by: user.id,
          };

          const { error } = await supabase
            .from(table)
            .insert([insertData]);

          if (error) throw error;

          // Reload products
          if (activeTab === 'vehicles') {
            await loadVehicles();
          } else {
            await loadSpareParts();
          }
        }}
      />
    </div>
  );
}

