import { Stack } from "expo-router";
import { useRouter } from "expo-router";

const homeLayout = () => {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="About" options={{ headerShown: false }} />
      <Stack.Screen name="Settings" options={{ headerShown: false }} />
    </Stack>
  );
};

export default homeLayout;