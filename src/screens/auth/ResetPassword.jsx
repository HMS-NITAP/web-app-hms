import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import MainButton from '../../components/common/MainButton'
import { useForm,Controller } from 'react-hook-form'
import {useDispatch} from 'react-redux'
import { resetPassword } from '../../services/operations/AuthAPI'
import { useToast } from 'react-native-toast-notifications'

const ResetPassword = ({navigation}) => {

  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const toast = useToast();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onSubmit = async(data) => {
    setIsButtonDisabled(true);
    await dispatch(resetPassword(data.token,data.newPassword,data.confirmNewPassword,navigation,toast));
    setIsButtonDisabled(false);
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.subFormView}>
          <Text style={styles.label} >Token <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Token received in Email"
                placeholderTextColor={"#adb5bd"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="token"
            defaultValue=""
          />
          {errors.token && <Text style={styles.errorText}>Token is required.</Text>}
        </View>
        <View style={styles.subFormView}>
          <Text style={styles.label} >New Password<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your New Password"
                placeholderTextColor={"#adb5bd"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="newPassword"
            defaultValue=""
          />
          {errors.newPassword && <Text style={styles.errorText}>New Password is required.</Text>}
        </View>
        <View style={styles.subFormView}>
          <Text style={styles.label} >Confirm New Password<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Re Type your New Password"
                placeholderTextColor={"#adb5bd"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="confirmNewPassword"
            defaultValue=""
          />
          {errors.confirmNewPassword && <Text style={styles.errorText}>This field is required.</Text>}
        </View>
        <View style={styles.subFormView}>
          <MainButton isButtonDisabled={isButtonDisabled} text={"Reset Your Password"} onPress={handleSubmit(onSubmit)} />
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
      paddingTop:60,
      paddingBottom:30,
      width:"80%",
      display:'flex',
      justifyContent:'center',
      alignItems:'start',
      flexDirection:'column',
      gap:30,
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
      marginBottom:10,
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
    createAccount:{
      textAlign:'center',
      fontSize:15,
      fontWeight:'500',
      color:"#4a4e69",
    }
  })
  

export default ResetPassword