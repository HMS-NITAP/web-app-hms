import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView,Text, View, TouchableOpacity } from 'react-native'
import { useDispatch,useSelector } from 'react-redux'
import { getStudentAllOutingApplication } from '../../services/operations/StudentAPI';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';
import OutingApplicationCard from '../../components/student/OutingApplicationCard';

const ApplicationHistory = () => {

    const dispatch = useDispatch();
    
    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();
    const [outingApplication,setOutingApplication] = useState([]);

    const fetchData = async () => {
        setOutingApplication(null);
        const data = await dispatch(getStudentAllOutingApplication(token,toast));
        setOutingApplication(data);
    }

    useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [token, toast])
      );

    return (
        <ScrollView contentContainerStyle={{width:"100%", paddingHorizontal:10,paddingVertical:10,justifyContent:'start',alignItems:"center"}}>
            {
                !outingApplication ? (<Text style={{textAlign:"center", color:"black", fontSize:16, fontWeight:"700"}}>Please Wait...</Text>) : (
                    <View style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:20}}>
                        <View style={{display:"flex",flexDirection:"row",gap:15,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{fontWeight:"600",color:"black",fontSize:16}}>Total Applications</Text>
                            <Text style={{paddingVertical:5, paddingHorizontal:10, backgroundColor:"#9c89b8", color:"white", fontWeight:"800", borderRadius:100}}>{outingApplication.length}</Text>
                        </View>
                        <View style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:15, elevation:10}}>
                            {
                                outingApplication.map((application,index) => (
                                    <OutingApplicationCard key={index} application={application} toast={toast} token={token} fetchData={fetchData} />
                                ))
                            }
                        </View>
                    </View>
                )
            }
        </ScrollView>
        
    )
}

export default ApplicationHistory