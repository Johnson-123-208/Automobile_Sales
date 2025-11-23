import { supabase } from './supabaseClient';
import { User, UserRole } from './supabaseClient';

/**
 * Authentication utilities
 */

// Hash password (simple implementation - in production use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  // Note: In production, use a proper hashing library like bcrypt
  // For now, we'll use a simple approach. Supabase Auth handles this better.
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Register new user
export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'employee'
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    // First, sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create user' };
    }

    // Then create user record in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
      })
      .select()
      .single();

    if (userError) {
      return { success: false, error: userError.message };
    }

    return { success: true, user: userData };
  } catch (error: any) {
    return { success: false, error: error.message || 'Registration failed' };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User; session?: any }> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Login failed' };
    }

    // Fetch user details from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // If user doesn't exist in users table, create it
    if (userError || !userData) {
      // Check if user already exists (might be a conflict)
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (existingUser) {
        // User exists, use it
        return {
          success: true,
          user: existingUser,
          session: authData.session,
        };
      }

      // Try to create user record if it doesn't exist
      const insertResult = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.email?.split('@')[0] || 'User',
          role: 'employee',
        })
        .select()
        .single();

      const { data: newUserData, error: createError } = insertResult;

      if (createError || !newUserData) {
        // Log detailed error information - handle empty error object
        const errorInfo = createError ? {
          error: createError,
          errorString: JSON.stringify(createError),
          errorKeys: Object.keys(createError || {}),
          code: createError?.code,
          message: createError?.message,
          details: createError?.details,
          hint: createError?.hint,
        } : { error: 'No error object returned' };

        console.error('User creation error details:', {
          ...errorInfo,
          insertResult,
          newUserData,
          userId: authData.user.id,
          userEmail: authData.user.email,
          userError: userError ? {
            code: userError.code,
            message: userError.message,
            details: userError.details,
            hint: userError.hint,
          } : null
        });
        
        // Return more helpful error message
        const errorMsg = createError?.message || 
                        createError?.details || 
                        createError?.hint || 
                        (createError ? 'Unknown error (check console for details)' : 'No error returned') ||
                        userError?.message || 
                        'User record not found';
        const errorCode = createError?.code ? ` (Code: ${createError.code})` : '';
        
        return { 
          success: false, 
          error: `Failed to create user record: ${errorMsg}${errorCode}. Please ensure the INSERT policy exists for the users table. If the user already exists, try logging in again.` 
        };
      }

      return {
        success: true,
        user: newUserData,
        session: authData.session,
      };
    }

    return {
      success: true,
      user: userData,
      session: authData.session,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed' };
  }
}

// Logout user
export async function logoutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Logout failed' };
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      return null;
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error || !userData) {
      return null;
    }

    return userData;
  } catch (error) {
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

// Get user role
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

