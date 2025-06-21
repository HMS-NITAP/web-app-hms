import React, { useCallback, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator, Linking } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { addEvenSemFeeReceipt, getStudentDashboardData } from '../../services/operations/StudentAPI';
import { useFocusEffect } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import MainButton from '../../components/common/MainButton';
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-date-picker'
import { useForm, Controller } from 'react-hook-form';

const quotes = [
  "Wishing you a day filled with immense love, joy, and countless beautiful moments! May all your dreams come true on this special day! 🎉",
  "May your birthday be as extraordinary and wonderful as you are! Here's to celebrating you and the incredible person you are. Happy Birthday! 🎂",
  "Happy Birthday! May you enjoy every single moment of this special day, surrounded by love, laughter, and the people who matter most to you! 🎈",
  "Here's to a fantastic year ahead, filled with new adventures, growth, and endless possibilities! Cheers to your bright future and all the happiness it holds! 🍰",
  "Celebrate your special day in a special way, making memories that will last a lifetime! May your birthday be filled with all the joy and love your heart can hold! 🎁"
];

const MAX_FILE_SIZE = 250 * 1024;

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

const StudentDashboardScreen = () => {

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRatingLabel = (rating) => {
    rating = parseFloat(rating);
  
    if(rating>4 && rating<=5){
      return "Excellent";
    }else if(rating>3 && rating <= 4){
      return "Good";
    }else if(rating>2 && rating<=3){
      return "Average";
    }else if(rating>1 && rating<=2){
      return "Poor";
    }else if(rating>0 && rating<=1){
      return "Bad";
    }else{
      return "Not Rated";
    }
  };
  
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [evenSemFeeModal, setEvenSemFeeModal] = useState(false);

  const [hostelEvenSemfeeReceiptResponse, setHostelEvenSemFeeReceiptResponse] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const paymentOption = [
    { label : "NET BANKING", value : "NET_BANKING"},
    { label : "DEBIT CARD", value : "DEBIT_CARD"},
    { label : "CREDIT CARD", value : "CREDIT_CARD"},
    { label : "UPI", value : "UPI"},
    { label : "NEFT", value : "NEFT"},
    { label : "NEFT(Educational Loan)", value : "NEFT_Educational_Loan"},
    { label : "OTHER", value : "OTHER"},
  ]

  const formatDate = (date) => {
    if (!date) return "NO DATE IS SELECTED";
    return date.toLocaleDateString(); 
  };

  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  const [isPaymentDatePickerOpen, setIsPaymentDatePickerOpen] = useState(false);
  const [paymentMode2, setPaymentMode2] = useState(null);
  const [paymentDate2, setPaymentDate2] = useState(null);

  const checkIsDob = (dobString) => {
    const [_, birthMonth, birthDay] = dobString.split('-').map(Number);

    const now = Date.now(); 
    const currentDate = new Date(now); 

    const date = currentDate.getDate();
    const month = currentDate.getMonth() + 1; 

    if(birthDay===date && birthMonth===month){
      setShowBirthdayModal(true);
    }
  }

  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.Auth);
  const toast = useToast();

  const fetchData = async() => {
    const response = await dispatch(getStudentDashboardData(token,toast));
    if(response){
      setDashboardData(response);
      if(response?.data?.dob){
        checkIsDob(response?.data?.dob);
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [token,toast])
  );

  const closeBirthdayModal = () => {
    setShowBirthdayModal(false);
  };

  const pickUpHostelFeeReceipt = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        presentationStyle: 'fullScreen',
      });
      if(response[0].size > MAX_FILE_SIZE){
        toast.show('File size exceeds the limit of 250KB. Please select a smaller file.', { type: 'warning' });
      }else{
        setHostelEvenSemFeeReceiptResponse(response);
      }
    }catch(err){
      toast.show("Unable to Attach File", {type:"warning"});
      console.log("Error",e?.response?.data?.message);
    }
  }, []);

  const covertToLocalDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-CA', options);
    return formattedDate
}

  const submitModalHandler = async(data) => {

    if(!paymentMode2){
        toast.show("Select Hostel Fee Payment Mode",{type:"warning"});
        return;
    }else if(!paymentDate2){
        toast.show("Select Hostel Fee Payment Date",{type:"warning"});
        return;
    }else if(!hostelEvenSemfeeReceiptResponse){
        toast.show("Upload Fee Receipt",{type:"warning"});
        return;
    }

    setIsButtonDisabled(true);
    let formData = new FormData();
    formData.append("evenSemHostelFeeReceipt",{uri:hostelEvenSemfeeReceiptResponse[0]?.uri, type:hostelEvenSemfeeReceiptResponse[0]?.type, name:hostelEvenSemfeeReceiptResponse[0]?.name});
    formData.append("amountPaid2",data?.amountPaid2);
    formData.append("paymentDate2",covertToLocalDate(paymentDate2));
    formData.append("paymentMode2",paymentMode2);
    await dispatch(addEvenSemFeeReceipt(formData,token,toast));
    setEvenSemFeeModal(false);
    setHostelEvenSemFeeReceiptResponse(null);
    setIsButtonDisabled(false);
    fetchData();
  }

  const cancelModalHandler = async() => {
    setHostelEvenSemFeeReceiptResponse(null);
    setEvenSemFeeModal(false);
  }

  return (
    
    <ScrollView contentContainerStyle={{display:"flex", flexDirection:"column"}}>
      {
        !dashboardData ? (<View><Text style={{textAlign:"center", color:"black", fontSize:18, fontWeight:"700"}}>Please Wait...</Text></View>) : (
          <View style={styles.container}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingLabel}>Discipline Rating</Text>
                <AirbnbRating
                  defaultRating={Math.round(parseFloat(dashboardData?.data?.disciplineRating, 10))}
                  isDisabled
                  showRating={false}
                  size={20}
                />
                <Text style={styles.ratingText}>{getRatingLabel(dashboardData?.data?.disciplineRating)}</Text>
                <Text style={{color:"black", fontWeight:"800"}}>{dashboardData?.data?.disciplineRating}</Text>
              </View>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingLabel}>Outing Rating</Text>
                <AirbnbRating
                  defaultRating={Math.round(parseFloat(dashboardData?.data?.outingRating, 10))}
                  isDisabled
                  showRating={false}
                  size={20}
                />
                <Text style={styles.ratingText}>{getRatingLabel(dashboardData?.data?.outingRating)}</Text>
                <Text style={{color:"black", fontWeight:"800"}}>{dashboardData?.data?.outingRating}</Text>
              </View>
            </View>
            <View style={styles.imageContainer}>
                {isLoading && (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                )}
                <Image 
                    source={{ uri: dashboardData?.data?.image }} 
                    style={styles.image} 
                    onLoadStart={() => setIsLoading(true)}
                    onLoad={() => setIsLoading(false)}
                />
                <Text style={styles.name}>{dashboardData?.data?.name}</Text>
            </View>
            <View style={styles.imageContainer}>
                {dashboardData?.data?.user?.status === "ACTIVE1" && !dashboardData?.data?.hostelFeeReceipt2 && <MainButton onPress={() => setEvenSemFeeModal(true)} text={"Upload Even Sem Hostel Fee Receipt"} />}
                {dashboardData?.data?.user?.status === "ACTIVE1" && dashboardData?.data?.hostelFeeReceipt2 && <Text style={{color:"green", fontWeight:"800", fontSize:16, textAlign:"center"}}>( Even Semester Registration Under Review )</Text>}
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>Reg No: {dashboardData?.data?.regNo}</Text>
              <Text style={styles.detailsText}>Roll No: {dashboardData?.data?.rollNo}</Text>
              <Text style={styles.detailsText}>Email: {dashboardData?.userData?.email}</Text>
              <Text style={styles.detailsText}>Gender: {dashboardData?.data?.gender==="M" ? "Male" : "Female"}</Text>
              <Text style={styles.detailsText}>DOB: {new Date(dashboardData?.data?.dob).toLocaleDateString()}</Text>
              <Text style={styles.detailsText}>Year: {dashboardData?.data?.year}</Text>
              <Text style={styles.detailsText}>Branch: {dashboardData?.data?.branch}</Text>
              <Text style={styles.detailsText}>Blood Group: {dashboardData?.data?.bloodGroup}</Text>
              <Text style={styles.detailsText}>Aadhaar Number: {dashboardData?.data?.aadhaarNumber}</Text>
              <Text style={styles.detailsText}>Contact No: {dashboardData?.data?.phone}</Text>
              <Text style={styles.detailsText}>Father's Name: {dashboardData?.data?.fatherName}</Text>
              <Text style={styles.detailsText}>Mother's Name: {dashboardData?.data?.motherName}</Text>
              <Text style={styles.detailsText}>Parents' Contact: {dashboardData?.data?.parentsPhone}</Text>
              <Text style={styles.detailsText}>Emergency Contact: {dashboardData?.data?.emergencyPhone}</Text>
              <Text style={styles.detailsText}>Address: {dashboardData?.data?.address}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Hostel Details</Text>
                  <Text style={styles.detailsText}>Hostel Name: {dashboardData?.data?.hostelBlock?.name}</Text>
                  <Text style={styles.detailsText}>Capacity: {dashboardData?.data?.hostelBlock?.capacity}</Text>
                  <Text style={styles.detailsText}>Gender: {dashboardData?.data?.hostelBlock?.gender==="M" ? "Boys Hostel" : "Girls Hostel"}</Text>
                  <Image source={{ uri: dashboardData?.data?.hostelBlock?.image }} style={styles.hostelImage} />
                </View>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Room Details</Text>
                  <Text style={styles.detailsText}>Room Type: {dashboardData?.data?.hostelBlock?.roomType}</Text>
                  <Text style={styles.detailsText}>Room Number: {dashboardData?.data?.cot?.room?.roomNumber}</Text>
                  <Text style={styles.detailsText}>Floor Number: {dashboardData?.data?.cot.room.floorNumber}</Text>
                  <Text style={styles.detailsText}>Cot Number: {dashboardData?.data?.cot?.cotNo}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Mess Details</Text>
                  {dashboardData?.data?.messHall ? (
                    <View>
                      <Text style={styles.detailsText}>Mess Name: {dashboardData?.data?.messHall?.hallName}</Text>
                      <Text style={styles.detailsText}>Capacity: {dashboardData?.data?.messHall?.capacity}</Text>
                    </View>
                  ) : (
                    <Text style={styles.detailsTextRed}>Mess Hall not assigned</Text>
                  )}
                </View>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Payment Details</Text>
                  {
                    dashboardData?.data?.hostelFeeReceipt && <TouchableOpacity>
                                    <Text onPress={() => Linking.openURL(dashboardData?.data?.hostelFeeReceipt)} style={styles.link}>Odd Sem Hostel Fee Receipt</Text>
                                  </TouchableOpacity>
                  }
                  {
                    dashboardData?.data?.hostelFeeReceipt2 && <TouchableOpacity>
                                    <Text onPress={() => Linking.openURL(dashboardData?.data?.hostelFeeReceipt2)} style={styles.link}>Even Sem Hostel Fee Receipt</Text>
                                  </TouchableOpacity>
                  }
                </View>
              </ScrollView>
            </View>
            <View style={{marginVertical:10, marginHorizontal:40}}>
              <Text style={{color:"#4a4e69", textAlign:"center"}}>If you want to delete your account, please contact us on <TouchableOpacity style={{color:"blue"}} onPress={() => Linking.openURL("mailto:hmsnitap@gmail.com")}><Text style={{color:"blue"}}>hmsnitap@gmail.com</Text></TouchableOpacity> from your registered mail ID and reason for account deletion.</Text>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={showBirthdayModal}
              onRequestClose={() => {
                  setShowBirthdayModal(!showBirthdayModal);
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>Happy Birthday, {dashboardData?.data?.name}!</Text>
                  <Text style={styles.quote}>{getRandomQuote()}</Text>
                  <Pressable
                    style={styles.closeButton}
                    onPress={(closeBirthdayModal)}
                  >
                    <Text style={styles.closeButtonText}>Thank you !</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="fade"
              transparent={true}
              visible={evenSemFeeModal}
              onRequestClose={() => setEvenSemFeeModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={{color:"black", textAlign:"center", fontSize:20, fontWeight:"700"}}>Upload Even Sem Hostel Fee Receipt</Text>
                    <View style={{width:"100%", display: "flex", flexDirection: "row", gap: 15, justifyContent: "space-between", alignItems: "center" }}>
                      <MainButton text={"Select File"} onPress={pickUpHostelFeeReceipt} />
                      <View style={{maxWidth:"100%", marginHorizontal:"auto"}}>
                        {hostelEvenSemfeeReceiptResponse ? (
                          <View style={{ maxWidth: '75%', flexWrap:"wrap", display: 'flex', flexDirection: 'row', gap: 8 }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: 'black',
                                fontWeight: '700',
                                fontSize: 15,
                              }}
                            >
                              {hostelEvenSemfeeReceiptResponse[0].name}
                            </Text>
                          </View>
                        ) : (
                          <View style={{maxWidth:"100%"}}>
                            <Text style={{color:"black", fontWeight: '800', fontSize: 15, color:"red" }}>No File Selected</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={styles.subFormView}>
                      <Text style={styles.label}>Hostel Fee Payment Mode <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                      <ModalDropdown
                          options={paymentOption.map((mode) => mode.label)}
                          style={styles.dropDownStyle}
                          dropdownStyle={styles.dropdownOptions}
                          dropdownTextStyle={{ color: "black", fontSize: 14, fontWeight: "600" }}
                          dropdownTextHighlightStyle={{ backgroundColor: "#caf0f8" }}
                          textStyle={{ color: "black", fontSize: 14, paddingHorizontal: 10 }}
                          saveScrollPosition={false}
                          // defaultIndex={0}
                          isFullWidth={true}
                          onSelect={(index) => {
                              setPaymentMode2(paymentOption[index].value); 
                          }}
                          defaultValue="Select Your Payment Mode"
                      />
                  </View>

                  <View style={styles.subFormView}>
                      <Text style={styles.label} >Hostel Fee Payment Date <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                      <View style={{ display: "flex", flexDirection: "row", gap: 15, justifyContent: "space-between", alignItems: "center" }}>
                          <View>
                              <MainButton text={"Select Date"} onPress={() => setIsPaymentDatePickerOpen(true)} />
                              <DatePicker
                                  modal
                                  mode='date'
                                  open={isPaymentDatePickerOpen}
                                  date={paymentDate2 || new Date()} 
                                  onConfirm={(date) => {
                                      setIsPaymentDatePickerOpen(false);
                                      setPaymentDate2(date);
                                  }}
                                  onCancel={() => {
                                      setIsPaymentDatePickerOpen(false);
                                  }}
                              />
                          </View>
                          <View>
                              <Text style={{ fontWeight: "800", fontSize: 14, color:"black" }}>{formatDate(paymentDate2)}</Text>
                          </View>
                      </View>
                  </View>

                  <View style={styles.subFormView}>
                      <Text style={styles.label} >Hostel Fee Payment Amount <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                      <Controller
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                              style={styles.input}
                              placeholder="Enter amount paid"
                              placeholderTextColor={"#adb5bd"}
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                              keyboardType='numeric'
                          />
                          )}
                          name="amountPaid2"
                          defaultValue=""
                      />
                      {errors.amountPaid2 && <Text style={styles.errorText}>Amount Paid is required.</Text>}
                  </View>

                  <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                      <TouchableOpacity disabled={isButtonDisabled} onPress={handleSubmit(submitModalHandler)}  style={{ padding: 10, backgroundColor: '#aacc00', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                          <Text style={{ fontSize: 16, color: 'black', fontWeight:"600" }}>Submit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity disabled={isButtonDisabled} onPress={cancelModalHandler} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                          <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>Cancel</Text>
                      </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

          </View>
        )
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  subFormView:{
    width:"100%",
    display:'flex',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'start',
    gap:2,
  },
  label:{
    fontSize:15,
    fontWeight:'500',
    color:'#000000',
  },
  ratingBox: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#dcedc8',
    marginHorizontal: 5,
    elevation:10,
    color:"#495057",
  },
  ratingLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color:"#495057",
  },
  ratingText: {
    marginTop: 5,
    fontSize: 14,
    color:"black",
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10
  },
  errorText:{
    fontSize:14,
    color:"red",
  },
  input:{
    width:"100%",
    padding:10,
    paddingHorizontal:10,
    borderWidth:1,
    borderRadius:10,
    borderColor:"#adb5bd",
    color: "black",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: 'black'
  },
  detailsContainer: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#cfd8dc',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation:10,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight:"600",
    color:"black",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#388e3c'
  },
  horizontalScroll: {
    padding: 10
  },
  column: {
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cfd8dc',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation:10,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#388e3c',
    textAlign: 'center'
  },
  hostelImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10
  },
  detailsTextRed: {
    fontSize: 16,
    marginBottom: 5,
    color: 'red'
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginBottom: 5
  },
  attendanceContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  attendanceText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width:"90%",
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    gap:15,
    alignItems: 'center'
  },
  quote:{
    color:"black",
    fontSize:16,
    fontWeight:"500",
    textAlign:"center"
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#388e3c'
  },
  closeButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  dropDownStyle : {
    paddingVertical:10,
    borderWidth:1,
    borderRadius:10,
    borderColor:"#adb5bd",
  },
  dropdownOptions: {
    paddingHorizontal:10,
    paddingVertical:10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#adb5bd',
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});

export default StudentDashboardScreen;