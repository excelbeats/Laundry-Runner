import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppStateProvider } from "@/hooks/useAppState";
import Colors from "@/constants/colors";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="schedule-pickup"
        options={{
          title: "Schedule Pickup",
          presentation: "modal",
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.primary,
        }}
      />
      <Stack.Screen
        name="order-details"
        options={{
          title: "Order Details",
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.primary,
        }}
      />
      <Stack.Screen
        name="order-tracking"
        options={{
          title: "Live Tracking",
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.primary,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.primary,
        }}
      />
      <Stack.Screen
        name="driver-dashboard"
        options={{
          title: "Driver Dashboard",
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.primary,
        }}
      />
      <Stack.Screen
        name="admin-dashboard"
        options={{
          title: "Admin Panel",
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.primary,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppStateProvider>
          <RootLayoutNav />
        </AppStateProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
