import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  set<T>(key: string, value: T) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string) {
    return AsyncStorage.getItem(key).then(
      value => (value && (JSON.parse(value) as T)) || undefined,
    );
  }

  remove(key: string) {
    return AsyncStorage.removeItem(key);
  }
}

export default new Storage();
