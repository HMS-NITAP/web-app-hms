import { useFocusEffect, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { fetchCotsInRooms } from '../../services/operations/AdminAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';

const CotDetails = () => {

    const [cotDetails, setCotDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const route = useRoute();
    const {roomId} = route.params;

    const dispatch = useDispatch();
    const toast = useToast();
    const {token} = useSelector((state) => state.Auth);


    const fetchData = async() => {
        if(roomId){
            setCotDetails(null);
            const response = await dispatch(fetchCotsInRooms(roomId,token,toast));
            setCotDetails(response);
        }
    }

    useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [roomId,token,toast])
    );

  return (
    <ScrollView contentContainerStyle={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", paddingVertical:20}}>
        {
            cotDetails && (
                <View style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:5}}>
                    <Text style={{color:"black", fontWeight:"700", fontSize:22, textAlign:"center"}}>Room - {cotDetails?.roomNumber}</Text>
                    <Text style={{color:"black", fontWeight:"400", fontSize:18, textAlign:"center"}}>Floor - {cotDetails?.floorNumber}</Text>
                    <View style={{width:"90%", marginHorizontal:"auto", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:15, marginVertical:15}}>
                        {
                            cotDetails!==null && cotDetails?.cots?.map((cot,index) => (
                                <View key={index} style={{width:"100%"}}>
                                    {
                                        cot?.status==="AVAILABLE" ? (
                                            <View style={{width:"100%", borderWidth:1, borderColor:"black", borderStyle:"dashed", borderRadius:10, padding:10}}>
                                                <Text style={{width:"100%", color:"black", fontSize:18, fontWeight:"500", textAlign:"center"}}>Cot No : <Text style={{color:"#495057"}}>{cot?.cotNo} (<Text>{cot?.status}</Text>)</Text></Text>
                                            </View>
                                        ) 
                                            : 
                                        (
                                            <View style={{width:"100%", borderWidth:1, borderColor:"black", borderStyle:"dashed", borderRadius:10, padding:10}}>
                                                <Text style={{width:"100%", color:"black", fontSize:18, fontWeight:"500", textAlign:"center"}}>Cot No : <Text style={{color:"#495057"}}>{cot?.cotNo} (<Text>{cot?.status}</Text>)</Text></Text>
                                                <View style={{alignItems: 'center',marginVertical: 20}}>
                                                    {isLoading && (
                                                        <ActivityIndicator size="large" color="#0000ff" />
                                                    )}
                                                    <Image 
                                                        source={{ uri: cot?.student?.image }} 
                                                        style={{width: 100,height: 100, borderRadius: 50, marginBottom: 10}} 
                                                        onLoadStart={() => setIsLoading(true)}
                                                        onLoad={() => setIsLoading(false)}
                                                    />
                                                    <Text style={{color:"black", fontSize:16, fontWeight:"500"}}>Name : <Text style={{color:"#495057"}}>{cot?.student?.name}</Text></Text>
                                                </View>
                                                <Text style={{color:"black", fontSize:15, fontWeight:"500"}}>Reg No : <Text style={{color:"#495057"}}>{cot?.student?.regNo}</Text></Text>
                                                <Text style={{color:"black", fontSize:15, fontWeight:"500"}}>Roll No : <Text style={{color:"#495057"}}>{cot?.student?.rollNo}</Text></Text>
                                                <Text style={{color:"black", fontSize:15, fontWeight:"500"}}>Gender : <Text style={{color:"#495057"}}>{cot?.student?.gender==="M" ? "Male" : "Female"}</Text></Text>
                                                <Text style={{color:"black", fontSize:15, fontWeight:"500"}}>DOB : <Text style={{color:"#495057"}}>{cot?.student?.dob}</Text></Text>
                                                <Text style={{color:"black", fontSize:15, fontWeight:"500"}}>Year : <Text style={{color:"#495057"}}>{cot?.student?.year}</Text></Text>
                                                <Text style={{color:"black", fontSize:15, fontWeight:"500"}}>Branch : <Text style={{color:"#495057"}}>{cot?.student?.branch}</Text></Text>
                                                <Text style={{color:"black", fontSize:15, fontWeight:"500"}}>Aadhaar Number : <Text style={{color:"#495057"}}>{cot?.student?.aadhaarNumber}</Text></Text>
                                                <Text style={{color:"black", fontSize:15, fontWeight:"500"}}>Contact No : <Text style={{color:"#495057"}}>{cot?.student?.phone}</Text></Text>
                                                <Text style={{color:"black", fontSize:15, fontWeight:"500"}}>Address : <Text style={{color:"#495057"}}>{cot?.student?.address}</Text></Text>
                                                <Text style={{color:"black", fontSize:15, fontWeight:"500", marginTop:10, display:"flex", alignItems:"center"}}>Fee Receipt : <TouchableOpacity onPress={() => Linking.openURL(cot?.student?.hostelFeeReceipt)} style={{display:"flex", alignItems:"center"}}><Text style={{color:"blue", fontWeight:600}}>CLICK HERE</Text></TouchableOpacity></Text>
                                            </View>
                                        )
                                    }
                                </View>
                            ))
                        }
                    </View>
                </View>
            )
        }
    </ScrollView>
  )
}

export default CotDetails