import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, ScrollView, Linking, Platform } from 'react-native';

const AnimatedCardMessFeedback = ({ data }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const animatedHeight = useState(new Animated.Value(140))[0];

    const toggleCard = () => {
        setIsExpanded(!isExpanded);
        Animated.timing(animatedHeight, {
            toValue: isExpanded ? 140 : 300,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    return (
        <Animated.View style={[styles.card, { height: animatedHeight }]}>
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.name}>{data.name}</Text>
                    <Text style={styles.designation}>{data.designation}</Text>
                </View>
            </View>
            {
                isExpanded && 
                <ScrollView contentContainerStyle={styles.details}>
                    <Text style={styles.detailText}>Full Name: {data.name}</Text>
                    <Text style={styles.detailText}>Email: <Text style={styles.link} onPress={() => Linking.openURL(`mailto:${data.email}`)}>{data.email}</Text></Text>
                    <Text style={styles.detailText}>Phone: <Text style={styles.link} onPress={() => Linking.openURL(`tel:${data.phone}`)}>{data.phone}</Text></Text>
                    {
                        data.linkedIn && <Text style={styles.detailText}>LinkedIn: <Text style={styles.link} onPress={() => Linking.openURL(data.linkedIn)}>{data.linkedIn}</Text></Text>
                    }
                    <Text style={styles.detailText}>About: {data.about}</Text>
                </ScrollView>
            }
            <Animated.View style={styles.moreInfoButtonContainer}>
                <TouchableOpacity style={styles.moreInfoButton} onPress={toggleCard}>
                    <Text style={styles.moreInfoButtonText}>{isExpanded ? 'Hide Info' : 'More Info'}</Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginVertical: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 1000,
        marginRight: 10,
    },
    headerTextContainer: {
        flexDirection: 'column',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    designation: {
        fontSize: 14,
        color: 'gray',
    },
    details: {
        paddingHorizontal: 10,
        flexGrow: 1,
        paddingVertical:20,
    },
    detailText: {
        fontSize: 14,
        marginVertical: 5,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    moreInfoButtonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    moreInfoButton: {
        padding: 10,
        backgroundColor: '#415a77',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    moreInfoButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default AnimatedCardMessFeedback;
