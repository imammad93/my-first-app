import { useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import HomeScreen from './src/screens/HomeScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import MathGameScreen from './src/screens/MathGameScreen';
import EnglishGameScreen from './src/screens/EnglishGameScreen';
import AlphabetGameScreen from './src/screens/AlphabetGameScreen';
import WorldMapScreen from './src/screens/WorldMapScreen';
import { AgeProvider } from './src/context/AgeContext';
import { colors, fonts } from './src/theme';
import type { GameId } from './src/data/progress';

export type RootStackParamList = {
  Home: undefined;
  LevelSelect: { game: GameId };
  Math: { level: number };
  English: { level: number };
  Alphabet: { level: number };
  WorldMap: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    [fonts.display]: Baloo2_800ExtraBold,
    [fonts.displayBold]: Baloo2_700Bold,
    [fonts.button]: Fredoka_600SemiBold,
    [fonts.buttonBold]: Fredoka_700Bold,
  });

  const onReady = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onReady}>
      <AgeProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: colors.home },
              headerTintColor: colors.white,
              headerTitleStyle: { fontFamily: fonts.displayBold, fontSize: 19 },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Öyrən və Oyna' }} />
            <Stack.Screen
              name="LevelSelect"
              component={LevelSelectScreen}
              options={{ title: 'Səviyyələr' }}
            />
            <Stack.Screen
              name="Math"
              component={MathGameScreen}
              options={{ title: 'Riyaziyyat', headerStyle: { backgroundColor: colors.math } }}
            />
            <Stack.Screen
              name="English"
              component={EnglishGameScreen}
              options={{ title: 'İngilis dili', headerStyle: { backgroundColor: colors.english } }}
            />
            <Stack.Screen
              name="Alphabet"
              component={AlphabetGameScreen}
              options={{ title: 'Əlifba', headerStyle: { backgroundColor: colors.alphabet } }}
            />
            <Stack.Screen name="WorldMap" component={WorldMapScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AgeProvider>
    </View>
  );
}
