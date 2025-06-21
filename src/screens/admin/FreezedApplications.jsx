import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFreezedStudentRegistrationApplications } from '../../services/operations/AdminAPI';
import ApplicationCard from '../../components/Admin/ApplicationCard';
import Icon from 'react-native-vector-icons/FontAwesome6';
import FreezeApplicationCard from '../../components/Admin/FreezeApplicationCard';

const FreezedApplications = () => {

    const [applications,setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();
    const dispatch = useDispatch();

    const fetchData = async() => {
        const response = await dispatch(fetchFreezedStudentRegistrationApplications(token,toast));
        setApplications(response);
        setLoading(false);
    }

    useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [token,toast])
    );

    const searchRollNumber = () => {
      if (applications) {
        if (searchQuery === "") {
          fetchData();
          return;
        }
    
        const index = applications.findIndex((application) => application?.instituteStudent?.rollNo === searchQuery);
    
        if(index !== -1){
          const applicationToMove = applications[index];
          const remainingApplications = applications.filter((_, i) => i !== index);
    
          const newApplications = [applicationToMove, ...remainingApplications];
          setApplications(newApplications);
        }
      }
    };

  return (
    <>
            {
                loading ? "" : 
                    <ScrollView contentContainerStyle={{width:"100%",display:"flex",justifyContent:"center", alignItems:"center", paddingHorizontal:15, paddingVertical:10}}>
                        {
                            applications && 
                                <View style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", paddingHorizontal:15, paddingVertical:15, gap:15}}>

                                    <View style={{display:"flex",flexDirection:"row",gap:15,justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{fontWeight:"600",color:"black",fontSize:16}}>Freezed Applications</Text>
                                        <Text style={{paddingVertical:5, paddingHorizontal:10, backgroundColor:"#9c89b8", color:"white", fontWeight:"800", borderRadius:100}}>{applications.length}</Text>
                                    </View>

                                    <View style={styles.subFormView}>
                                      <TextInput
                                        style={styles.input}
                                        placeholder="Search with Roll No"
                                        placeholderTextColor={"#adb5bd"}
                                        onChangeText={(e) => setSearchQuery(e)}   
                                      />
                                      <TouchableOpacity onPress={searchRollNumber} style={{padding:10, borderColor:"black", borderWidth:1, borderRadius:100, borderStyle:"dotted"}}><Icon name="magnifying-glass" color="grey" size={25} /></TouchableOpacity>
                                    </View>
                                </View>
                        }
                        <View style={{width:"100%",display:"flex",justifyContent:"center", alignItems:"center", gap:10}}>
                            {
                              applications && applications.map((application,index) => (
                                <FreezeApplicationCard key={index} application={application} toast={toast} token={token} fetchData={fetchData} />
                              ))  
                            }
                        </View>
                    </ScrollView>
            }
        </>
  )
}

export default FreezedApplications

const styles = StyleSheet.create({
  subFormView: {
    width:"100%",
    display: 'flex',
    flexDirection:"row",
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    width:"80%",
    padding: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#adb5bd",
    color: "black",
  },
})