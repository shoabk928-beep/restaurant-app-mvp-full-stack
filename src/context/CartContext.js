import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { cartReducer, initialCartState } from '../reducers/cartReducer';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from storage ONCE on mount.
  // Uses INIT_CART which will NOT overwrite items the user already added.
  useEffect(() => {
    const loadCart = async () => {
      try {
        const saved = await AsyncStorage.getItem('userCart');
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({ type: 'INIT_CART', payload: parsed });
        } else {
          // Nothing saved yet — just mark as initialized
          dispatch({ type: 'INIT_CART', payload: null });
        }
      } catch (err) {
        console.error('Error loading cart:', err);
        dispatch({ type: 'INIT_CART', payload: null });
      }
    };
    loadCart();
  }, []);

  // Save to storage after every change, but ONLY after initial load is done
  // to avoid saving empty state before the persisted cart is restored.
  useEffect(() => {
    if (!state._initialized) return;
    const toSave = {
      items: state.items,
      promoCode: state.promoCode,
      discountPercent: state.discountPercent,
    };
    AsyncStorage.setItem('userCart', JSON.stringify(toSave)).catch((err) =>
      console.error('Error saving cart:', err)
    );
  }, [state]);

  const addItem    = (item)        => dispatch({ type: 'ADD_ITEM',    payload: item });
  const removeItem = (id)          => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const increment  = (id)          => dispatch({ type: 'INCREMENT',   payload: id });
  const decrement  = (id)          => dispatch({ type: 'DECREMENT',   payload: id });
  const updateNote = (id, note)    => dispatch({ type: 'UPDATE_NOTE', payload: { id, note } });
  const applyPromo = (code)        => dispatch({ type: 'APPLY_PROMO', payload: code });
  const removePromo = ()           => dispatch({ type: 'REMOVE_PROMO' });
  const clearCart  = ()            => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addItem,
        removeItem,
        increment,
        decrement,
        updateNote,
        applyPromo,
        removePromo,
        clearCart,
        cartReady: state._initialized, // expose loading flag for screens
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
