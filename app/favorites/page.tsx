"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Car, Wrench, X, Menu, ArrowLeft } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { getUserFavorites } from '@/lib/favorites';
import { VehicleProduct, SparePart, Favorite } from '@/lib/supabaseClient';
import { getVehicleImageUrl, getSparePartImageUrl } from '@/lib/imageUtils';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [vehicles, setVehicles] = useState<VehicleProduct[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'vehicles' | 'spare-parts'>('all');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    } catch {
      setUser(null);
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const favs = await getUserFavorites(user.id);
      setFavorites(favs);

      // Get vehicle IDs and spare part IDs
      const vehicleIds = favs.filter(f => f.product_type === 'vehicle').map(f => f.product_id);
      const sparePartIds = favs.filter(f => f.product_type === 'spare_part').map(f => f.product_id);

      // Fetch vehicles
      if (vehicleIds.length > 0) {
        const { data: vehicleData } = await supabase
          .from('vehicle_products')
          .select('*')
          .in('id', vehicleIds);
        setVehicles(vehicleData || []);
      }

      // Fetch spare parts
      if (sparePartIds.length > 0) {
        const { data: spareData } = await supabase
          .from('spare_parts')
          .select('*')
          .in('id', sparePartIds);
        setSpareParts(spareData || []);
      }
    } catch (error: any) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleRemoveFavorite = async (productId: string, productType: 'vehicle' | 'spare_part') => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('product_type', productType);

      if (!error) {
        setFavorites(favorites.filter(f => !(f.product_id === productId && f.product_type === productType)));
        if (productType === 'vehicle') {
          setVehicles(vehicles.filter(v => v.id !== productId));
        } else {
          setSpareParts(spareParts.filter(sp => sp.id !== productId));
        }
      }
    } catch (error: any) {
      console.error('Error removing favorite:', error);
    }
  };

  const filteredVehicles = activeTab === 'all' || activeTab === 'vehicles' ? vehicles : [];
  const filteredSpareParts = activeTab === 'all' || activeTab === 'spare-parts' ? spareParts : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Heart className="text-red-400 fill-current" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                JEN Automobiles
              </span>
            </Link>
            {user ? (
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
            ) : (
              <Link href="/" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all">
                Back to Home
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            My <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Favorites</span>
          </h1>
          <p className="text-xl text-slate-300">Your saved vehicles and spare parts</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-4 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 px-6 font-semibold transition-colors ${
              activeTab === 'all'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            All ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`pb-4 px-6 font-semibold transition-colors ${
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
            className={`pb-4 px-6 font-semibold transition-colors ${
              activeTab === 'spare-parts'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Wrench className="inline mr-2" size={20} />
            Spare Parts ({spareParts.length})
          </button>
        </div>

        {/* Vehicles */}
        {filteredVehicles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Favorite Vehicles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle, idx) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="aspect-video bg-slate-700/50 relative overflow-hidden">
                    <img
                      src={vehicle.image_url || getVehicleImageUrl(vehicle.type, vehicle.brand, vehicle.model)}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveFavorite(vehicle.id, 'vehicle')}
                      className="absolute top-4 right-4 p-2 bg-red-500/90 rounded-full text-white hover:bg-red-600 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-slate-400 text-sm mb-4">Type: {vehicle.type}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      ₹{vehicle.price_in_inr?.toLocaleString('en-IN')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Spare Parts */}
        {filteredSpareParts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Favorite Spare Parts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSpareParts.map((part, idx) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="aspect-square bg-slate-700/50 relative overflow-hidden">
                    <img
                      src={part.image_url || getSparePartImageUrl(part.type, part.name)}
                      alt={part.name || 'Spare Part'}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveFavorite(part.id, 'spare_part')}
                      className="absolute top-4 right-4 p-2 bg-red-500/90 rounded-full text-white hover:bg-red-600 transition-all"
                    >
                      <X size={18} />
                    </button>
                    {part.stock !== null && (
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold ${
                        part.stock > 0 ? 'bg-green-600/90' : 'bg-red-600/90'
                      } backdrop-blur-sm`}>
                        {part.stock > 0 ? `In Stock` : 'Out of Stock'}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{part.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{part.type}</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      ₹{part.price_in_inr?.toLocaleString('en-IN')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto mb-4 text-slate-500" />
            <p className="text-xl text-slate-400 mb-2">No favorites yet</p>
            <p className="text-slate-500">Start adding products to your favorites!</p>
            <Link href="/automobiles" className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all">
              Browse Vehicles
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

