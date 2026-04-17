import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const ResultScreen = ({ route, navigation }) => {
  const { outfit } = route.params;
  const { weather, outfit: items, explanation } = outfit;

  const getTypeIcon = (type) => {
    const icons = {
      top: '👕',
      bottom: '👖',
      shoes: '👟',
      outerwear: '🧥',
      accessories: '🎩'
    };
    return icons[type] || '👔';
  };

  const renderClothingItem = (item, type) => {
    if (!item) return null;

    return (
      <View style={styles.itemCard}>
        <Text style={styles.itemIcon}>{getTypeIcon(type)}</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.itemType}>{type.toUpperCase()}</Text>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            {item.style} • {item.color}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.weatherCard}>
          <Text style={styles.weatherIcon}>
            {weather.isRaining ? '🌧️' : '☀️'}
          </Text>
          <View>
            <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
            <Text style={styles.weatherCondition}>
              {weather.isRaining ? 'Rainy' : 'Clear'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Perfect Outfit</Text>

        {renderClothingItem(items.top, 'top')}
        {renderClothingItem(items.bottom, 'bottom')}
        {renderClothingItem(items.shoes, 'shoes')}
        {renderClothingItem(items.outerwear, 'outerwear')}
        
        {items.accessories && items.accessories.length > 0 && (
          <>
            {items.accessories.map((accessory, index) => (
              <View key={index}>
                {renderClothingItem(accessory, 'accessories')}
              </View>
            ))}
          </>
        )}

        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>💡 Style Tip</Text>
          <Text style={styles.explanationText}>{explanation}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Get Another Suggestion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  content: {
    padding: 20
  },
  weatherCard: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  weatherIcon: {
    fontSize: 48,
    marginRight: 16
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff'
  },
  weatherCondition: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  itemIcon: {
    fontSize: 40,
    marginRight: 16
  },
  itemInfo: {
    flex: 1
  },
  itemType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4
  },
  itemDetails: {
    fontSize: 14,
    color: '#666'
  },
  explanationCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    marginBottom: 24
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8
  },
  explanationText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default ResultScreen;
