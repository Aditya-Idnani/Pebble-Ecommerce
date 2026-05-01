// This is a local mock API to replace the previous external backend dependencies.
// It uses localStorage to simulate database persistence and delays to simulate network requests.

export interface User {
  id: string;
  email?: string;
}

export interface Session {
  access_token: string;
  user: User | null;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStorage = (key: string, defaultValue: any) => {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : defaultValue;
};

const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const api = {
  auth: {
    async signInWithPassword({ email, password }: { email: string; password?: string }) {
      await delay(500);
      const user = { id: `user-${Date.now()}`, email };
      setStorage('pebble_user', user);
      setStorage('pebble_session', { access_token: 'mock-token', user });
      return { data: { user }, error: null };
    },
    
    async signInWithOtp({ email }: { email: string; options?: any }) {
      await delay(500);
      return { data: {}, error: null };
    },

    async signUp({ email, password }: { email: string; password?: string }) {
      await delay(500);
      const user = { id: `user-${Date.now()}`, email };
      setStorage('pebble_user', user);
      setStorage('pebble_session', { access_token: 'mock-token', user });
      return { data: { user }, error: null };
    },

    async signOut() {
      await delay(300);
      localStorage.removeItem('pebble_user');
      localStorage.removeItem('pebble_session');
      return { error: null };
    },

    async updateUser({ password }: { password?: string }) {
      await delay(500);
      return { data: {}, error: null };
    },

    async resetPasswordForEmail(email: string, options?: any) {
      await delay(500);
      return { data: {}, error: null };
    },

    async getSession() {
      const session = getStorage('pebble_session', null);
      return { data: { session }, error: null };
    }
  },

  db: {
    profiles: {
      async get(userId: string) {
        await delay(200);
        const profiles = getStorage('pebble_profiles', {});
        return { data: profiles[userId] || { display_name: null, avatar_url: null }, error: null };
      },
      async update(userId: string, data: any) {
        await delay(200);
        const profiles = getStorage('pebble_profiles', {});
        profiles[userId] = { ...profiles[userId], ...data };
        setStorage('pebble_profiles', profiles);
        return { error: null };
      }
    },
    user_roles: {
      async get(userId: string) {
        await delay(200);
        const roles = getStorage('pebble_roles', {});
        return { data: roles[userId] || { role: 'customer' }, error: null };
      },
      async insert(data: any) {
        await delay(200);
        const roles = getStorage('pebble_roles', {});
        roles[data.user_id] = { role: data.role };
        setStorage('pebble_roles', roles);
        return { error: null };
      }
    },
    stores: {
      async getByHandle(handle: string) {
        await delay(200);
        const stores = getStorage('pebble_stores', {});
        const store = Object.values(stores).find((s: any) => s.handle === handle);
        return { data: store || null, error: null };
      },
      async getBySeller(sellerId: string) {
        await delay(200);
        const stores = getStorage('pebble_stores', {});
        const store = Object.values(stores).find((s: any) => s.seller_id === sellerId);
        return { data: store || null, error: null };
      },
      async insert(data: any) {
        await delay(200);
        const stores = getStorage('pebble_stores', {});
        stores[data.id || Date.now()] = data;
        setStorage('pebble_stores', stores);
        return { error: null };
      }
    }
  },

  storage: {
    async upload(bucket: string, path: string, file: File) {
      await delay(500);
      // Mock URL creation
      const url = URL.createObjectURL(file);
      return { data: { path }, error: null, url };
    },
    getPublicUrl(bucket: string, path: string) {
      // In a real app this would return a real URL. For mock, we just return a placeholder or the original path.
      return { data: { publicUrl: `https://via.placeholder.com/150?text=${path}` } };
    }
  }
};
