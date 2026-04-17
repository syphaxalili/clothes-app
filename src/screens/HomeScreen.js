import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import { outfitAPI } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState(null);

  const getOutfitSuggestion = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await outfitAPI.getSuggestion(latitude, longitude);
      setOutfit(response.data);
      
      navigation.navigate('Result', { outfit: response.data });
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to get outfit suggestion'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Smart Wardrobe</Text>
          <Text style={styles.subtitle}>Your AI-Powered Style Assistant</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌤️ Weather-Based Outfit</Text>
          <Text style={styles.cardDescription}>
            Get personalized outfit suggestions based on current weather conditions
          </Text>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={getOutfitSuggestion}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Get Outfit Suggestion</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👔 My Wardrobe</Text>
          <Text style={styles.cardDescription}>
            Manage your clothing collection
          </Text>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Wardrobe')}
          >
            <Text style={styles.secondaryButtonText}>View Wardrobe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={styles.featureTitle}>AI-Powered</Text>
            <Text style={styles.featureText}>Smart outfit combinations</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🌡️</Text>
            <Text style={styles.featureTitle}>Weather-Aware</Text>
            <Text style={styles.featureText}>Perfect for any climate</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureTitle}>Style Match</Text>
            <Text style={styles.featureText}>Coordinated looks</Text>
          </View>
        </View>
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
  header: {
    marginBottom: 32,
    marginTop: 20
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600'
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  feature: {
    flex: 1,
    alignItems: 'center',
    padding: 12
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  }
});

export default HomeScreen;
