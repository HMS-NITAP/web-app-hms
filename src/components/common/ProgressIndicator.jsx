import React from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome6';

const ProgressIndicator = () => {

    const {registrationStep} = useSelector((state) => state.Auth);

  return (
    <View style={{width:"100%", marginVertical:20, display:"flex", flexDirection:"row",justifyContent:"space-evenly", alignItems:"flex-start", marginHorizontal:10}}>
        <View style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",gap:5}}>
            <View style={{display:"flex", borderWidth:2, borderColor:"#ee9b00",backgroundColor:registrationStep===1 ? "transparent" : "#ee9b00", borderRadius:20, width: 40, height: 40,paddingHorizontal:"auto",paddingVertical:"auto", justifyContent: 'center', alignItems: 'center'}}>
                {
                    registrationStep===1 ? <Text style={{color:"#ee9b00",fontWeight:"800", fontSize:16}}>1</Text> : <Icon name="check" style={{color:"white"}} size={20} />
                }
            </View>
            <Text style={{width:"80%", textAlign:"center",fontSize:14,fontWeight:"600",color:"#ee9b00"}}>Fill Details</Text>
        </View>

        <View style={{borderStyle: 'dotted', borderWidth: 1.5, width:"20%", borderColor:registrationStep===1 ? 'black' : "#ee9b00", borderRadius:1, marginTop:20}} />
        
        <View style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",gap:5}}>
            <View style={{display:"flex", borderWidth:2, borderColor:registrationStep<2 ? "black" : "#ee9b00",backgroundColor:registrationStep<=2 ? "transparent" : "#ee9b00", borderRadius:20, width: 40, height: 40,paddingHorizontal:"auto",paddingVertical:"auto", justifyContent: 'center', alignItems: 'center'}}>
                {
                    registrationStep<=2 ? <Text style={{color:registrationStep<2 ? "black" : "#ee9b00",fontWeight:"800", fontSize:16}}>2</Text> : <Icon name="check" style={{color:"white"}} size={20} />
                }
            </View>
            <Text style={{width:"80%", textAlign:"center",fontSize:14,fontWeight:"600",color:registrationStep<2 ? "black" : "#ee9b00"}}>Verify Email</Text>
        </View>
        
        <View style={{borderStyle: 'dotted', borderWidth: 1.5, width:"20%", borderColor:registrationStep<=2 ? 'black' : "#ee9b00", borderRadius:1, marginTop:20}} />
        
        <View style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",gap:5}}>
            <View style={{display:"flex", borderWidth:2, borderColor:registrationStep<3 ? "black" : "#ee9b00",backgroundColor:registrationStep<=3 ? "transparent" : "#ee9b00", borderRadius:20, width: 40, height: 40,paddingHorizontal:"auto",paddingVertical:"auto", justifyContent: 'center', alignItems: 'center'}}>
                {
                    registrationStep<=3 ? <Text style={{color:registrationStep<3 ? "black" : "#ee9b00",fontWeight:"800", fontSize:16}}>3</Text> : <Icon name="check" style={{color:"white"}} size={20} />
                }
            </View>
            <Text style={{width:"80%", textAlign:"center",fontSize:14,fontWeight:"600",color:registrationStep<3?"black":"#ee9b00"}}>Select Room</Text>
        </View>
    </View>
  )
}

export default ProgressIndicator