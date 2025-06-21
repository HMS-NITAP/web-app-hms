import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import MainButton from '../../components/common/MainButton';

const ResetPasswordMailSent = ({navigation}) => {
    return (
        <View style={styles.container}>
            {/* <View style={styles.heading}><Text style={{fontSize:22,textAlign:"center",fontWeight:'700',color:'#000000'}}>Reset Password Email Request</Text></View> */}
            <View style={{direction:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",width:"100%",gap:20,paddingVertical:50}}>
                <Text style={{fontSize:20,fontWeight:"600",textAlign:"center",color:"#212529"}}>We've sent you an Email with a link to reset your password and further instructions.</Text>
                <Text style={{fontSize:16,fontWeight:"600",textAlign:"center",color:"#9d0208"}}>Please check your Email inbox.</Text>
            </View>
            <MainButton text={"Set New Password"} onPress={() => (navigation.navigate("Reset Password"))} />
        </View>
)};

const styles = StyleSheet.create({
    container:{
      display:'flex',
      flexDirection:'column',
      justifyContent:'start',
      alignItems:'center',
      width:'100%',
      height:'100%',
      gap:0,
    },
    heading:{
      width:'100%',
      backgroundColor:'#ffb703',
      paddingVertical:15,
      textAlign:'center',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      textAlignVertical:"center",
    },
});

export default ResetPasswordMailSent