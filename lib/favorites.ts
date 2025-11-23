/**
 * Favorites utility functions
 */

import { supabase } from './supabaseClient';
import { Favorite } from './supabaseClient';

/**
 * Add a product to favorites
 */
export async function addToFavorites(
  userId: string,
  productId: string,
  productType: 'vehicle' | 'spare_part'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        product_id: productId,
        product_type: productType,
      });

    if (error) {
      // If it's a unique constraint error, item is already favorited
      if (error.code === '23505') {
        return { success: true }; // Already favorited, treat as success
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to add to favorites' };
  }
}

/**
 * Remove a product from favorites
 */
export async function removeFromFavorites(
  userId: string,
  productId: string,
  productType: 'vehicle' | 'spare_part'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('product_type', productType);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to remove from favorites' };
  }
}

/**
 * Check if a product is favorited
 */
export async function isFavorited(
  userId: string,
  productId: string,
  productType: 'vehicle' | 'spare_part'
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('product_type', productType)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is fine
      console.error('Error checking favorite:', error);
      return false;
    }
    
    return !!data;
  } catch (error: any) {
    console.error('Exception checking favorite:', error);
    return false;
  }
}

/**
 * Get all favorites for a user
 */
export async function getUserFavorites(userId: string): Promise<Favorite[]> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      // If it's a 406 error, it might be an RLS or header issue
      if (error.code === '406' || error.message?.includes('406')) {
        console.warn('406 error - possible RLS or header issue. Check Supabase configuration.');
      }
      return [];
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Exception fetching favorites:', error);
    return [];
  }
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  userId: string,
  productId: string,
  productType: 'vehicle' | 'spare_part',
  isCurrentlyFavorited: boolean
): Promise<{ success: boolean; isFavorited: boolean; error?: string }> {
  if (isCurrentlyFavorited) {
    const result = await removeFromFavorites(userId, productId, productType);
    return { ...result, isFavorited: false };
  } else {
    const result = await addToFavorites(userId, productId, productType);
    return { ...result, isFavorited: true };
  }
}

