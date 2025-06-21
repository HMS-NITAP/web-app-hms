import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentDateRatingsAndReviews, fetchMessAndFeedBackData } from '../../services/operations/CommonAPI';
import { useToast } from 'react-native-toast-notifications';
import { AirbnbRating } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/FontAwesome6';

const ViewMessFeedBack = ({navigation}) => {

  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();

  const {token} = useSelector((state) => state.Auth);
  const {user} = useSelector((state) => state.Profile);

  const fetchData = async() => {
    const data = await dispatch(fetchCurrentDateRatingsAndReviews(toast));
    if(!data) return;
    setData(data);
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
);

  return (
    <ScrollView contentContainerStyle={{width:"100%", paddingVertical:25, paddingHorizontal:20, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:20}}>
      <Text style={{color:"grey", fontSize:22, fontWeight:"700"}}>Today's Feedback</Text>
      {
        toast && user && user?.accountType==="STUDENT" && (
          <View style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"flex-end"}}>
            <TouchableOpacity onPress={() => navigation.navigate("Give Mess Feedback")} style={{display:"flex", padding:10, flexDirection:"row", justifyContent:"flex-end", alignItems:"center", gap:5, borderRadius:15, backgroundColor:"#ccd5ae"}}>
              <Icon name="circle-plus" size={20} color="grey" solid />
              <Text style={{color:"black", textAlign:"right", fontSize:16, fontWeight:"600"}}>Give Feedback</Text>
            </TouchableOpacity>
          </View>
        )
      }
      {
        loading ? (<Text style={{textAlign:"center", fontWeight:"700", fontSize:18}}>Please Wait...</Text>) : (
          <View style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:15}}>
            {
              data.map((session,index) => (
                <ScrollView key={index} contentContainerStyle={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:20, borderColor:"black", borderStyle:"dotted", borderWidth:1 , borderRadius:20, padding:20}}>
                  <Text style={{color:"black", textAlign:"center", fontWeight:"700", fontSize:18}}>{session?.session}</Text>
                  <View style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:0}}>
                    <AirbnbRating
                      defaultRating={Math.round(parseFloat(session?.averageRating, 10))}
                      isDisabled
                      showRating={false}
                      size={30}
                    />
                    <Text style={{fontWeight:"800", color:"black", textAlign:"center", fontSize:16}}>{session?.averageRating.toFixed(2)}</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:15, display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                    {
                      session?.reviews.map((review,index) => (
                        <View key={index} style={{padding:10, width:200, borderStyle:"dashed", borderRadius:15, borderColor:"black", borderWidth:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                            <Text style={{fontSize:15, textAlign:"center", fontWeight:"500"}}>{review?.createdBy?.name} ({review?.createdBy?.rollNo})</Text>
                            <AirbnbRating
                              defaultRating={Math.round(parseFloat(review?.rating, 10))}
                              isDisabled
                              showRating={false}
                              size={20}
                            />
                            <Text style={{textAlign:"center", color:"black", fontSize:16, fontWeight:"600"}}>{review?.review}</Text>
                        </View>
                      ))
                    }
                  </ScrollView>
                </ScrollView>
              ))
            }
          </View>
        )
      }
    </ScrollView>
  )
}

export default ViewMessFeedBack

