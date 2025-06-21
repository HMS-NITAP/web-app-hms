import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHostelBlocksData } from '../../services/operations/AdminAPI';
import Icon from 'react-native-vector-icons/FontAwesome6';
import HostelCard from '../../components/Admin/HostelCard';

const ManageHostels = ({navigation}) => {

    const [accounts,setAccounts] = useState([]);
    const [loading,setLoading] = useState(false);

    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();
    const dispatch = useDispatch();

    const fetchData = async() => {
        const response = await dispatch(fetchAllHostelBlocksData(token,toast));
        setAccounts(response);
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
                        <View style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:15, paddingVertical:15}}>
                            <View style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontWeight:"600",color:"black",fontSize:15}}>Total Hostel Blocks</Text>
                                {
                                    accounts && <Text style={{paddingVertical:5, paddingHorizontal:10, backgroundColor:"#9c89b8", color:"white", fontWeight:"800", borderRadius:100}}>{accounts.length}</Text>
                                }
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate("Create Hostel Block")} style={{paddingHorizontal:10, paddingVertical:10, borderRadius:10, borderColor:"black", borderWidth:0.5, backgroundColor:"#023e8a"}}>
                                <Icon name='house-medical' size={25} color='white' />
                            </TouchableOpacity>
                        </View>
                        <View style={{width:"100%",display:"flex",justifyContent:"center", alignItems:"center", gap:10}}>
                            {
                                accounts && accounts.map((account,index) => (
                                    <HostelCard key={index} data={account} token={token} toast={toast} fetchData={fetchData} />
                                ))
                            }
                        </View>
                    </ScrollView>
            }
        </>
      )
}

export default ManageHostels