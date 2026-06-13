import { Stack } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";

export default function OrdersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "My Orders",
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />
    </Stack>
  );
}
