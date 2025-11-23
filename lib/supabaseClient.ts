import { createClient } from '@supabase/supabase-js';

// Supabase client configuration with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

// Create Supabase client with fallback values (will fail gracefully if invalid)
export const supabase = createClient(
  supabaseUrl || 'https://odhnrnmbcmtmpmkykdxl.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kaG5ybm1iY210bXBta3lrZHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTEwNjYsImV4cCI6MjA3OTMyNzA2Nn0.GnGoytGb0791bRBNnHZ8ajzwvXhV8-xr9Y4bbUmKRug',
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Database types (for TypeScript support)
export type UserRole = 'admin' | 'employee';
export type SaleType = 'vehicle' | 'spare_part';
export type InteractionStatus = 'contacted' | 'accepted' | 'rejected';

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  experience_years: number;
  created_at: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  login_time: string | null;
  logout_time: string | null;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  total_hours: number | null;
  created_at: string;
}

export interface VehicleProduct {
  id: string;
  type: string | null;
  brand: string | null;
  model: string | null;
  specs: any;
  features: any;
  price_in_inr: number | null;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
}

export interface SparePart {
  id: string;
  name: string | null;
  type: string | null;
  compatible_models: any;
  price_in_inr: number | null;
  image_url: string | null;
  stock: number | null;
  created_by: string | null;
  created_at: string;
}

export interface SalesRecord {
  id: string;
  employee_id: string;
  product_id: string;
  type: SaleType;
  client_contact: string | null;
  sale_date: string;
  price: number | null;
  profit: number | null;
  created_at: string;
}

export interface ClientInteraction {
  id: string;
  employee_id: string;
  status: InteractionStatus;
  visits: number;
  date: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  product_type: 'vehicle' | 'spare_part';
  created_at: string;
}

