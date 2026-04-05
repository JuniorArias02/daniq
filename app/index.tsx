import { Text, View, StatusBar } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <StatusBar barStyle="light-content" />
      <View className="items-center p-5">
        <Text className="text-5xl font-extrabold text-white tracking-tighter">
          Hola Mundo
        </Text>
        <View className="h-1 w-10 bg-blue-500 rounded-full mt-5 mb-1" />
        <Text className="text-lg text-slate-400 mt-2 font-medium">
          NativeWind v4 is Ready!
        </Text>
      </View>
    </View>
  );
}


