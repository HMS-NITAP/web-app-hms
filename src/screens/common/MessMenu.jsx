import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchCurrentSessionMessMenu } from '../../services/operations/CommonAPI';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';

const getCurrentSession = () => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 0 && currentHour < 10) {
        return 'Breakfast';
    } else if (currentHour >= 10 && currentHour < 15) {
        return 'Lunch';
    } else if (currentHour >= 15 && currentHour < 18) {
        return 'Snacks';
    }else {
        return 'Dinner';
    }
};

const MessMenu = ({ navigation }) => {
    const [currentDay, setCurrentDay] = useState('');
    const [currentSession, setCurrentSession] = useState('');
    const [currentItems, setCurrentItems] = useState([]);

    const dispatch = useDispatch();
    const toast = useToast();

    const fetchData = async() => {
        const response = await dispatch(fetchCurrentSessionMessMenu(currentDay,currentSession,toast));
        setCurrentItems(response);
    }

    useFocusEffect(
        useCallback(() => {
            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = days[now.getDay()];
            const session = getCurrentSession();
    
            setCurrentDay(currentDayName);
            setCurrentSession(session);
        },[toast])
    );

    useEffect(() => {
        if(currentDay && currentSession){
            fetchData();
        }
    },[currentDay, currentSession]);

    

    const navigateToMenu = () => {
        navigation.navigate('Detailed Mess Menu');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Today's Menu</Text>
            <Text style={styles.subheader}>{currentDay}</Text>
            <Text style={styles.subheader}>{currentSession.charAt(0).toUpperCase() + currentSession.slice(1)}</Text>
            {
                currentItems && (
                    <View style={styles.itemsContainer}>
                        {currentItems.map((item, index) => (
                            <View key={index} style={styles.item}>
                                <Text style={styles.itemText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                )
            }
            <TouchableOpacity style={styles.button} onPress={navigateToMenu}>
                <Text style={styles.buttonText}>View Full Menu</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'justify-center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        paddingVertical : 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color:"black",
    },
    subheader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color:"#495057"
    },
    itemsContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'flex-start'
    },
    item: {
        backgroundColor: '#E8F5E9',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        width: '100%'
    },
    itemText: {
        fontSize: 16,
        color:"#495057",
    },
    button: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default MessMenu;