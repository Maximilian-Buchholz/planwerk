import { DMMono_400Regular, DMMono_700Bold } from "@expo-google-fonts/dm-mono";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [loaded] = useFonts({
    DMMono_Regular: DMMono_400Regular,
    DMMono_Bold: DMMono_700Bold,
  });

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#bfa877" },
      }}
    />
  );
}
