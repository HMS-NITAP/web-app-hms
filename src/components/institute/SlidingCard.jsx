import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, Linking, ScrollView } from 'react-native';

const SlidingCard = ({ data }) => {
    const [isTextActive, setIsTextActive] = useState(false);
    const animatedValue = useState(new Animated.Value(0))[0];

    const handleAnimationView = () => {
        setIsTextActive(!isTextActive);
        Animated.timing(animatedValue, {
            toValue: isTextActive ? 0 : 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const styles = StyleSheet.create({
        card: {
            width: "90%",
            height: isTextActive ? 'auto' : 400, 
            borderColor: "black",
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: "#fff",
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
            alignSelf: 'center',
            marginVertical: 20,
        },
        image: {
            width: "100%",
            height: 220,
            borderRadius: 10,
            resizeMode: 'stretch',
        },
        textContainer1: {
            width: "100%",
            paddingHorizontal: 15,
            paddingVertical: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 25,
        },
        textContainer2: {
            position: 'absolute',
            backgroundColor: "white",
            width: '100%',
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 30,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
            gap: 30,
            maxHeight: 400,
        },
        name: {
            color: 'black',
            fontSize: 20,
            fontWeight: "800",
        },
        caption: {
            color: "#343a40",
            fontSize: 14,
            fontWeight: "500",
        },
        values: {
            color: "#4361ee",
            fontSize: 14,
            fontWeight: "500",
        }
    });

    const cardAnimation = {
        transform: [
            {
                translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [400, 0]
                })
            }
        ]
    };

    return (
        <Animated.View style={styles.card}>
            <Image style={styles.image} source={data?.image} />
            <View style={styles.textContainer1}>
                <View>
                    <Text style={styles.name}>{data?.name}</Text>
                    <Text style={styles.caption}>{data?.designation}</Text>
                </View>
                <TouchableOpacity onPress={handleAnimationView}>
                    <Text style={{ textAlign: 'right', fontWeight: '700' }}>Know More...</Text>
                </TouchableOpacity>
            </View>
            <Animated.ScrollView style={[styles.textContainer2, cardAnimation]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ display: 'flex', height: '100%' }}>
                    <View style={{ gap: 50 }}>
                        <View>
                            <Text style={styles.name}>{data?.name}</Text>
                            <Text style={styles.caption}>{data?.designation}</Text>
                        </View>
                        <View style={{ gap: 15, width: "100%" }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: 'black' }}>Contact Details :</Text>
                            <View style={{ gap: 5, width: "100%" }}>
                                <Text style={{ color: "black", fontWeight: "400" }}>Phone: <Text style={styles.values} onPress={() => (Linking.openURL(`tel:${data?.phone}`))}>{data?.phone}</Text></Text>
                                <Text style={{ color: "black", fontWeight: "400" }}>Email: <Text style={styles.values} onPress={() => (Linking.openURL(`mailto:${data?.email}`))}>{data?.email}</Text></Text>
                                {data?.linkedIn && <Text style={{ color: "black", fontWeight: "400" }}>LinkedIn: <Text style={styles.values} onPress={() => (Linking.openURL(`${data?.linkedIn}`))}>{data?.linkedIn}</Text></Text>}
                            </View>
                        </View>
                    </View>
                    <Text style={{ textAlign: 'right', fontWeight: '700' }} onPress={handleAnimationView}>Know Less...</Text>
                </ScrollView>
            </Animated.ScrollView>
        </Animated.View>
    );
};

export default SlidingCard;
