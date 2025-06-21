import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Linking, Animated, TouchableOpacity, Modal } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { getAllAnnouncements } from '../../services/operations/CommonAPI'
import { useToast } from 'react-native-toast-notifications'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome6';
import { deleteAnnouncement } from '../../services/operations/AdminAPI'

const Announcements = () => {

    const [announcementData, setAnnouncementData] = useState([]);
    const [announcementId, setAnnouncementId] = useState(null);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const toast = useToast();
    const {token} = useSelector((state) => state.Auth);
    const {user} = useSelector((state) => state.Profile);

    const fetchAnnouncements = async() => {
        const data = await dispatch(getAllAnnouncements(toast));
        setAnnouncementData(data);
    }

    useFocusEffect(
        useCallback(() => {
          fetchAnnouncements();
        }, [toast])
    );

    const convertDate = (date) => {
        const localDate = new Date(date);
        return localDate.toLocaleString('en-US')
    }

    const isNew = (createdAt) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const differenceInTime = now - createdDate;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays <= 2;
    };

    const [bgColor, setBgColor] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgColor(prevBgColor => !prevBgColor); 
        }, 300);

        return () => clearInterval(interval);
    }, []);

    const selectedDeleteButton = (announcementId) => {
        setAnnouncementId(announcementId);
        setIsModalOpen(true);
    }

    const deleteAnnouncementHandler = async() => {
        if(!announcementId){
            return;
        }
        
        setIsButtonDisabled(true);
        const response = await dispatch(deleteAnnouncement(announcementId,token,toast));
        if(response){
            fetchAnnouncements();
        }
        setIsButtonDisabled(false);
        setIsModalOpen(false);
    }


  return (
    <ScrollView style={styles.container}>
        <View style={{display:'flex',paddingVertical:20, paddingHorizontal:20, flexDirection:"column", gap:20, justifyContent:"center", alignItems:"stretch"}}>
            {
                announcementData && announcementData.length == 0 ? (<View style={{width:"100%", marginTop:20}}><Text style={{textAlign:"center", fontSize:16, color:"black", fontWeight:"700"}}>No Announcements Found</Text></View>) : (
                    announcementData.map((announcement) => (
                        <View key={announcement?.id} style={styles.card}>
                            {
                                isNew(announcement?.createdAt) ? <View style={{position:"absolute", right:-5, top:-5, backgroundColor:bgColor?"rgba(128, 15, 47, 0.8)" : "rgba(128, 15, 47, 0.65)", paddingHorizontal:10, paddingVertical:5, borderRadius:15}}><Text style={{color:"white", fontWeight:"800"}}>New</Text></View> : ""
                            }
                            <View>
                                <Text style={{color:"#6C757D"}}>Created At : <Text>{convertDate(announcement?.createdAt)}</Text></Text>
                                <Text style={{color:"#6C757D"}}>Created By : <Text style={{color:"black", fontWeight:"600"}}>{announcement?.createdBy?.name} ({announcement?.createdBy?.designation})</Text></Text>
                            </View>
                            <Text style={{fontSize:16, color:"black", fontWeight:"700"}}>{announcement?.title}</Text>
                            <Text style={{fontSize:15, color:"black", fontWeight:"500"}}>{announcement?.textContent}</Text>
                            {
                                announcement?.fileUrl[0] && 
                                    <Text style={{color:"#6C757D"}}>Attachments : <Text style={{color:"blue"}} onPress={() => Linking.openURL(announcement?.fileUrl[0])}>Click Here to See</Text></Text>
                            }
                            {
                                toast && user?.accountType==="ADMIN" && (
                                    <TouchableOpacity onPress={() => selectedDeleteButton(announcement?.id)} style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", backgroundColor:"#ffb3c1", padding:10, borderRadius:15}}>
                                        <Icon color="#a4133c" size={20} name={"trash"} />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    ))
                )
            }
        </View>

        <Modal
                animationType="slide"
                transparent={true}
                visible={isModalOpen}
                onRequestClose={() => {
                    setIsModalOpen(!isModalOpen);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, textAlign:"center", fontWeight: '500', marginBottom: 10, color:"black" }}>Are you sure, this announcement will be deleted.</Text>
                        <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={deleteAnnouncementHandler} style={{ padding: 10, backgroundColor: '#ff4d6d', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color: 'black', fontWeight:"600" }}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={() => setIsModalOpen(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container : {
        width : "100%",
        height :"auto",
        display:"flex",
        flexDirection:"column",
        gap:10,
    },
    card : {
        width:"100%",
        borderColor :"black",
        borderRadius:10,
        paddingHorizontal:15,
        paddingVertical:15,
        borderWidth : 1,
        backgroundColor:"white",
        display:'flex',
        flexDirection:'column',
        gap:10,
        elevation:10,
    }
})

export default Announcements