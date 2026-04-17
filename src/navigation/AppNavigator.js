import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import WardrobeScreen from "../screens/WardrobeScreen";
import AddClothingScreen from "../screens/AddClothingScreen";
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
        options={{ title: "Ajouter un Vêtement" }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeStack}
        options={{
          tabBarLabel: "Garde-robe",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👔</Text>,
          headerShown: false,
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
            options={{ title: "Suggestion de Tenue" }}
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
