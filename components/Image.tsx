import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, TextInput, Text, TouchableOpacity, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { Search } from "./Search";

export function Image({ onbtnclick }) {
    const [txt, settxt] = useState('')
    const [cities, setcities] = useState([])
    const [showDropdown, setShowDropdown] = useState(false);
    const [finallat,setfinallat]=useState('');
    const [finallong,setfinallong]=useState('');
    const [city,setcity]=useState('');
    const [searchmode,setsearchmode]=useState(true);

    const fetchCities = async (txt) => {
        try {
            const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${txt}&minPopulation=10000`, {
                headers: {
                    'X-RapidAPI-Key': '4f0dcce84bmshac9e329bd55fd14p17ec6fjsnff18c2e61917', // Replace with your RapidAPI key
                    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setcities(data.data);
        } catch (error) {
            
        }
    };

    const handleSelectItem = (item) => {
        settxt(item.city);
        setShowDropdown(false);
        setfinallat(item.latitude);
        setfinallong(item.longitude);
        setcity(item.city);
        setsearchmode(false);
    };

    console.warn(searchmode)

    return (
        <SafeAreaView style={styles.safeArea}>
            {searchmode?(
                <View style={styles.contentContainer}>
                <Text style={styles.label}>Enter City Name</Text>
                <TextInput
                    onChangeText={(txt) => {
                        settxt(txt);
                        fetchCities(txt);
                        setShowDropdown(true);
                    }}
                    value={txt}
                    style={styles.input}
                    placeholder="Start typing..."
                />
                {showDropdown && (
                    <FlatList
                        style={styles.dropdown}
                        data={cities}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelectItem(item)}>
                                <Text style={styles.dropdownItem}>{item.city}, {item.country}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
            ):(
                <Search flt={finallat} flo={finallong} cy={city}/>
            )}
          
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={onbtnclick} style={styles.button}>
                    BACK TO DEFAULT
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#e0f7fa',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    dropdown: {
        maxHeight: 150,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        elevation: 3,
    },
    dropdownItem: {
        padding: 10,
        fontSize: 16,
    },
    buttonContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    button: {
        borderRadius: 10,
        paddingVertical: 12,
        backgroundColor: '#2089dc',
    },
});

export default Image;
