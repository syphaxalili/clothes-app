import React from "react";
import { Platform, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import WardrobeScreen from "../screens/WardrobeScreen";
import AddClothingScreen from "../screens/AddClothingScreen";
import EditClothingScreen from "../screens/EditClothingScreen";
import ResultScreen from "../screens/ResultScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const WardrobeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WardrobeList"
        component={WardrobeScreen}
        options={{ title: "Ma Garde-robe" }}
      />
      <Stack.Screen
        name="AddClothing"
        component={AddClothingScreen}
        options={{ title: "Ajouter un vêtement" }}
      />
      <Stack.Screen
        name="EditClothing"
        component={EditClothingScreen}
        options={{ title: "Modifier le vêtement" }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: Platform.OS === "android" ? 4 : 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomInset,
          height: 58 + bottomInset,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeStack}
        options={{
          tabBarLabel: "Garde-robe",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>👔</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false, title: "Accueil" }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{ title: "Suggestion de tenue" }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
