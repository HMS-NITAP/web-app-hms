import React, {useEffect, useState} from 'react'
import { StyleSheet, View, Text } from 'react-native'
import OTPTextInput from 'react-native-otp-textinput';
import MainButton from '../../components/common/MainButton';
import {useSelector,useDispatch} from 'react-redux';
import { signUp } from '../../services/operations/AuthAPI';
import { useToast } from 'react-native-toast-notifications';

const OtpInput = ({navigation}) => {

    const toast = useToast();

    const [otp, setOTP] = useState('');
    const {signUpData} = useSelector((state) => state.Auth);

    const dispatch = useDispatch();

    useEffect(() => {
      if(!signUpData){
        navigation.navigate("SignUp");
      }
    },[]);

    const handleTextChange = (value) => {
        setOTP(value);
    }

    const submitHandler = () => {
        dispatch(signUp(signUpData,otp,navigation,toast));
    }

  return (
    <View style={styles.container}>
        <View style={styles.subContainer}>
            <Text style={{fontSize:18, fontWeight:"600", color:"#495057"}}>Enter the OTP received in your Email ID, to complete verification of your account.</Text>
            <OTPTextInput
                containerStyle={{ marginTop: 20 }}
                inputCount={6}
                tintColor={"#6c757d"}
                offTintColor={"#ced4da"}
                handleTextChange={handleTextChange}
                textInputStyle={{ color: 'black', borderWidth: 1, borderColor: 'gray', borderRadius: 10 }}
            />
            <View style={{display:"flex",justifyContent:"center",alignItems:"center",marginVertical:50}}><MainButton text={"Submit"} onPress={submitHandler} backgroundColor={"#68d8d6"} /></View>
        </View>
    </View>
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
      subContainer:{
        display:"flex",
        justifyContent:"center",
        alignItems:"start",
        paddingHorizontal:10,
        marginTop:50,
        width:"100%",
        height:"auto",
      }
})

export default OtpInput