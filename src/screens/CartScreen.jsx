import { useContext } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiClient } from '../api/client';
import { CartContext } from '../context/CartContext';

const CartScreen = ({ navigation }) => {
  const { cart, cartReady, removeItem, increment, decrement, clearCart } =
    useContext(CartContext);
  const items = cart?.items || [];

  const calculateTotal = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      const orderItems = items.map((item) => ({
        menuItem: item._id || item.id,
        quantity: item.quantity,
        price: item.price,
      }));
      await apiClient('/orders', 'POST', {
        items: orderItems,
        totalAmount: calculateTotal(),
      });
      Alert.alert('Success', 'Order Placed & Saved to Database!');
      clearCart();
    } catch (error) {
      console.error('Checkout Error:', error);
      Alert.alert(
        'Checkout Failed',
        error.message || 'Make sure backend server is running.'
      );
    }
  };

  // Show spinner while cart is being restored from storage
  if (!cartReady) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#e63946" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your Cart is Empty</Text>
          <Text style={styles.emptySubText}>
            Looks like you haven't added anything to your cart yet.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseBtnText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item._id || item.id)}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
                </View>
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    onPress={() => decrement(item.id || item._id)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => increment(item.id || item._id)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  center: { justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  browseBtn: {
    backgroundColor: '#e63946',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 8,
  },
  browseBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cartCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { color: '#e63946', marginTop: 4 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    backgroundColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  qtyBtnText: { fontSize: 18, fontWeight: 'bold', lineHeight: 22 },
  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: '600' },
  footer: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16, marginTop: 10 },
  totalText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  checkoutBtn: {
    backgroundColor: '#e63946',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CartScreen;
