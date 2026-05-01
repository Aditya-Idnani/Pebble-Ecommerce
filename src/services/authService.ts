import { supabase } from '@/lib/supabase';

export const authService = {
  async signInWithPassword({ email, password }: { email: string; password?: string }) {
    if (!password) {
      return { data: { user: null, session: null }, error: new Error('Password required') };
    }
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signInWithOtp({ email }: { email: string }) {
    return supabase.auth.signInWithOtp({ email });
  },

  async signUp({ email, password }: { email: string; password?: string }) {
    if (!password) {
      return { data: { user: null, session: null }, error: new Error('Password required') };
    }
    return supabase.auth.signUp({ email, password });
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  async updateUser({ password }: { password?: string }) {
    if (!password) return { data: { user: null }, error: new Error('Password required') };
    return supabase.auth.updateUser({ password });
  },

  async resetPasswordForEmail(email: string) {
    return supabase.auth.resetPasswordForEmail(email);
  },

  async getSession() {
    return supabase.auth.getSession();
  },

  onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
