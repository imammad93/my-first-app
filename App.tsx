import { useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeMenuScreen from './src/screens/HomeMenuScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';
import HomeScreen from './src/screens/HomeScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import MathGameScreen from './src/screens/MathGameScreen';
import EnglishGameScreen from './src/screens/EnglishGameScreen';
import AlphabetGameScreen from './src/screens/AlphabetGameScreen';
import WorldMapScreen from './src/screens/WorldMapScreen';
import MotionQuizScreen from './src/screens/MotionQuizScreen';
import NumbersScreen from './src/screens/NumbersScreen';
import CompareScreen from './src/screens/CompareScreen';
import ColorsScreen from './src/screens/ColorsScreen';
import ShapesScreen from './src/screens/ShapesScreen';
import ClockScreen from './src/screens/ClockScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import MusicScreen from './src/screens/MusicScreen';
import DailyScreen from './src/screens/DailyScreen';
import GiftScreen from './src/screens/GiftScreen';
import ParentScreen from './src/screens/ParentScreen';
import { AgeProvider } from './src/context/AgeContext';
import { colors, fonts } from './src/theme';
import type { GameId } from './src/data/progress';

export type RootStackParamList = {
  Welcome: undefined;
  HomeMenu: undefined;
  ComingSoon: { title: string };
  Home: undefined;
  LevelSelect: { game: GameId };
  Math: { level: number };
  English: { level: number };
  Alphabet: { level: number };
  WorldMap: undefined;
  MotionQuiz: undefined;
  Numbers: undefined;
  Compare: undefined;
  Colors: undefined;
  Shapes: undefined;
  Clock: undefined;
  Achievements: undefined;
  Music: undefined;
  Daily: undefined;
  Gift: undefined;
  Parent: undefined;
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
            initialRouteName="Welcome"
            screenOptions={{
              headerStyle: { backgroundColor: colors.home },
              headerTintColor: colors.white,
              headerTitleStyle: { fontFamily: fonts.displayBold, fontSize: 19 },
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeMenu" component={HomeMenuScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ComingSoon" component={ComingSoonScreen} options={({ route }) => ({ title: route.params.title })} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Yaş seçimi' }} />
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
            <Stack.Screen
              name="MotionQuiz"
              component={MotionQuizScreen}
              options={{ title: 'Hərəkəti Tap', headerStyle: { backgroundColor: '#5AA9E6' } }}
            />
            <Stack.Screen
              name="Numbers"
              component={NumbersScreen}
              options={{ title: 'Sayıları Öyrən', headerStyle: { backgroundColor: colors.math } }}
            />
            <Stack.Screen
              name="Compare"
              component={CompareScreen}
              options={{ title: 'Daha Çox və ya Az?', headerStyle: { backgroundColor: '#E97DB0' } }}
            />
            <Stack.Screen
              name="Colors"
              component={ColorsScreen}
              options={{ title: 'Rənglər', headerStyle: { backgroundColor: '#FF9F3D' } }}
            />
            <Stack.Screen
              name="Shapes"
              component={ShapesScreen}
              options={{ title: 'Formalar', headerStyle: { backgroundColor: colors.english } }}
            />
            <Stack.Screen
              name="Clock"
              component={ClockScreen}
              options={{ title: 'Saatı Öyrən', headerStyle: { backgroundColor: '#4A9FE0' } }}
            />
            <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: 'Nailiyyətlər' }} />
            <Stack.Screen name="Music" component={MusicScreen} options={{ title: 'Musiqi/Səs' }} />
            <Stack.Screen name="Daily" component={DailyScreen} options={{ title: 'Gündəlik' }} />
            <Stack.Screen name="Gift" component={GiftScreen} options={{ title: 'Hədiyyə' }} />
            <Stack.Screen name="Parent" component={ParentScreen} options={{ title: 'Valideyn' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AgeProvider>
    </View>
  );
}
