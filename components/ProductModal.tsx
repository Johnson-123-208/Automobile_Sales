"use client";
import React from 'react';
import { X, Heart, Car, Wrench } from 'lucide-react';
import { VehicleProduct, SparePart } from '@/lib/supabaseClient';
import { getVehicleImageUrl, getSparePartImageUrl } from '@/lib/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
  product: VehicleProduct | SparePart | null;
  productType: 'vehicle' | 'spare_part';
  isOpen: boolean;
  onClose: () => void;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

export default function ProductModal({
  product,
  productType,
  isOpen,
  onClose,
  isFavorited = false,
  onToggleFavorite,
}: ProductModalProps) {
  if (!product || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
              {/* Header */}
              <div className="relative">
                <div className="aspect-video bg-slate-700 relative overflow-hidden">
                  <img
                    src={
                      productType === 'vehicle'
                        ? (product as VehicleProduct).image_url ||
                          getVehicleImageUrl(
                            (product as VehicleProduct).type,
                            (product as VehicleProduct).brand,
                            (product as VehicleProduct).model
                          )
                        : (product as SparePart).image_url ||
                          getSparePartImageUrl((product as SparePart).type, (product as SparePart).name)
                    }
                    alt={
                      productType === 'vehicle'
                        ? `${(product as VehicleProduct).brand} ${(product as VehicleProduct).model}`
                        : (product as SparePart).name || 'Product'
                    }
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-900/80 rounded-full text-white hover:bg-slate-800 transition-all"
                  >
                    <X size={24} />
                  </button>
                  {onToggleFavorite && (
                    <button
                      onClick={onToggleFavorite}
                      className={`absolute top-4 left-4 p-3 rounded-full backdrop-blur-sm transition-all ${
                        isFavorited
                          ? 'bg-red-500/90 text-white'
                          : 'bg-slate-900/80 text-slate-300 hover:bg-red-500/90 hover:text-white'
                      }`}
                    >
                      <Heart size={24} className={isFavorited ? 'fill-current' : ''} />
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {productType === 'vehicle' ? (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <Car className="text-indigo-400" size={32} />
                          <h2 className="text-4xl font-bold text-white">
                            {(product as VehicleProduct).brand} {(product as VehicleProduct).model}
                          </h2>
                        </div>
                        <p className="text-xl text-slate-400 capitalize">{(product as VehicleProduct).type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          ₹{(product as VehicleProduct).price_in_inr?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Specs */}
                    {(product as VehicleProduct).specs && typeof (product as VehicleProduct).specs === 'object' && (
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-4 text-white">Specifications</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {(product as VehicleProduct).specs.engine && (
                            <div className="bg-slate-700/50 rounded-lg p-4">
                              <p className="text-slate-400 text-sm mb-1">Engine</p>
                              <p className="text-white font-semibold">{(product as VehicleProduct).specs.engine}</p>
                            </div>
                          )}
                          {(product as VehicleProduct).specs.mileage && (
                            <div className="bg-slate-700/50 rounded-lg p-4">
                              <p className="text-slate-400 text-sm mb-1">Mileage</p>
                              <p className="text-white font-semibold">{(product as VehicleProduct).specs.mileage}</p>
                            </div>
                          )}
                          {(product as VehicleProduct).specs.transmission && (
                            <div className="bg-slate-700/50 rounded-lg p-4">
                              <p className="text-slate-400 text-sm mb-1">Transmission</p>
                              <p className="text-white font-semibold">{(product as VehicleProduct).specs.transmission}</p>
                            </div>
                          )}
                          {(product as VehicleProduct).specs.fuel_type && (
                            <div className="bg-slate-700/50 rounded-lg p-4">
                              <p className="text-slate-400 text-sm mb-1">Fuel Type</p>
                              <p className="text-white font-semibold">{(product as VehicleProduct).specs.fuel_type}</p>
                            </div>
                          )}
                          {(product as VehicleProduct).specs.power && (
                            <div className="bg-slate-700/50 rounded-lg p-4">
                              <p className="text-slate-400 text-sm mb-1">Power</p>
                              <p className="text-white font-semibold">{(product as VehicleProduct).specs.power}</p>
                            </div>
                          )}
                          {(product as VehicleProduct).specs.seating && (
                            <div className="bg-slate-700/50 rounded-lg p-4">
                              <p className="text-slate-400 text-sm mb-1">Seating</p>
                              <p className="text-white font-semibold">{(product as VehicleProduct).specs.seating} Seats</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {(product as VehicleProduct).features && Array.isArray((product as VehicleProduct).features) && (
                      <div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(product as VehicleProduct).features.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center space-x-2 bg-slate-700/30 rounded-lg p-3">
                              <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                              <p className="text-slate-300">{feature}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <Wrench className="text-indigo-400" size={32} />
                          <h2 className="text-4xl font-bold text-white">{(product as SparePart).name}</h2>
                        </div>
                        <p className="text-xl text-slate-400 capitalize">{(product as SparePart).type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          ₹{(product as SparePart).price_in_inr?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="mb-6">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-slate-400">Stock Available</p>
                          <p className={`text-xl font-bold ${(product as SparePart).stock && (product as SparePart).stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(product as SparePart).stock && (product as SparePart).stock > 0
                              ? `${(product as SparePart).stock} units`
                              : 'Out of Stock'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Compatible Models */}
                    {(product as SparePart).compatible_models && Array.isArray((product as SparePart).compatible_models) && (
                      <div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Compatible Models</h3>
                        <div className="flex flex-wrap gap-2">
                          {(product as SparePart).compatible_models.map((model: string, idx: number) => (
                            <span key={idx} className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-300">
                              {model}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

