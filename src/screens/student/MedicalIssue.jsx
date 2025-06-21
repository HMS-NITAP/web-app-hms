import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import MainButton from '../../components/common/MainButton'


const MedicalIssue = ({navigation}) => {
  
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');

  return (
    <View style={styles.container}>
        {/* <View style={styles.heading}><Text>Register Medical Issue</Text></View> */}
        <View style={styles.form}>
        <View style={styles.subFormView}>
          <Text style={styles.label} >Summary<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
          <TextInput 
          value={summary}
          onChangeText={setSummary}
          style={styles.input} placeholder='Enter your Summary' 
          />
        </View>
        <View style={styles.subFormView}>
          <Text style={styles.label} >Detailed<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
          <TextInput
          value={details}
          onChangeText={setDetails} 
          editable multiline numberOfLines={8} style={styles.input} 
          />
        </View>
        <View style={styles.subFormView}>
          <Text style={styles.label} >Upload Related Documents<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
          <TextInput style={styles.input} placeholder='Enter your password' />
        </View>
        <View style={styles.subFormView}>
          <MainButton text={"Register"}/>
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
  subFormView:{
      width:"100%",
      display:'flex',
      justifyContent:'center',
      flexDirection:'column',
      alignItems:'start',
      gap:10,
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
  },
  button:{
      textAlign:'center',
      borderRadius:30,
      fontSize:15,
      fontWeight:'800',
      color:"black"
  },
})


export default MedicalIssue