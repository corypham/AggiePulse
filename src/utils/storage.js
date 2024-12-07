import AsyncStorage from '@react-native-async-storage/async-storage';

export const cacheData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching data:', error);
  }
}; 