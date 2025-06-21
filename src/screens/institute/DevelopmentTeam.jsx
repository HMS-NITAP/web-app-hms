import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native'
import {hostelOfficeAdvisorsData,developmentTeamData} from '../../static/DevelopmentTeamData'
import AnimatedCardPerson from '../../components/common/AnimatedCardPerson'

const DevelopmentTeam = () => {

  return (
    <ScrollView>
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={{fontSize:18,fontWeight:'700',color:'#000000', textAlign:'center'}}>Hostel Office Advisors</Text>
                <View style={styles.cardContainer}>
                    {
                        hostelOfficeAdvisorsData.map((data,index) => (
                            <AnimatedCardPerson key={index} data={data} />
                        ))
                    }  
                </View>
            </View>
            <View style={styles.hr} />
            <View style={styles.subContainer}>
                <Text style={{fontSize:18,fontWeight:'700',color:'#000000', textAlign:'center'}}>Developers Team</Text>
                <View style={styles.cardContainer}>
                    {
                        developmentTeamData.map((data,index) => (
                            <AnimatedCardPerson key={index} data={data} />
                        ))
                    }  
                </View>
            </View>
        </View>
    </ScrollView>
  )
}

export default DevelopmentTeam

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
        paddingHorizontal:10,
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
        width:"95%",
        gap:20,
        paddingVertical:30,
    },
    hr:{
        width : "100%",
        height : 2,
        backgroundColor : "#495057",
        borderRadius : 100,
    }
})