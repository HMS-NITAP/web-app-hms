import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react'
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentMessReceipts } from '../../services/operations/StudentAPI';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';

const MessReceiptsHistory = () => {

    const [receipts, setReceipts] = useState(null);
    const [dateFormat, setDateFormat] = useState(null);
    
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();

    const findDate = () => {
      const now = new Date();
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };
      setDateFormat(now.toLocaleDateString('en-CA', options).split('-').reverse().join('-'));
    }

    const fetchData = async() => {
        const response = await dispatch(fetchStudentMessReceipts(token,toast));
        setReceipts(response);
    }

    useFocusEffect(
        useCallback(() => {
          findDate();
          fetchData();
        }, [token,toast])
      );

  return (
    <ScrollView contentContainerStyle={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", paddingVertical:15, paddingHorizontal:15, width:"100%"}}>
      <Text style={{textAlign:"center", fontWeight:"600", fontSize:18, color:"black"}}>Today's Mess receipts</Text>
      <View style={{width:"100%", gap:10, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", marginTop:20}}>
        {
          receipts && (
            receipts.map((receipt,index) => (
              <View key={index} style={{width:"100%",borderColor:"black", borderWidth:1, borderRadius:10, padding:15}}>
                <Text style={{fontSize:18,fontWeight:'500',color:'#000000'}}>Date: <Text style={{fontWeight:"600", color:"black"}}> {dateFormat}</Text></Text>
                <Text style={{fontSize:18,fontWeight:'500',color:'#000000'}}>Session: <Text style={{fontWeight:"600", color:"black"}}> {Object.keys(receipt)[0]}</Text></Text>
                <Text style={{fontSize:18,fontWeight:'500',color:'#000000'}}>Date: <Text style={{fontWeight:"600", color:"black"}}> {receipt[Object.keys(receipt)[0]]?.messHallName}</Text></Text>
              </View>
            ))
          )
        }
      </View>
    </ScrollView>
  )
}

export default MessReceiptsHistory