export const PROMO_CODES = {
  WELCOME10: 10,
  FEAST20: 20,
};

export const initialCartState = {
  items: [],
  promoCode: null,
  discountPercent: 0,
  _initialized: false, // tracks if storage has been loaded
};

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const targetId = action.payload.id || action.payload._id;
      const existingIndex = state.items.findIndex(
        (i) => (i.id || i._id) === targetId
      );
      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return { ...state, items: updatedItems };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, id: targetId, quantity: 1, note: '' }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => (item.id || item._id) !== action.payload),
      };

    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map((item) =>
          (item.id || item._id) === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map((item) =>
            (item.id || item._id) === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case 'UPDATE_NOTE':
      return {
        ...state,
        items: state.items.map((item) =>
          (item.id || item._id) === action.payload.id
            ? { ...item, note: action.payload.note }
            : item
        ),
      };

    case 'APPLY_PROMO': {
      const code = action.payload.toUpperCase();
      if (PROMO_CODES[code]) {
        return {
          ...state,
          promoCode: code,
          discountPercent: PROMO_CODES[code],
        };
      }
      return state;
    }

    case 'REMOVE_PROMO':
      return {
        ...state,
        promoCode: null,
        discountPercent: 0,
      };

    // INIT_CART: only used on app startup to restore from storage.
    // NEVER overwrites items that were already added by the user in this session.
    case 'INIT_CART': {
      // If user already added items before storage loaded, keep them
      if (state.items.length > 0) {
        return { ...state, _initialized: true };
      }
      // Restore from storage only if cart is still empty
      const payload = action.payload || {};
      return {
        ...state,
        items: Array.isArray(payload.items) ? payload.items : [],
        promoCode: payload.promoCode ?? null,
        discountPercent: payload.discountPercent ?? 0,
        _initialized: true,
      };
    }

    case 'SET_CART':
      return { ...state, ...action.payload };

    case 'CLEAR_CART':
      return { ...initialCartState, _initialized: true };

    default:
      return state;
  }
}
