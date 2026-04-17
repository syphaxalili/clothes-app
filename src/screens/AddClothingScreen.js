import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { clothingAPI } from "../services/api";

const AddClothingScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("top");
  const [style, setStyle] = useState("");
  const [color, setColor] = useState("");
  const [isWaterproof, setIsWaterproof] = useState(false);
  const [temperatureMin, setTemperatureMin] = useState("");
  const [temperatureMax, setTemperatureMax] = useState("");
  const [loading, setLoading] = useState(false);

  const types = ["top", "bottom", "shoes", "outerwear", "accessory"];

  const getTypeLabel = (type) => {
    const labels = {
      top: "Haut",
      bottom: "Bas",
      shoes: "Chaussures",
      outerwear: "Veste",
      accessory: "Accessoire",
    };
    return labels[type] || type;
  };

  const handleSubmit = async () => {
    if (!name || !style || !color || !temperatureMin || !temperatureMax) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const minTemp = parseInt(temperatureMin);
    const maxTemp = parseInt(temperatureMax);

    if (isNaN(minTemp) || isNaN(maxTemp)) {
      Alert.alert("Erreur", "Les températures doivent être des nombres");
      return;
    }

    if (minTemp > maxTemp) {
      Alert.alert(
        "Erreur",
        "La température minimale ne peut pas être supérieure à la maximale",
      );
      return;
    }

    setLoading(true);
    try {
      await clothingAPI.create({
        name,
        type,
        style,
        color,
        isWaterproof,
        temperatureMin: minTemp,
        temperatureMax: maxTemp,
      });

      Alert.alert("Succès", "Vêtement ajouté avec succès");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter le vêtement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: Veste en jean bleue"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          {types.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeButton, type === t && styles.typeButtonActive]}
              onPress={() => setType(t)}
            >
              <Text
                style={[styles.typeText, type === t && styles.typeTextActive]}
              >
                {getTypeLabel(t)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Style</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: Décontracté, Formel, Sport"
          value={style}
          onChangeText={setStyle}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Couleur</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: Bleu, Noir, Rouge"
          value={color}
          onChangeText={setColor}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Plage de température (°C)</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Min"
            value={temperatureMin}
            onChangeText={setTemperatureMin}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Max"
            value={temperatureMax}
            onChangeText={setTemperatureMax}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsWaterproof(!isWaterproof)}
        >
          <View
            style={[styles.checkbox, isWaterproof && styles.checkboxActive]}
          >
            {isWaterproof && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Imperméable</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Ajouter à la garde-robe</Text>
          )}
        </TouchableOpacity>
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  typeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeText: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },
  typeTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddClothingScreen;
