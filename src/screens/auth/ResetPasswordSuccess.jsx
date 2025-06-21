import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import MainButton from '../../components/common/MainButton';

const ResetPasswordSuccess = ({navigation}) => {
  return (
    <View style={styles.container}>
            {/* <View style={styles.heading}><Text style={{fontSize:22,textAlign:"center",fontWeight:'700',color:'#000000'}}>Password Reset Successful</Text></View> */}
            <View style={{direction:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",width:"100%",gap:20,paddingVertical:50}}>
                <Text style={{fontSize:20,fontWeight:"600",textAlign:"center",color:"#212529",paddingHorizontal:20}}>The password linked to your HMS Account has been Successfully Reset.</Text>
                <Text style={{fontSize:16,fontWeight:"600",textAlign:"center",color:"#008000",paddingHorizontal:20}}>Please Login into your Account with new credentials.</Text>
            </View>
            <MainButton text={"Login"} onPress={() => (navigation.navigate("Login"))} />
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

export default ResetPasswordSuccess