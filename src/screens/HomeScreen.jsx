import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { apiClient } from '../api/client';
import { CartContext } from '../context/CartContext';

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { cart, addItem } = useContext(CartContext);
  const totalCartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const categories = ['All', 'Burgers', 'Pizza', 'Drinks', 'Desserts'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await apiClient('/menu');

      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    filterData(text, selectedCategory);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterData(search, category);
  };

  const filterData = (searchText, category) => {
    let result = items;
    if (category !== 'All') {
      result = result.filter(item => item.category?.toLowerCase() === category.toLowerCase());
    }
    if (searchText) {
      result = result.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    setFilteredItems(result);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        
        {/* Top Header Navigation */}
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.navBtn} 
            onPress={() => navigation.navigate('Reservation')}
          >
            <Text style={styles.navBtnText}>Reserve Table</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navBtn} 
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.navBtnText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navBtn, styles.cartBtn]} 
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartBtnText}>Cart ({totalCartCount})</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>Menu</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search food items..."
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        {/* Categories Bar */}
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryBadge,
                  selectedCategory === item && styles.activeCategoryBadge
                ]}
                onPress={() => handleCategorySelect(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item && styles.activeCategoryText
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Food List */}
        {loading ? (
          <ActivityIndicator size="large" color="#e63946" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item._id || item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.foodCard}>
                <Image source={{ uri: item.image }} style={styles.foodImage} />
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodPrice}>${item.price}</Text>
                  <TouchableOpacity 
                    style={styles.addBtn}
                    onPress={() => addItem(item)}
                  >
                    <Text style={styles.addBtnText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,



  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5
  },
  navBtn: {
    backgroundColor: '#f1f3f5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  cartBtn: {
    backgroundColor: '#e63946'
  },
  cartBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000'
  },
  searchContainer: {
    marginBottom: 12
  },
  searchInput: {
    backgroundColor: '#f1f3f5',
    padding: 12,
    borderRadius: 10,
    fontSize: 15
  },
  categoriesContainer: {
    marginBottom: 15,
    height: 40
  },
  categoryBadge: {
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 16,



    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center'
  },
  activeCategoryBadge: {
    backgroundColor: '#e63946'
  },
  categoryText: {
    color: '#333',
    fontWeight: '500'
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  foodImage: {
    width: 90,
    height: 90,
    borderRadius: 10
  },
  foodInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center'
  },
  foodName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222'
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e63946',
    marginVertical: 4
  },
  addBtn: {
    backgroundColor: '#e63946',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13
  }
});