import { StyleSheet, Text, View } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name: John Doe</Text>
        <Text style={styles.label}>Email: user@example.com</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 15, borderRadius: 10, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 16, marginBottom: 8, color: '#333' }
});

// Primary Requirement: Exact default export
export default ProfileScreen;