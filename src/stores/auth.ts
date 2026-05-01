import { create } from 'zustand';
import { api, User, Session } from '@/lib/api';

export type AppRole = 'customer' | 'seller' | 'admin';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: { display_name: string | null; avatar_url: string | null } | null;
  role: AppRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  initialize: () => () => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  role: null,
  loading: true,
  isAuthenticated: false,

  initialize: () => {
    const initAuth = async () => {
      const { data: { session } } = await api.auth.getSession();
      
      if (session?.user) {
        set({ session, user: session.user, isAuthenticated: true });
        
        const [profileRes, roleRes] = await Promise.all([
          api.db.profiles.get(session.user.id),
          api.db.user_roles.get(session.user.id)
        ]);

        set({
          profile: profileRes.data || null,
          role: (roleRes.data?.role as AppRole) ?? null,
          loading: false,
        });
      } else {
        set({ session: null, user: null, isAuthenticated: false, profile: null, role: null, loading: false });
      }
    };

    initAuth();

    // Mock subscription (does nothing in local state, just returns cleanup function)
    return () => {};
  },

  signOut: async () => {
    await api.auth.signOut();
    set({ user: null, session: null, profile: null, role: null, isAuthenticated: false });
  },

  refreshProfile: async () => {
    const user = get().user;
    if (!user) return;
    const { data: profile } = await api.db.profiles.get(user.id);
    set({ profile: profile ?? null });
  },
}));
