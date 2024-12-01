import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import AuthScreen from './AuthScreen'; 
import MenuScreen from './MenuScreen'; 
import GameScreen from './GameScreen'; 
import GameOverScreen from './GameOverScreen'; 
import LeaderboardScreen from './LeaderboardScreen'; 

// Create a Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        {/* Authentication Screen (Sign Up / Login) */}
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />

        {/* Main Menu Screen */}
        <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />

        {/* Game Screen */}
        <Stack.Screen name="GameScreen" component={GameScreen} options={{ headerShown: false }} />

        {/* Game Over Screen */}
        <Stack.Screen name="GameOver" component={GameOverScreen} options={{ headerShown: false }} />

        {/* Leaderboard Screen */}
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
