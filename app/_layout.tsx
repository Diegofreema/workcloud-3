import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  Slot,
  Stack,
  useNavigation,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { useDarkMode } from '@/hooks/useDarkMode';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { StatusBar } from 'expo-status-bar';

const ClerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    PoppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsBoldItalic: require('../assets/fonts/Poppins-BoldItalic.ttf'),
    PoppinsLightItalic: require('../assets/fonts/Poppins-BoldItalic.ttf'),
    ...FontAwesome.font,
  });
  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        console.log(error);
      }
    }
    onFetchUpdateAsync();
  }, []);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={ClerkKey} tokenCache={tokenCache}>
      <GluestackUIProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider>
            <RootLayoutNav />
            <Toast />
          </PaperProvider>
        </QueryClientProvider>
      </GluestackUIProvider>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const { darkMode } = useDarkMode();
  const segment = useSegments();
  const rootNavigation = useNavigation();
  const [isReady, setIsReady] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = rootNavigation?.addListener('state', () => {
      setIsReady(true);
    });

    return () => unsubscribe && unsubscribe();
  }, [rootNavigation]);

  useEffect(() => {
    if (!isReady || !isLoaded) {
      return;
    }
    const isAuthGroup = segment[0] === '(auth)';

    if (isLoaded && !isSignedIn && !isAuthGroup) {
      router.replace('/');
    } else if (isSignedIn && isAuthGroup) {
      router.replace('/home');
    }
  }, [isLoaded, isSignedIn, segment, isReady]);

  return (
    <ThemeProvider value={darkMode ? DarkTheme : DefaultTheme}>
      <StatusBar style="dark" />
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <SignedIn>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(app)" />
          </Stack>
        </SignedIn>
        <SignedOut>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)/index" />
          </Stack>
        </SignedOut>
      </SafeAreaView>
    </ThemeProvider>
  );
}
