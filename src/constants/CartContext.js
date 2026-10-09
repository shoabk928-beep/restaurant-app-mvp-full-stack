import { createContext, useContext, useReducer } from 'react';
import { cartReducer, initialCartState } from '../reducers/cartReducer';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const increment = (id) => dispatch({ type: 'INCREMENT', payload: id });
  const decrement = (id) => dispatch({ type: 'DECREMENT', payload: id });
  const updateNote = (id, note) =>
    dispatch({ type: 'UPDATE_NOTE', payload: { id, note } });
  const applyPromo = (code) =>
    dispatch({ type: 'APPLY_PROMO', payload: code });
  const removePromo = () => dispatch({ type: 'REMOVE_PROMO' });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * state.discountPercent) / 100;
  const deliveryFee = subtotal > 0 ? 3.99 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        promoCode: state.promoCode,
        discountPercent: state.discountPercent,
        promoError: state.promoError,
        subtotal,
        discountAmount,
        deliveryFee,
        grandTotal,
        addItem,
        removeItem,
        increment,
        decrement,
        updateNote,
        applyPromo,
        removePromo,
        clearCart,
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