"use client";
import React, { useState, useEffect } from 'react';
import { Wrench, Search, Package, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { SparePart } from '@/lib/supabaseClient';
import { getSparePartImageUrl } from '@/lib/imageUtils';
import { getCurrentUser } from '@/lib/auth';
import { toggleFavorite, isFavorited } from '@/lib/favorites';
import ProductModal from '@/components/ProductModal';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SparePartsPage() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<SparePart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    loadSpareParts();
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
    for (const part of spareParts) {
      const favorited = await isFavorited(user.id, part.id, 'spare_part');
      if (favorited) favs.add(part.id);
    }
    setFavorites(favs);
  };

  const handleToggleFavorite = async (partId: string) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    const isFav = favorites.has(partId);
    const result = await toggleFavorite(user.id, partId, 'spare_part', isFav);
    if (result.success) {
      const newFavorites = new Set(favorites);
      if (result.isFavorited) {
        newFavorites.add(partId);
      } else {
        newFavorites.delete(partId);
      }
      setFavorites(newFavorites);
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
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = spareParts.filter(sp => {
    const matchesSearch = !searchTerm || 
      sp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.type || sp.type === filters.type;
    const matchesMinPrice = !filters.minPrice || (sp.price_in_inr || 0) >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || (sp.price_in_inr || 0) <= Number(filters.maxPrice);

    return matchesSearch && matchesType && matchesMinPrice && matchesMaxPrice;
  });

  const uniqueTypes = [...new Set(spareParts.map(sp => sp.type).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading spare parts...</div>
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
              <Wrench className="text-indigo-400" size={32} />
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
            Genuine <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Spare Parts</span>
          </h1>
          <p className="text-xl text-slate-300">Authentic spare parts with compatibility matching for all models</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          Showing {filteredParts.length} of {spareParts.length} spare parts
        </div>

        {/* Spare Parts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredParts.map((part, idx) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setSelectedProduct(part);
                setIsModalOpen(true);
              }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
            >
              <div className="aspect-square bg-slate-700/50 relative overflow-hidden group">
                <img 
                  src={part.image_url || getSparePartImageUrl(part.type, part.name)} 
                  alt={part.name || 'Spare Part'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getSparePartImageUrl(part.type, part.name);
                  }}
                />
                {part.stock !== null && (
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold ${
                    part.stock > 0 ? 'bg-green-600/90' : 'bg-red-600/90'
                  } backdrop-blur-sm`}>
                    {part.stock > 0 ? `In Stock (${part.stock})` : 'Out of Stock'}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(part.id);
                  }}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
                    favorites.has(part.id)
                      ? 'bg-red-500/90 text-white'
                      : 'bg-slate-800/70 text-slate-300 hover:bg-red-500/90 hover:text-white'
                  }`}
                >
                  <Heart size={20} className={favorites.has(part.id) ? 'fill-current' : ''} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{part.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{part.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    ₹{part.price_in_inr?.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(part);
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all text-sm font-semibold"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredParts.length === 0 && (
          <div className="text-center py-20">
            <Wrench size={64} className="mx-auto mb-4 text-slate-500" />
            <p className="text-xl text-slate-400">No spare parts found matching your criteria</p>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        productType="spare_part"
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

