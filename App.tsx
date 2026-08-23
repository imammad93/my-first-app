import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import MathGameScreen from './src/screens/MathGameScreen';
import EnglishGameScreen from './src/screens/EnglishGameScreen';
import AlphabetGameScreen from './src/screens/AlphabetGameScreen';
import { colors } from './src/theme';

export type RootStackParamList = {
  Home: undefined;
  Math: undefined;
  English: undefined;
  Alphabet: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.home },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Öyrən və Oyna' }} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
