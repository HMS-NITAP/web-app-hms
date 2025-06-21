import React from 'react'
import { View, Text } from 'react-native'
import MainButton from './MainButton'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setRegistrationData, setRegistrationStep } from '../../reducers/slices/AuthSlice';

const AwaitingConfirmation = ({}) => {

    const  navigation = useNavigation();
    const {registrationData} = useSelector((state) => state.Auth);

    const dispatch = useDispatch();

    const handleDone = () => {
      navigation.navigate("Login");
      dispatch(setRegistrationData(null));
      dispatch(setRegistrationStep(1));
    }
  return (
    <View style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center",alignItems:"center",gap:15}}>
        <Text style={{fontSize:20, fontWeight:"800", color:"black"}}>Application Submitted !</Text>
        <View style={{width:"100%", backgroundColor:"#d8f3dc", borderRadius:20, paddingHorizontal:15, paddingVertical:15, marginBottom:20}}>
            <Text style={{textAlign:"center", fontSize:15, color:"black"}}>Your hostel registration application has been successfully submitted to the hostel office and is currently under review. You will receive a confirmation email at your institute email address, <Text style={{fontWeight:"800"}}>{registrationData?.email}</Text>, once all details have been validated. You will be able to log in once your details are verified. Thank you for your patience.</Text>
        </View>
        <MainButton text={"Done"} onPress={handleDone} />
    </View>
  )
}

export default AwaitingConfirmation