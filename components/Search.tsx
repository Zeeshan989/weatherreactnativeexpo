import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, TextInput, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';

export function Search({ flt, flo,cy }) {

       

        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = "2024-05-24";
        

    const [forecast, setForecast] = useState([]);
    const todayforecast=forecast.filter((tod)=> 
        tod.dt_txt.startsWith(currentDate) 
);
    


    const fore = () => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${flt}&lon=${flo}&appid=b0011235ef5bece1b52b26b323021eb9&units=metric`)
            .then((res) => res.json())
            .then((data) => setForecast(data["list"]));
    };

    useEffect(() => {
        fore();
    }, []);

    return (
        <>
            {forecast ? (
                <ScrollView>
                    <View style={styles.container}>
                        <Text   style={styles.city}>{cy}'s Weather</Text>
                        {todayforecast.map((lst, index) => (
                            <View style={styles.cardWrapper} key={index}>
                                <Card style={styles.card}>
                                <Text>{lst.dt_txt.split(' ')[1]}</Text>

                                    <Card.Cover source={{ uri: `http://openweathermap.org/img/wn/${lst.weather[0].icon}@2x.png` }} style={styles.cardImage} />
                                    <Card.Content>
                                        <Title style={styles.title}>{lst.main.temp} °C</Title>
                                        <Paragraph style={styles.text1}>{(lst.weather[0].description).toUpperCase()}</Paragraph>
                                        <Paragraph style={styles.text}>Feels Like: {lst.main.feels_like} °C</Paragraph>
                                        <Paragraph style={styles.text}>Humidity: {lst.main.humidity} % 💧</Paragraph>
                                        <Paragraph style={styles.text}>Wind: {lst.wind.speed} m/s ☂</Paragraph>
                                    </Card.Content>
                                </Card>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <Text>Loading....</Text>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    city:{
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical: 20,
        fontFamily: 'serif',

    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 10,
    },
    cardWrapper: {
        width: '48%',
        marginVertical: 10,
    },
    card: {
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
    },
    cardImage: {
        height: 90,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        fontFamily: 'serif',
    },
    text: {
        fontSize: 13,
        color:'red',
        marginVertical: 5,
    },
    text1: {
        fontSize: 16,
        color:'blue',
        marginVertical: 5,
    },
});

export default Search;
