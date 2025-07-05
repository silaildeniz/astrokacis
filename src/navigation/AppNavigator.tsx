import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import BirthInputScreen from '../screens/BirthInputScreen';
import CharacterScreen from '../screens/CharacterScreen';
import CorridorScreen from '../screens/CorridorScreen';
import PlanetRoomScreen from '../screens/PlanetRoomScreen';
import ZodiacRoomScreen from '../screens/ZodiacRoomScreen';
import ElementRoomScreen from '../screens/ElementRoomScreen';
import EvlerRoomScreen from '../screens/EvlerRoomScreen';
import KaderRoomScreen from '../screens/KaderRoomScreen';
import FinalScreen from '../screens/FinalScreen';
import PremiumScreen from '../screens/PremiumScreen';
import ReportScreen from '../screens/ReportScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0A0A0A' }
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="BirthInput" component={BirthInputScreen} />
        <Stack.Screen name="Character" component={CharacterScreen} />
        <Stack.Screen name="Corridor" component={CorridorScreen} />
        <Stack.Screen name="PlanetRoom" component={PlanetRoomScreen} />
        <Stack.Screen name="ZodiacRoom" component={ZodiacRoomScreen} />
        <Stack.Screen name="ElementRoom" component={ElementRoomScreen} />
        <Stack.Screen name="EvlerRoom" component={EvlerRoomScreen} />
        <Stack.Screen name="KaderRoom" component={KaderRoomScreen} />

        <Stack.Screen name="Final" component={FinalScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 