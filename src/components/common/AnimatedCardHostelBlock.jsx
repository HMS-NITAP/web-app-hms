import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, ScrollView, Linking, Platform, ActivityIndicator } from 'react-native';

const AnimatedCardHostelBlock = ({ data }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
                <View style={styles.imageContainer}>
                    {isLoading && (
                        <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator} />
                    )}
                    <Image 
                        source={{ uri: data.image }} 
                        style={styles.image} 
                        onLoadStart={() => setIsLoading(true)}
                        onLoad={() => setIsLoading(false)}
                    />
                </View>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.name}>Name : <Text style={{color:"black"}}>{data.name}</Text></Text>
                    <Text style={styles.designation}>Room Type : <Text style={{color:"black"}}>{data.roomType}</Text></Text>
                </View>
            </View>
            {isExpanded && (
                <ScrollView contentContainerStyle={styles.details}>
                    <Text style={{fontSize:16, fontWeight:"700", color:"#051923"}}>Capacity : <Text style={{fontSize:16, fontWeight:"700", color:"#051923"}}>{data?.capacity} students</Text></Text>
                    <Text style={{fontSize:16, fontWeight:"700", color:"#051923"}}>Floor Count : <Text style={{fontSize:16, fontWeight:"700", color:"#051923"}}>{data?.floorCount === "2" ? "G+2" : "G+4"}</Text></Text>
                    <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Year Assigned to : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.year}</Text></Text>
                    {
                        data?.wardens.length === 0 ? <View style={{width:"100%", justifyContent:"center"}}><Text style={{textAlign:"center", fontWeight:"700", fontSize:15, color:"#c1121f"}}>No Warden Assigned</Text></View>
                            :
                            <View style={{marginTop:10}}>
                                <Text style={{fontSize:17, fontWeight:"800", color:"#14213d", marginBottom:5}}>Warden(s) :</Text>
                                {
                                    data?.wardens.map((warden,index) => (
                                    <Text style={{fontSize:16, fontWeight:"700",color:"#003554"}} selectable={true}>{index+1}) {warden.name}    ( +91 {warden.phone} )</Text>
                                    ))
                                }
                                <Text style={{fontSize:17, fontWeight:"800", color:"#14213d", marginBottom:5}}>Warden(s) :</Text>
                                <Text style={{fontSize:17, fontWeight:"800", color:"#14213d", marginBottom:5}}>Warden(s) :</Text>
                                <Text style={{fontSize:17, fontWeight:"800", color:"#14213d", marginBottom:5}}>Warden(s) :</Text>
                                <Text style={{fontSize:17, fontWeight:"800", color:"#14213d", marginBottom:5}}>Warden(s) :</Text>
                            </View>
                    }
                </ScrollView>
            )}
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
        gap:10,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
    },
    loadingIndicator: {
        position: 'absolute',
        zIndex: 1,
    },
    headerTextContainer: {
        flexDirection: 'column',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'gray',
    },
    designation: {
        fontSize: 14,
        color: 'gray',
        fontWeight:"600",
    },
    details: {
        paddingHorizontal: 10,
        flexGrow: 1,
        paddingVertical: 20,
    },
    detailText: {
        fontSize: 14,
        marginVertical: 5,
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

export default AnimatedCardHostelBlock;
