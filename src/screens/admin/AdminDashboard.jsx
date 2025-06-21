import React, { useCallback, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardData } from '../../services/operations/AdminAPI';
import { useFocusEffect } from '@react-navigation/native';

const AdminDashboard = ({navigation}) => {

    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();

    const [dashboardData, setDashboardData] = useState(null);

    const fetchData = async() => {
        setDashboardData(null);
        const response = await dispatch(fetchDashboardData(token,toast));
        setDashboardData(response);
    }

    useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [token,toast])
    );

    const moveToBlock = (hostelBlockId,hostelBlockName,floors) => {
        const floorCount = parseInt(floors);
        navigation.navigate("Block Rooms",{hostelBlockId,hostelBlockName,floorCount});
    }

  return (
    <ScrollView contentContainerStyle={{width:"100%", display:"flex", flexDirection:"column", padding:15, justifyContent:"center", alignItems:"center", gap:20}}>
        {
            dashboardData && (
                <View style={{width:"100%", marginHorizontal:"auto", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:20}}>
                    <View style={{width:"100%", marginHorizontal:"auto", padding:10, borderWidth:1, borderColor:"black", borderRadius:15, backgroundColor:"white", borderStyle:"dashed"}}>
                        <Text style={{textAlign:"center", color:"black", fontSize:18, fontWeight:"700", marginBottom:10}}>OVERALL DATA</Text>

                        <Text style={{color:"black",fontSize:15, fontWeight:"600"}}>Total Registrations : <Text>{dashboardData?.activeStudentsCount + dashboardData?.freezedStudentsCount + dashboardData?.inactiveStudentsCount}</Text></Text>
                        <Text style={{color:"black",fontSize:15, fontWeight:"600"}}>Completed Registrations : <Text>{dashboardData?.activeStudentsCount}</Text></Text>
                        <Text style={{color:"black",fontSize:15, fontWeight:"600"}}>Freezed Registrations : <Text>{dashboardData?.freezedStudentsCount}</Text></Text>
                        <Text style={{color:"black",fontSize:15, fontWeight:"600"}}>Pending Registrations : <Text>{dashboardData?.inactiveStudentsCount}</Text></Text>

                        <Text style={{color:"black",fontSize:15, fontWeight:"600", marginTop:10}}>Total Cots : <Text>{dashboardData?.overallAvailableCots + dashboardData?.overallBlockedCots + dashboardData?.overallBookedCots}</Text></Text>
                        <Text style={{color:"black",fontSize:15, fontWeight:"600"}}>Available Cots : <Text>{dashboardData?.overallAvailableCots}</Text></Text>
                        <Text style={{color:"black",fontSize:15, fontWeight:"600"}}>Blocked Cots : <Text>{dashboardData?.overallBlockedCots}</Text></Text>
                        <Text style={{color:"black",fontSize:15, fontWeight:"600"}}>Booked Cots : <Text>{dashboardData?.overallBookedCots}</Text></Text>
                    </View>

                    <Text style={{textAlign:"center", fontSize:20, fontWeight:800, color:"#6c757d"}}>HOSTEL BLOCKS</Text>

                    <View style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:15}}>
                        {
                            dashboardData?.formattedResult?.map((data,index) => (
                                <TouchableOpacity onPress={() => moveToBlock(data?.blockId,data?.blockName,data?.floorCount)} key={index} style={{width:"100%", display:"flex", flexDirection:"column", padding:10, borderColor:"black", borderRadius:15, borderWidth:1}}>
                                    <Text style={{textAlign:"center", fontWeight:"700", color:"black", fontSize:20}}>{data?.blockName}</Text>
                                    <View style={{display:"flex", flexDirection:"column", justifyContent:"flex-start", gap:5, marginTop:10}}>
                                        <Text style={{textAlign:"center", fontWeight:"700", color:"black", fontSize:15}}>Total Rooms: {data?.totalRooms}</Text>
                                        <Text style={{textAlign:"center", fontWeight:"700", color:"black", fontSize:15}}>Total Cots: {data?.totalCots}</Text>
                                        <Text style={{textAlign:"center", fontWeight:"700", color:"black", fontSize:15}}>Available Cots: {data?.availableCots}</Text>
                                        <Text style={{textAlign:"center", fontWeight:"700", color:"black", fontSize:15}}>Blocked Cots: {data?.blockedCots}</Text>
                                        <Text style={{textAlign:"center", fontWeight:"700", color:"black", fontSize:15}}>Booked Cots: {data?.bookedCots}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            )
        }
    </ScrollView>
  )
}

export default AdminDashboard