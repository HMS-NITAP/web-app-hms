import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import MainButton from '../../components/common/MainButton'
import { useForm,Controller } from 'react-hook-form'
import {useDispatch} from 'react-redux'
import { sendResetPasswordEmail } from '../../services/operations/AuthAPI'
import { useToast } from 'react-native-toast-notifications'

const ForgotPassword = ({navigation}) => {

  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const toast = useToast();

  const onSubmit = async(data) => {
    setIsButtonDisabled(true);
    await dispatch(sendResetPasswordEmail(data.email,navigation,toast));
    setIsButtonDisabled(false);
  }

  return (
    <View style={styles.container}>
        {/* <View style={styles.heading}><Text style={{fontSize:30,fontWeight:'700',color:'#000000'}}>Forgot Password</Text></View> */}
        <View style={styles.form}>
        <View style={styles.subFormView}>
            <Text style={styles.label} >Email ID<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Institute Email ID"
                  placeholderTextColor={"#adb5bd"}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
              />
            )}
            name="email"
            defaultValue=""
          />
          {errors.email && <Text style={styles.errorText}>Email ID is required.</Text>}
        </View>
        <View style={styles.subFormView}>
            <MainButton isButtonDisabled={isButtonDisabled} text={"Send Reset Password Link"} onPress={handleSubmit(onSubmit)} />
        </View>
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
    form:{
      paddingTop:100,
      paddingBottom:30,
      width:"80%",
      display:'flex',
      justifyContent:'center',
      alignItems:'start',
      flexDirection:'column',
      gap:40,
    },
    subFormView:{
      width:"100%",
      display:'flex',
      justifyContent:'center',
      flexDirection:'column',
      alignItems:'start',
      gap:10,
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
      color:"black",
    },
    button:{
      textAlign:'center',
      borderRadius:30,
      fontSize:15,
      fontWeight:'800',
      color:"black"
    },
    errorText:{
      fontSize:14,
      color:"red",
    },
});
  

export default ForgotPassword