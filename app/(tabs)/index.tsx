// Import necessary modules
import React, { useState, useEffect, useCallback } from "react";
import * as Location from 'expo-location';
import { View, SafeAreaView, TextInput, StyleSheet, ImageBackground, Text } from 'react-native'
const image = { uri: 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' };
import { Image } from "@/components/Image";
import { Card, Button, Title, Paragraph } from 'react-native-paper';

import MapView from 'react-native-maps';

// Define functional component
function HomeScreen() {
  // State variables and effects
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [weatherInfo, setWeather] = useState(null);
  const [defaultView, setDefaultView] = useState(true);

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync();
        setLat(loc.coords.latitude);
        setLong(loc.coords.longitude);
      }
    };

    getPermissions();
  }, []);

  const getWeather = useCallback(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=b0011235ef5bece1b52b26b323021eb9`)
      .then(res => res.json())
      .then(data => setWeather(data));
  }, [lat, long]);

  useEffect(() => {
    getWeather();
  }, [lat, long, getWeather]);

  // Event handlers
  const handleClick = () => {
    setDefaultView(false);
  }

  const onBtnClick = () => {
    setDefaultView(true);
  }

  // Render component
  return (
    <View style={styles.container}>
      {defaultView ? (
        <ImageBackground source={image} style={styles.background} resizeMode="cover">
          {lat && long && weatherInfo ? (
            <Card style={styles.card}>
              <Card.Cover source={{ uri: 'https://images.pexels.com/photos/269057/pexels-photo-269057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} style={styles.cardImage} />
              <Card.Content>
                <Title style={styles.title}>{weatherInfo.name}</Title>
                <Paragraph style={styles.text}>
                  Weather: {weatherInfo.weather && weatherInfo.weather[0] && weatherInfo.weather[0].main}
                </Paragraph>
                <Paragraph style={styles.text}>
                  Temperature: {(weatherInfo.main && (weatherInfo.main.temp - 273.15).toFixed(2))} °C
                </Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button mode="contained" onPress={handleClick} style={styles.button}>
                  WORLD WEATHER
                </Button>
              </Card.Actions>
              <View style={styles.mapWrapper}>
                <MapView
                  style={styles.map}
                  showsUserLocation
                  initialRegion={{
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                />
              </View>
            </Card>
          ) : (
            <Text style={styles.loadingText}>Loading location...</Text>
          )}
        </ImageBackground>
      ) : (
        <Image onbtnclick={onBtnClick} lti={lat} log={long} />
      )}
    </View>
  );
}

// Define component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  cardImage: {
    height: 200,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily: 'serif',
  },
  text: {
    fontSize: 20,
    marginVertical: 5,
  },
  button: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#2089dc',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  mapWrapper: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: 'blue',
    borderWidth: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
