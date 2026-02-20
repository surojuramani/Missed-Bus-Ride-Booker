
// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
import { BookingProvider } from "@/context/BookingContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0B0E14' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="search-location"
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="select-ride" />
      <Stack.Screen name="payment" />
      <Stack.Screen
        name="booking-confirmed"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <RootLayoutNav />
        <BookingProvider>
          <RootLayoutNav />
        </BookingProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}