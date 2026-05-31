import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [loaded] = useFonts({
    DMMono_Regular: DMMono_400Regular,
  });

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#ffffff" },
      }}
    />
  );
}
