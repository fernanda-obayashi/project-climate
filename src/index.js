import {
  View,
  Text,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

//const openWeatherKey = `f5a2e9eb7b1514af25833ecb35a1e3aa`;
let url = `https://api.openweathermap.org/data/2.5/weather?q=curitiba&appid=f5a2e9eb7b1514af25833ecb35a1e3aa`;

const Mood = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);
    //pede permissão de loc
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão para acessar localização negada");
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    try {
      const response = await fetch(
        `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
      );
      if (response.ok) {
        const data = await response.json(); //converte a resposta pra json
        console.log("data", data);
        setForecast(data);
      } else {
        throw new Error("API request failed with status " + response.status);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch weather data");
    }

    setRefreshing(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast || !forecast.current) {
    return (
      <SafeAreaView>
        <Text>Carregando...</Text>
        <ActivityIndicator size={"large"} />
      </SafeAreaView>
    );
  }

  const current = forecast.current.weather[0];

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadForecast()}
          />
        }
        style={{ marginTop: 50 }}
      >
        <Text>Previsão atual</Text>
        <Text>Sua localização</Text>
        <View>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${current.icon}@4x.png`,
            }}
          />
          <Text>{Math.round(forecast.current.temp)}ºC</Text>
          <Text>{current.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Mood;
