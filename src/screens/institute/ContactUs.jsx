import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native'
import {hostelCommiteeData,medicalAndSecurityOfficerData,securitySepervisorsData,hostelOfficeStaffData} from '../../static/ContactUsData'
import AnimatedCardPerson from '../../components/common/AnimatedCardPerson'

const ContactUs = () => {

  return (
    <ScrollView>
        {/* <View style={styles.heading}>
            <Text style={{fontSize:30,fontWeight:'700',color:'#000000'}}>Contact Us</Text>
        </View> */}
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={{fontSize:18,fontWeight:'700',color:'#000000', textAlign:'center'}}>NIT Andhra Pradesh Hostel Committee</Text>
                <View style={styles.cardContainer}>
                    {
                        hostelCommiteeData.map((data,index) => (
                            <AnimatedCardPerson key={index} data={data} />
                        ))
                    }  
                </View>
            </View>
            <View style={styles.hr} />
            <View style={styles.subContainer}>
                <Text style={{fontSize:18,fontWeight:'700',color:'#000000', textAlign:'center'}}>Hostel Office Staff</Text>
                <View style={styles.cardContainer}>
                    {
                        hostelOfficeStaffData.map((data,index) => (
                            <AnimatedCardPerson key={index} data={data} />
                        ))
                    }  
                </View>
            </View>
            <View style={styles.hr} />
            <View style={styles.subContainer}>
                <Text style={{fontSize:18,fontWeight:'700',color:'#000000', textAlign:'center'}}>Medical and Security Officer</Text>
                <View style={styles.cardContainer}>
                    {
                        medicalAndSecurityOfficerData.map((data,index) => (
                            <AnimatedCardPerson key={index} data={data} />
                        ))
                    }  
                </View>
            </View>
            <View style={styles.hr} />
            <View style={styles.subContainer}>
                <Text style={{fontSize:18,fontWeight:'700',color:'#000000', textAlign:'center'}}>Security Supervisors</Text>
                <View style={styles.cardContainer}>
                    {
                        securitySepervisorsData.map((data,index) => (
                            <AnimatedCardPerson key={index} data={data} />
                        ))
                    }  
                </View>
            </View>
        </View>
        <View style={{marginVertical:10, marginHorizontal:40}}>
            <Text style={{color:"#4a4e69", textAlign:"center"}}>If you want to delete your account, please contact us on <TouchableOpacity style={{color:"blue"}} onPress={() => Linking.openURL("mailto:hmsnitap@gmail.com")}><Text style={{color:"blue"}}>hmsnitap@gmail.com</Text></TouchableOpacity> from your registered mail ID and reason for account deletion.</Text>
        </View>
    </ScrollView>
  )
}

export default ContactUs

const styles = StyleSheet.create({
    heading:{
        width:'100%',
        backgroundColor:'#ffb703',
        paddingVertical:15,
        textAlign:'center',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },
    container:{
        width:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'flex-start',
        paddingVertical:15,
        paddingHorizontal:0,
        gap:30,
    },
    subContainer:{
        width:'100%',
        display:'flex',
        flexDirection:"column",
        justifyContent:'center',
        alignItems:'center',
    },
    cardContainer:{
        width:"90%",
        gap:20,
        paddingVertical:30,
        paddingHorizontal:0,
    },
    hr:{
        width : "100%",
        height : 2,
        backgroundColor : "#495057",
        borderRadius : 100,
    }
})