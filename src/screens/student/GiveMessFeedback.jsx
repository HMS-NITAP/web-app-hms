import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import MainButton from '../../components/common/MainButton';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { createMessFeedBack, fetchStudentMessHall } from '../../services/operations/StudentAPI';
import { AirbnbRating } from 'react-native-ratings';
import { useFocusEffect } from '@react-navigation/native';

const GiveMessFeedback = ({navigation}) => {

  const [loading, setLoading] = useState(true);
  const [displaySession, setDisplaySession] = useState('');
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const findSession = () => {
    const now = new Date();
    const date = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    setCurrentDate(`${date}/${month}/${year}`);

    const currentHour = now.getHours();

    if(currentHour >= 0 && currentHour < 10){
      setDisplaySession("Breakfast");
    }else if(currentHour >= 10 && currentHour < 15){
      setDisplaySession("Lunch");
    }else if(currentHour >= 15 && currentHour < 18){
      setDisplaySession("Snacks");
    }else{
      setDisplaySession("Dinner");
    }
  }

  useFocusEffect(
    useCallback(() => {
      findSession();
    }, [token,toast])
  );

  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.Auth);
  const toast = useToast();

  const onSubmit = async() => {

    if(review === ""){
      toast.show("Review field is Empty",{type:"danger"});
      return;
    }
    if(!rating){
      toast.show("Select Rating",{type:"warning"});
      return;
    }
    
    setIsButtonDisabled(true);
    let formData = new FormData();
    formData.append("rating",rating);
    formData.append("review",review);
    formData.append("session",displaySession);
    const response = await dispatch(createMessFeedBack(formData,token,toast));
    if(response){
      navigation.navigate("View Mess Feedback");
    }
    setIsButtonDisabled(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        
            <View style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
              <View style={{borderRadius:30, width:"90%", justifyContent:"center", padding:15, backgroundColor:"#e9f5db", borderColor:"black", borderWidth:0.25}} >
                <Text style={{color:"black", textAlign:"center", fontSize:16}}>Let us know how you find the food quality at mess, by sharing your valuable feedback.</Text>
              </View>
              <View style={styles.form}>

                <View>
                  <Text style={styles.label}>Date: <Text style={{fontWeight:"600", color:"#6c757d"}}> {currentDate}</Text></Text>
                  <Text style={styles.label}>Session:<Text style={{fontWeight:"600", color:"#6c757d"}}> {displaySession}</Text></Text>
                </View>

                <View style={styles.subFormView}>
                  <Text style={styles.label} >Review <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                  <TextInput
                    value={review}
                    onChangeText={setReview} 
                    editable multiline numberOfLines={2} 
                    placeholderTextColor={"#adb5bd"}
                    style={styles.input}
                    placeholder='Enter your Review' 
                  />
                </View>

                <View>
                    <Text style={styles.label} >Rating <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <AirbnbRating
                      type="star"
                      ratingCount={5}
                      showRating
                      defaultRating={3}
                      ratingBackgroundColor={"white"}
                      size={25}
                      reviewSize={25}
                      style={{
                        backgroundColor: 'transparent',
                        paddingVertical: 10,
                      }}
                      onFinishRating={(val) => setRating(val)}
                    />
                  </View>

                <View style={styles.subFormView}>
                  <MainButton isButtonDisabled={isButtonDisabled} text={"Submit"} onPress={onSubmit}/>
                </View>
              </View>
            </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
      display:'flex',
      flexDirection:'column',
      justifyContent:'start',
      alignItems:'center',
      width:'100%',
      height:'100%',
      paddingHorizontal:15,
      paddingVertical:15,
  },
  heading:{
      width:'100%',
      backgroundColor:'#ffb703',
      paddingVertical:15,
      textAlign:'center',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      fontSize:100,
  },
  subFormView:{
      width:"100%",
      display:'flex',
      justifyContent:'center',
      flexDirection:'column',
      alignItems:'start',
      gap:10,
  },
  form:{
      paddingVertical:20,
      width:"80%",
      display:'flex',
      justifyContent:'center',
      alignItems:'start',
      flexDirection:'column',
      gap:20,
  },
  label:{
      fontSize:15,
      fontWeight:'500',
      color:'#000000',
  },
  input:{
      width:"100%",
      padding:10,
      paddingHorizontal:10,
      borderWidth:1,
      borderRadius:10,
      borderColor:"#adb5bd",
      color:"black"
  },
  button:{
      textAlign:'center',
      borderRadius:30,
      fontSize:15,
      fontWeight:'800',
      color:"black"
  },
  dropdownOptions: {
    width: 250,
    padding:10,
    paddingHorizontal:10,
    borderWidth:1,
    borderRadius:10,
    borderColor:"#adb5bd",
  },
})


export default GiveMessFeedback