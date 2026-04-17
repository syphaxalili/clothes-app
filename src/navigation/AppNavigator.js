import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import WardrobeScreen from '../screens/WardrobeScreen';
import AddClothingScreen from '../screens/AddClothingScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const WardrobeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="WardrobeList" 
        component={WardrobeScreen}
        options={{ title: 'My Wardrobe' }}
      />
      <Stack.Screen 
        name="AddClothing" 
        component={AddClothingScreen}
        options={{ title: 'Add Clothing' }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🏠</span>,
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Wardrobe" 
        component={WardrobeStack}
        options={{
          tabBarLabel: 'Wardrobe',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>👔</span>,
          headerShown: false
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
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Result" 
            component={ResultScreen}
            options={{ title: 'Outfit Suggestion' }}
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
