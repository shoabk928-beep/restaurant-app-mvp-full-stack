import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { apiClient } from '../api/client';

export const OrderTrackingScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      const data = await apiClient('/orders/my', 'GET');
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();

    // Har 10 seconds baad orders automatic polling
    const intervalId = setInterval(() => {
      fetchMyOrders();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders Status</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderId}>Order ID: #{item._id.slice(-6)}</Text>
            <Text style={styles.total}>Total: ${item.totalAmount}</Text>
            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
              Status: {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return '#E63946';
    case 'Preparing': return '#F4A261';
    case 'Ready': return '#2A9D8F';
    case 'Served': return '#264653';
    default: return '#6C757D';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  orderCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  orderId: { fontSize: 14, fontWeight: 'bold' },
  total: { fontSize: 14, color: '#333', marginVertical: 4 },
  status: { fontSize: 14, fontWeight: 'bold' },
});

export default OrderTrackingScreen;