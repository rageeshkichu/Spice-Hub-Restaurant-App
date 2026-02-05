import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(
          (i) => i.id === item.id && i.portionType === item.portionType
        );
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id && i.portionType === item.portionType
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      
      removeItem: (itemId, portionType) => {
        set({
          items: get().items.filter(
            (i) => !(i.id === itemId && i.portionType === portionType)
          ),
        });
      },
      
      updateQuantity: (itemId, portionType, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId, portionType);
          return;
        }
        
        set({
          items: get().items.map((i) =>
            i.id === itemId && i.portionType === portionType
              ? { ...i, quantity }
              : i
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isAdmin: user?.is_admin || false
      }),
      
      logout: () => set({ user: null, isAuthenticated: false, isAdmin: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
