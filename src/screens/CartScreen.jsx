import { useContext } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartContext } from '../context/CartContext';

const CartScreen = ({ navigation }) => {
  const { cart, removeItem, increment, decrement, clearCart } = useContext(CartContext);
  const items = cart?.items || [];

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your Cart is Empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item._id || item.id}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                </View>
                <View style={styles.qtyContainer}>
                  <TouchableOpacity onPress={() => decrement(item.id || item._id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increment(item.id || item._id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => alert('Order Placed!')}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#888' },
  cartCard: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { color: '#e63946', marginTop: 4 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: '#ddd', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  qtyBtnText: { fontSize: 16, fontWeight: 'bold' },
  qtyText: { marginHorizontal: 10, fontSize: 16 },
  footer: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16, marginTop: 10 },
  totalText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  checkoutBtn: { backgroundColor: '#e63946', padding: 14, borderRadius: 8, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

// Primary Requirement:

// File ke bilkul bottom par:
export default CartScreen;