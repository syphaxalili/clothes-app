import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { outfitAPI, weatherAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    setLoadingWeather(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoadingWeather(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const weatherData = await weatherAPI.getWeather(latitude, longitude);
      setWeather({
        temperature: weatherData.current.temperature_2m,
        isRaining:
          weatherData.current.rain > 0 || weatherData.current.precipitation > 0,
      });
    } catch (error) {
      console.error("Erreur météo:", error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const getOutfitSuggestion = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "La localisation est requise");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await outfitAPI.getSuggestion(latitude, longitude);
      setOutfit(response.data);

      navigation.navigate("Result", { outfit: response.data });
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.response?.data?.error || "Impossible d'obtenir une suggestion",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Déconnexion", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.userHeader}>
          <View>
            <Text style={styles.welcomeText}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.name || "Utilisateur"}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        {loadingWeather ? (
          <View style={styles.weatherCard}>
            <ActivityIndicator color="#007AFF" />
          </View>
        ) : weather ? (
          <View style={styles.weatherCard}>
            <Text style={styles.weatherIcon}>
              {weather.isRaining ? "🌧️" : "☀️"}
            </Text>
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherTemp}>
                {Math.round(weather.temperature)}°C
              </Text>
              <Text style={styles.weatherCondition}>
                {weather.isRaining ? "Pluvieux" : "Ensoleillé"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={loadWeather}
              style={styles.refreshButton}
            >
              <Text style={styles.refreshIcon}>🔄</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.header}>
          <Text style={styles.title}>Smart Wardrobe</Text>
          <Text style={styles.subtitle}>Votre Assistant Style IA</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌤️ Tenue selon la météo</Text>
          <Text style={styles.cardDescription}>
            Obtenez des suggestions de tenues personnalisées basées sur la météo
            actuelle
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={getOutfitSuggestion}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Obtenir une suggestion
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👔 Ma Garde-robe</Text>
          <Text style={styles.cardDescription}>
            Gérez votre collection de vêtements
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Wardrobe")}
          >
            <Text style={styles.secondaryButtonText}>Voir ma garde-robe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={styles.featureTitle}>IA Puissante</Text>
            <Text style={styles.featureText}>Combinaisons intelligentes</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🌡️</Text>
            <Text style={styles.featureTitle}>Météo Adaptée</Text>
            <Text style={styles.featureText}>Parfait pour tout climat</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureTitle}>Style Assorti</Text>
            <Text style={styles.featureText}>Looks coordonnés</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 20,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  weatherCard: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  weatherIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  weatherCondition: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  refreshButton: {
    padding: 8,
  },
  refreshIcon: {
    fontSize: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  feature: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default HomeScreen;
