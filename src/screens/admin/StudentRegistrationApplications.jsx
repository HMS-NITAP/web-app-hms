import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentRegistrationApplications } from '../../services/operations/AdminAPI';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ApplicationCard from '../../components/Admin/ApplicationCard';

const StudentRegistrationApplications = ({navigation}) => {
    const [applications,setApplications] = useState([]);
    const [loading,setLoading] = useState(false);

    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();
    const dispatch = useDispatch();

    const fetchData = async() => {
        const response = await dispatch(fetchStudentRegistrationApplications(token,toast));
        setApplications(response);
        setLoading(false);
    }

    useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [token,toast])
    );

    return (
        <>
            {
                loading ? "" : 
                    <ScrollView contentContainerStyle={{width:"100%",display:"flex",justifyContent:"center", alignItems:"center", paddingHorizontal:15, paddingVertical:10}}>
                        {
                            applications && 
                                <View style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:15, paddingVertical:15}}>
                                    <View style={{display:"flex",flexDirection:"row",gap:15,justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{fontWeight:"600",color:"black",fontSize:16}}>Pending Applications</Text>
                                        <Text style={{paddingVertical:5, paddingHorizontal:10, backgroundColor:"#9c89b8", color:"white", fontWeight:"800", borderRadius:100}}>{applications.length}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.navigate("Freezed Applications")}><Icon name="lock" color="grey" size={25} /></TouchableOpacity>
                                </View>
                        }
                        <View style={{width:"100%",display:"flex",justifyContent:"center", alignItems:"center", gap:10}}>
                            {
                              applications && applications.map((application,index) => (
                                <ApplicationCard key={index} application={application} toast={toast} token={token} fetchData={fetchData} />
                              ))  
                            }
                        </View>
                    </ScrollView>
            }
        </>
      )
}

export default StudentRegistrationApplications