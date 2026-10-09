import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Mock Time Slots & Tables Fallback
const TIME_SLOTS = ['12:00 PM', '01:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'];

export const ReservationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  // Safe State Initialization
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0] || '');
  const [partySize, setPartySize] = useState('2');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleBooking = () => {
    if (!customerName.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill in all details.');
      return;
    }

    Alert.alert(
      'Reservation Confirmed!',
      `Table reserved for ${partySize} person(s) on ${date} at ${selectedSlot}.`,
      [{ text: 'OK', onPress: () => navigation?.navigate('Home') }]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme?.background || '#F8F9FA' },
      ]}
    >
      <Text style={[styles.title, { color: theme?.primary || '#E63946' }]}>
        Book a Table
      </Text>

      {/* Date Input */}
      <Input
        label="Date"
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />

      {/* Party Size Input */}
      <Input
        label="Number of Guests"
        value={partySize}
        onChangeText={setPartySize}
        keyboardType="numeric"
        placeholder="2"
      />

      {/* Time Slots */}
      <Text style={[styles.label, { color: theme?.text || '#212529' }]}>
        Select Time Slot
      </Text>
      <View style={styles.slotsContainer}>
        {TIME_SLOTS.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <TouchableOpacity
              key={slot}
              style={[
                styles.slotChip,
                {
                  backgroundColor: isSelected
                    ? theme?.primary || '#E63946'
                    : theme?.cardBackground || '#FFFFFF',
                },
              ]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text
                style={{
                  color: isSelected ? '#FFFFFF' : theme?.text || '#212529',
                  fontWeight: '600',
                }}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Contact Details */}
      <Input
        label="Your Name"
        value={customerName}
        onChangeText={setCustomerName}
        placeholder="Enter your name"
      />

      <Input
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
      />

      <Button
        title="Confirm Reservation"
        onPress={handleBooking}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  slotChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    elevation: 1,
  },
});
// File ke bilkul bottom par:
export default ReservationScreen;
