import { View, Text, Button } from 'react-native'
import React from 'react'
import MainButton from '../components/common/MainButton'

// import { createDrawerNavigator } from '@react-navigation/drawer';

// const Drawer = createDrawerNavigator();

export default function StudentTab({navigation}) {
  return (
    <View style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:2,fontWeight:'900',}}>Home</Text>
        <View style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",gap:15}}>
          <MainButton onPress={() => navigation.navigate("StudentDashboard")} text='StudentDashboard' />
          <MainButton onPress={() => navigation.navigate("Announcements")} text='Announcements' />
          <MainButton onPress={() => navigation.navigate("OutingApplication")} text='OutingApplication' />
          <MainButton onPress={() => navigation.navigate("AttendanceHistory")} text='AttendanceHistory' />
          <MainButton onPress={() => navigation.navigate("OutingHistory")} text='OutingHistory' />
          <MainButton onPress={() => navigation.navigate("MessFeedback")} text='MessFeedback' />
          <MainButton onPress={() => navigation.navigate("VacationHistory")} text='VacationHistory' />
          <MainButton onPress={() => navigation.navigate("MedicalIssue")} text='MedicalIssue' />
          <MainButton onPress={() => navigation.navigate("RegisterComplaint")} text='RegisterComplaint' />
          <MainButton onPress={() => navigation.navigate("Login")} text='Logout' />
        </View>
    </View>
  )
}