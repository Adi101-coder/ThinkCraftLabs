import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  desc: string;
}

interface CartItem extends Product {
  size: string;
  quantity: number;
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  isInCart: (productId: number) => boolean;
  clearCart: () => void;
  getCartTotal: () => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Helper to get storage key based on user
const getStorageKey = (userId: string | null, type: 'cart' | 'wishlist') => {
  if (userId) {
    return `${type}_${userId}`;
  }
  return `${type}_guest`;
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart and wishlist when user changes or on initial load
  useEffect(() => {
    if (authLoading) return;

    const userId = user?.id || null;
    const cartKey = getStorageKey(userId, 'cart');
    const wishlistKey = getStorageKey(userId, 'wishlist');

    const savedCart = localStorage.getItem(cartKey);
    const savedWishlist = localStorage.getItem(wishlistKey);

    setCart(savedCart ? JSON.parse(savedCart) : []);
    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    setIsInitialized(true);
  }, [user?.id, authLoading]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized || authLoading) return;

    const userId = user?.id || null;
    const cartKey = getStorageKey(userId, 'cart');
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, user?.id, isInitialized, authLoading]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized || authLoading) return;

    const userId = user?.id || null;
    const wishlistKey = getStorageKey(userId, 'wishlist');
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  }, [wishlist, user?.id, isInitialized, authLoading]);

  const addToCart = (product: Product, size: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id && item.size === size);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, size, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const addToWishlist = (product: Product) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.find(item => item.id === product.id);
      if (exists) {
        return prevWishlist;
      }
      return [...prevWishlist, product];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const isInCart = (productId: number) => {
    return cart.some(item => item.id === productId);
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    const total = cart.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);
    return total.toFixed(2);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isInCart,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
