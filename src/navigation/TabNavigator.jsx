import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import your screens here...
import { HomeScreen } from '../screens/HomeScreen';
import { ReservationScreen } from '../screens/ReservationScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#E63946',
        tabBarInactiveTintColor: '#8D99AE',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused }) => {
          let icon = '🍔';
          if (route.name === 'Book Table' || route.name === 'Reservation') icon = '📅';
          else if (route.name === 'Cart') icon = '🛒';
          else if (route.name === 'Profile') icon = '👤';

          return (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
              {icon}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Menu" component={HomeScreen} />
      <Tab.Screen name="Book Table" component={ReservationScreen} />
      {/* baki screens agar hain to woh yahan hongi */}
    </Tab.Navigator>
  );
};