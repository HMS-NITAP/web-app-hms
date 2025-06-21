import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../services/operations/OfficialAPI';

const OfficialDashboard = () => {
    
    const [dashboardData, setDashboardData] = useState(null); 
    
    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();

    const  dispatch = useDispatch();

    const fetchData = async() => {
        const response = await dispatch(fetchDashboardData(token,toast));
        setDashboardData(response);
    }

    useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [token,toast])
    );

    return (
        
            !dashboardData ? (<View style={{marginTop:30, marginHorizontal:"auto"}}><Text style={{color:"black", textAlign:"center", fontSize:18, fontWeight:"700"}}>Please Wait...</Text></View>) : (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.card}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{dashboardData?.official?.name}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{dashboardData?.email}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Gender:</Text>
                        <Text style={styles.value}>{dashboardData?.official?.gender==="M" ? "Male" : "Female"}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Phone:</Text>
                        <Text style={styles.value}>{dashboardData?.official?.phone}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Designation:</Text>
                        <Text style={styles.value}>{dashboardData?.official?.designation}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Hostel Block:</Text>
                        <Text style={[styles.value, dashboardData?.official?.hostelBlock ? styles.blockName : styles.noBlockAssigned]}>
                        {dashboardData?.official?.hostelBlock?.name || "NO HOSTEL BLOCK ASSIGNED"}
                        </Text>
                    </View>
                </ScrollView>
            )
        
      );
}

export default OfficialDashboard

const styles = StyleSheet.create({
    container: {
      width:"100%",
      display:"flex",
      flexDirection:"column",
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical:20,
    },
    card: {
      width: '95%',
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#aed581', 
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    label: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#388e3c', 
    },
    value: {
      fontSize: 16,
      marginLeft: 10,
      color:"black",
      fontWeight:"500",
    },
    blockName: {
      color: '#38b000', 
      fontWeight:"600",
      fontSize:16,
    },
    noBlockAssigned: {
      color: 'red',
      fontWeight:"600",
      fontSize:14
    },
  });