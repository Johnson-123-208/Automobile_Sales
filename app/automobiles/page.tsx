"use client";
import React, { useState, useEffect } from 'react';
import { Car, Search, Filter, Slider, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { VehicleProduct } from '@/lib/supabaseClient';
import { getVehicleImageUrl } from '@/lib/imageUtils';
import { getCurrentUser } from '@/lib/auth';
import { toggleFavorite, isFavorited } from '@/lib/favorites';
import ProductModal from '@/components/ProductModal';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AutomobilesPage() {
  const [vehicles, setVehicles] = useState<VehicleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<VehicleProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    loadVehicles();
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      // User not logged in, that's okay for public page
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    const favs = new Set<string>();
    for (const vehicle of vehicles) {
      const favorited = await isFavorited(user.id, vehicle.id, 'vehicle');
      if (favorited) favs.add(vehicle.id);
    }
    setFavorites(favs);
  };

  const handleToggleFavorite = async (vehicleId: string) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    const isFav = favorites.has(vehicleId);
    const result = await toggleFavorite(user.id, vehicleId, 'vehicle', isFav);
    if (result.success) {
      const newFavorites = new Set(favorites);
      if (result.isFavorited) {
        newFavorites.add(vehicleId);
      } else {
        newFavorites.delete(vehicleId);
      }
      setFavorites(newFavorites);
    }
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
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = !searchTerm || 
      v.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.type || v.type === filters.type;
    const matchesBrand = !filters.brand || v.brand === filters.brand;
    const matchesMinPrice = !filters.minPrice || (v.price_in_inr || 0) >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || (v.price_in_inr || 0) <= Number(filters.maxPrice);

    return matchesSearch && matchesType && matchesBrand && matchesMinPrice && matchesMaxPrice;
  });

  const uniqueTypes = [...new Set(vehicles.map(v => v.type).filter(Boolean))];
  const uniqueBrands = [...new Set(vehicles.map(v => v.brand).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading vehicles...</div>
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
              <Car className="text-indigo-400" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                JEN Automobiles
              </span>
            </Link>
            <Link href="/login?role=employee" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all">
              Employee Login
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Premium <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Vehicles</span>
          </h1>
          <p className="text-xl text-slate-300">Browse our extensive collection of cars, bikes, autos, and scooties</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by model or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price (₹)"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />

            <input
              type="number"
              placeholder="Max Price (₹)"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-slate-300">
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, idx) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => {
                setSelectedProduct(vehicle);
                setIsModalOpen(true);
              }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
            >
              <div className="aspect-video bg-slate-700/50 relative overflow-hidden group">
                <img 
                  src={vehicle.image_url || getVehicleImageUrl(vehicle.type, vehicle.brand, vehicle.model)} 
                  alt={`${vehicle.brand} ${vehicle.model}` || 'Vehicle'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getVehicleImageUrl(vehicle.type, vehicle.brand, vehicle.model);
                  }}
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-600/90 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                  {vehicle.type}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(vehicle.id);
                  }}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
                    favorites.has(vehicle.id)
                      ? 'bg-red-500/90 text-white'
                      : 'bg-slate-800/70 text-slate-300 hover:bg-red-500/90 hover:text-white'
                  }`}
                >
                  <Heart size={20} className={favorites.has(vehicle.id) ? 'fill-current' : ''} />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{vehicle.brand} {vehicle.model}</h3>
                {vehicle.specs && typeof vehicle.specs === 'object' && (
                  <div className="text-slate-400 text-sm mb-4 space-y-1">
                    {vehicle.specs.engine && <p>Engine: {vehicle.specs.engine}</p>}
                    {vehicle.specs.mileage && <p>Mileage: {vehicle.specs.mileage}</p>}
                    {vehicle.specs.transmission && <p>Transmission: {vehicle.specs.transmission}</p>}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    ₹{vehicle.price_in_inr?.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(vehicle);
                      setIsModalOpen(true);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-20">
            <Car size={64} className="mx-auto mb-4 text-slate-500" />
            <p className="text-xl text-slate-400">No vehicles found matching your criteria</p>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        productType="vehicle"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isFavorited={selectedProduct ? favorites.has(selectedProduct.id) : false}
        onToggleFavorite={() => {
          if (selectedProduct) {
            handleToggleFavorite(selectedProduct.id);
          }
        }}
      />
    </div>
  );
}

