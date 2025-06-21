import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView,Text, View, TouchableOpacity, Linking } from 'react-native'
import { useDispatch,useSelector } from 'react-redux'
import { getAllStudentHostelComplaint } from '../../services/operations/StudentAPI';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';

const RegisterComplaints = () => {

    const dispatch = useDispatch();
    
    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();
    const [complaintsRegistered,setComplaintsRegistered] = useState([]);

    const fetchData = async () => {
        setComplaintsRegistered(null);
        const data = await dispatch(getAllStudentHostelComplaint(token,toast));
        setComplaintsRegistered(data);
    }

    useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [token, toast])
      );

    const getDateFormat = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleString();
    }

    return (
        <ScrollView contentContainerStyle={{width:"100%", paddingHorizontal:10,paddingVertical:10,justifyContent:'start',alignItems:"center"}}>
            {
                complaintsRegistered && 
                    <View style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", paddingHorizontal:15, paddingVertical:15}}>
                        <View style={{display:"flex",flexDirection:"row",gap:15,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{fontWeight:"600",color:"black",fontSize:16}}>Total Complaints Registered</Text>
                            <Text style={{paddingVertical:5, paddingHorizontal:10, backgroundColor:"#9c89b8", color:"white", fontWeight:"800", borderRadius:100}}>{complaintsRegistered.length}</Text>
                        </View>
                    </View>
            }
            {
                complaintsRegistered && complaintsRegistered.map((complaint) => {
                    return (
                        <View key={complaint?.id} style={{width:"100%",padding: 15,marginVertical: 8,backgroundColor: '#f9f9f9',borderRadius: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 8,elevation: 2,width: '95%'}}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Registered On : <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(complaint.createdAt)}</Text>
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Category : <Text style={{ fontWeight: 'normal', color: '#666' }}>{complaint.category}</Text>
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                About : <Text style={{ fontWeight: 'normal', color: '#666' }}>{complaint.about}</Text>
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Status: <Text style={{ fontWeight: '800', color: complaint?.status==="RESOLVED" ? "green" : "red"}}>{complaint.status==="RESOLVED" ? "RESOLVED" : "IN REVIEW"}</Text>
                            </Text>
                            {
                                complaint?.fileUrl[0] && 
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Attachments : <Text style={{ fontWeight: 'normal', color: 'blue' }} onPress={() => Linking.openURL(complaint?.fileUrl[0])}>Click Here to See</Text></Text>
                            }
                            {
                                complaint?.resolvedOn && <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Resolved On : <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(complaint?.resolvedOn)}</Text></Text>
                            }
                            {
                                complaint?.resolvedById && <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Resolved By : <Text style={{ fontWeight: 'normal', color: '#666' }}>{complaint?.resolvedBy?.name} ({complaint?.resolvedBy?.designation})</Text></Text>
                            }
                        </View>
                    )
                })
            }
    </ScrollView>
    )
}

export default RegisterComplaints