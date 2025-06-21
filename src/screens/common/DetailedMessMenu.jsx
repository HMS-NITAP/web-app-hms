import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchDetailedMessMenu } from '../../services/operations/CommonAPI';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';

const days = [ 'Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const meals = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

const getCurrentSession = () => {
    const now = new Date();
    const currentHour = now.getHours();

    if(currentHour >= 0 && currentHour < 10){
        return 'Breakfast';
    }else if(currentHour >= 10 && currentHour < 15){
        return 'Lunch';
    }else if(currentHour >= 15 && currentHour < 18){
        return 'Snacks';
    }else{
        return 'Dinner';
    }
};

const DetailedMessMenu = () => {

    const [selectedDay, setSelectedDay] = useState(days[new Date().getDay()]);
    const [mealPeriod, setMealPeriod] = useState(getCurrentSession());
    const [detailedMessMenu, setDetailedMessMenu] = useState(null);
    const [menu, setMenu] = useState(null);

    const dispatch = useDispatch();
    const toast = useToast();

    const fetchData = async() => {
        const response = await dispatch(fetchDetailedMessMenu(toast));
        setDetailedMessMenu(response);
    }

    useFocusEffect(
        useCallback(() => {
            setSelectedDay(days[new Date().getDay()]);
            setMealPeriod(getCurrentSession());
            fetchData();
        }, [toast])
    );

    useEffect(() => {
        if(detailedMessMenu!==null && selectedDay && mealPeriod){
            setMenu(detailedMessMenu[selectedDay][mealPeriod]);
        }
    },[selectedDay,mealPeriod,detailedMessMenu]);

    return (
        <ScrollView contentContainerStyle={{display:"flex", flexDirection:"column", justifyContent:"flex-start", alignItems:"center", width:"100%", gap:30, paddingHorizontal:20, paddingVertical:15}}>
            <View style={{display:"flex", width:"100%"}}>
                <Text style={{fontSize:16, fontWeight:"700", color:"black", marginBottom:10}}>Select Day :</Text>
                <View style={{width:"100%", display : "flex", flexDirection:"row", gap:10, justifyContent:"space-around", flexWrap:"wrap", justifyContent: 'center', alignItems: 'center'}}>
                    {days.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{backgroundColor:selectedDay===day ? '#0d3b66' : '#99d98c', padding: 7, alignItems: 'center', borderRadius: 10}}
                            onPress={() => setSelectedDay(day)}
                        >
                            <Text style={{fontSize: 16, color:selectedDay===day ? "white" : "black", fontWeight: "600"}}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={{display:"flex", width:"100%"}}>
                <Text style={{fontSize:16, fontWeight:"700", color:"black", marginBottom:10}}>Select Meal Session :</Text>
                <View style={{width:"100%", display : "flex", flexDirection:"row", gap:10, justifyContent:"space-around", flexWrap:"wrap", justifyContent: 'center', alignItems: 'center'}}>
                    {meals.map((meal, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{backgroundColor:mealPeriod===meal ? '#0d3b66' : '#99d98c', padding: 7, alignItems: 'center', borderRadius: 10}}
                            onPress={() => setMealPeriod(meal)}
                        >
                            <Text style={{fontSize: 16, color:mealPeriod===meal ? "white" : "black", fontWeight: "600"}}>{meal}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={{display:"flex", width:"100%"}}>
                <Text style={{fontSize:16, fontWeight:"600", color:"black", marginBottom:10}}>Menu Items :</Text>
                <View contentContainerStyle={styles.menuContainer}>
                    {menu && menu.map((menuItem, index) => (
                        <View key={index} style={styles.menuItem}>
                            <Text style={styles.menuText}>{menuItem}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    menuItem: {
        backgroundColor: '#E8F5E9',
        borderRadius: 20,
        borderColor:"black",
        borderWidth:0.25,
        padding: 15,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center'
    },
    menuText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        fontWeight:"500",
    }
});

export default DetailedMessMenu;