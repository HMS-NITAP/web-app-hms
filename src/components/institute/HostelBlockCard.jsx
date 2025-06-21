import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, Linking, ScrollView, Platform } from 'react-native';

const HostelBlockCard = ({ data }) => {
    const [isTextActive, setIsTextActive] = useState(false);
    const animatedValue = useState(new Animated.Value(0))[0];

    const handleAnimationView = () => {
        setIsTextActive(!isTextActive);
        Animated.timing(animatedValue, {
            toValue: isTextActive ? 0 : 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    const styles = StyleSheet.create({
        card: {
            width: "100%",
            height: 400,
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
        },
        image: {
            width: "100%",
            height: 220,
            borderRadius: 10,
            resizeMode: 'cover',
            zIndex: 1,
        },
        textContainer1: {
            width: "100%",
            paddingHorizontal: 15,
            paddingVertical: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 1,
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
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            zIndex: 10,
            gap: 30,
            height: 380,
            transform: [
                {
                    translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [380, 0]
                    })
                }
            ],
        },
        name: {
            color: 'black',
            fontSize: 20,
            fontWeight: "800",
        },
        scrollViewContent: {
            flexGrow: 1,
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
        },
        knowMoreText: {
            textAlign: 'right',
            fontWeight: '700',
        },
    });

    return (
        <View style={styles.card}>
            <Image style={styles.image} source={data?.image} />
            <View style={styles.textContainer1}>
                <View style={{ gap: 1 }}>
                    <Text style={styles.name}>{data?.blockName}</Text>
                    <Text style={{ color: "black", fontWeight: "400" }}>Room Type: <Text style={{ color: "black", fontWeight: "400" }}>{data?.roomType}</Text></Text>
                    <Text style={{ color: "black", fontWeight: "400" }}>Capacity: <Text style={{ color: "black", fontWeight: "400" }}>{data?.capacity}</Text></Text>
                </View>
                <TouchableOpacity onPress={handleAnimationView}><Text style={styles.knowMoreText}>Know More...</Text></TouchableOpacity>
            </View>
            <Animated.View style={styles.textContainer2}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
                    <View style={{ gap: 50 }}>
                        <View style={{ gap: 1 }}>
                            <Text style={styles.name}>{data?.blockName}</Text>
                            <Text style={{ color: "black", fontWeight: "400" }}>Room Type: <Text style={{ color: "black", fontWeight: "400" }}>{data?.roomType}</Text></Text>
                            <Text style={{ color: "black", fontWeight: "400" }}>Capacity: <Text style={{ color: "black", fontWeight: "400" }}>{data?.capacity}</Text></Text>
                        </View>
                        <View style={{ gap: 15, width: "100%" }}>
                            <Text style={{ fontSize: 16, fontWeight: 700, color: 'black' }}>Warden Contact:</Text>
                            <View style={{ gap: 5, width: "100%" }}>
                                <Text style={styles.caption}>{data?.wardenName}</Text>
                                <Text style={{ color: "black", fontWeight: "400" }}>Phone: <Text style={styles.values} onPress={() => (Linking.openURL(`tel:${data?.wardenPhone}`))}>{data?.wardenPhone}</Text></Text>
                                <Text style={{ color: "black", fontWeight: "400" }}>Email: <Text style={styles.values} onPress={() => (Linking.openURL(`mailto:${data?.wardenEmail}`))}>{data?.wardenEmail}</Text></Text>
                                {data?.linkedIn ? (<Text style={{ color: "black", fontWeight: "400" }}>LinkedIn: <Text style={styles.values} onPress={() => (Linking.openURL(`${data?.linkedIn}`))}>{data?.linkedIn}</Text></Text>) : (<Text />)}
                            </View>
                        </View>
                        <View style={{ gap: 15, width: "100%" }}>
                            <Text style={{ fontSize: 16, fontWeight: 700, color: 'black' }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet 
                                ultricies felis, sit amet commodo orci. Suspendisse potenti. Sed venenatis ligula 
                                eu nisl convallis, vitae euismod odio accumsan. Donec eget dignissim purus. Cras 
                                tincidunt metus et risus dictum, ut hendrerit sapien pharetra. Nullam auctor lectus 
                                ac arcu gravida, nec elementum lacus posuere. Nam vehicula lacus et ligula interdum, 
                                et posuere nunc luctus. Integer vulputate ligula nec velit ultricies, id viverra 
                                tortor volutpat. Aliquam erat volutpat. Phasellus dapibus justo non dui volutpat, 
                                nec fermentum lacus cursus. Ut a sagittis est. Vivamus et ipsum felis. Morbi vitae 
                                ante sit amet leo cursus pretium a ut nisl.
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{ textAlign: 'right', fontWeight: '700' }} onPress={handleAnimationView}><Text>Know Less...</Text></TouchableOpacity>
                </ScrollView>
            </Animated.View>
        </View>
    );
}

export default HostelBlockCard;
