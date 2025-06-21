import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView, Image } from 'react-native';
import MainButton from '../../components/common/MainButton';
import ModalDropdown from 'react-native-modal-dropdown';
import { RadioButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import { useToast } from 'react-native-toast-notifications';
import { createHostelBlock } from '../../services/operations/AdminAPI';

const CreateHostelBlock = () => {
    const seaterOptions = ['OneSeater', 'TwoSeater', 'FourSeater'];
    const floorOptions = [
        { label: 'G+2', value: 2 },
        { label: 'G+4', value: 4 },
    ];
    const yearOptions = [
        { label: '1st Year', value: 1 },
        { label: '2nd Year', value: 2 },
        { label: '3rd Year', value: 3 },
        { label: '4th Year', value: 4 },
    ];

    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();

    const [fileResponse, setFileResponse] = useState(null);
    const [roomType,setRoomType] = useState("");
    const [selectedGender, setSelectedGender] = useState('M');
    const [selectedFloorCount, setSelectedFloorCount] = useState(2);
    const [selectedYear, setSelectedYear] = useState(1);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const pickUpFile = useCallback(async () => {
        try {
          const response = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
            presentationStyle: 'fullScreen',
          });
          setFileResponse(response);
        } catch (err) {
          console.warn(err);
        }
      }, []);

    const submitHandler = async (data) => {
        setIsButtonDisabled(true);
        let formData = new FormData();
        formData.append("name",data.name);
        if(!fileResponse) toast.show("Select an Image",{type:"warning"});
        formData.append("image",{uri:fileResponse[0]?.uri, type:fileResponse[0]?.type, name:fileResponse[0]?.name});
        formData.append("roomType",roomType);
        formData.append("gender",selectedGender);
        formData.append("floorCount",selectedFloorCount);
        formData.append("capacity",data.capacity);
        formData.append("year",selectedYear);
        await dispatch(createHostelBlock(formData,token,toast));
        setFileResponse(null);
        reset();
        setIsButtonDisabled(false);
    };

  return (
    <ScrollView >
        <View style={styles.container}>
            <View style={styles.form}>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Hostel Block Name <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Hostel Block name"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="name"
                        defaultValue=""
                    />
                    {errors.name && <Text style={styles.errorText}>Hostel Block Name is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Hostel Block Image <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <View style={{display:'flex', marginTop:5, flexDirection:"row", width:"100%", justifyContent:"space-between", alignItems:"center",marginHorizontal:"auto", gap:20}}>
                    <MainButton text="Select Image" onPress={pickUpFile} />
                    <View>
                    {
                        fileResponse ? 
                            <View style={{maxWidth:"100%", display:"flex",flexDirection:'row',gap:8}}>
                                <Image source={{ uri: fileResponse[0].uri }} style={{width:80,height:80,borderRadius:40}} />
                            </View> : 
                            <View><Text style={{fontWeight:"800", fontSize:15}}>No Image Selected</Text></View>
                    }
                    </View>
                </View>
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Room Type <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                        <ModalDropdown
                            options={seaterOptions}
                            style={styles.dropDownStyle}
                            dropdownStyle={styles.dropdownOptions}
                            dropdownTextStyle={{color:"black", fontSize:14, fontWeight:"600"}}
                            dropdownTextHighlightStyle={{backgroundColor:"#caf0f8"}}
                            textStyle={{color:"black", fontSize:14, paddingHorizontal:10}}
                            saveScrollPosition={false}
                            defaultIndex = {0}
                            isFullWidth={true}
                            onSelect={(index) => {
                                onChange(seaterOptions[index]);
                                setRoomType(seaterOptions[index]);
                            }}
                            defaultValue="Select Room Type"
                        />    
                        )}
                        name="roomType"
                        defaultValue=""
                    />
                    {errors.roomType && <Text style={styles.errorText}>Room Type is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label}>Gender <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange } }) => (
                            <View style={styles.radioContainer}>
                                <View style={styles.radioOption}>
                                    <RadioButton.Android
                                        value="M"
                                        status={selectedGender === 'M' ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            onChange('M');
                                            setSelectedGender('M');
                                        }}
                                    />
                                    <Text style={styles.radioLabel}>M</Text>
                                </View>
                                <View style={styles.radioOption}>
                                    <RadioButton.Android
                                        value="F"
                                        status={selectedGender === 'F' ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            onChange('F');
                                            setSelectedGender('F');
                                        }}
                                    />
                                    <Text style={styles.radioLabel}>F</Text>
                                </View>
                            </View>
                        )}
                        name="gender"
                        defaultValue="M"
                    />
                    {errors.gender && <Text style={styles.errorText}>Gender is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                        <Text style={styles.label}>Floor Count <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange } }) => (
                                <ModalDropdown
                                    options={floorOptions.map(option => option.label)}
                                    style={styles.dropDownStyle}
                                    dropdownStyle={styles.dropdownOptions}
                                    dropdownTextStyle={{ color: "black", fontSize: 14, fontWeight: "600" }}
                                    dropdownTextHighlightStyle={{ backgroundColor: "#caf0f8" }}
                                    textStyle={{ color: "black", fontSize: 14, paddingHorizontal: 10 }}
                                    saveScrollPosition={false}
                                    defaultIndex={0}
                                    isFullWidth={true}
                                    onSelect={(index) => {
                                        const selectedOption = floorOptions[index];
                                        onChange(selectedOption.value);
                                        setSelectedFloorCount(selectedOption.value);
                                    }}
                                    defaultValue="Select Floor Count"
                                />
                            )}
                            name="floorCount"
                            defaultValue={2}
                        />
                        {errors.floorCount && <Text style={styles.errorText}>Floor Count is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                        <Text style={styles.label}>Year Assigned to<Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange } }) => (
                                <ModalDropdown
                                    options={yearOptions.map(option => option.label)}
                                    style={styles.dropDownStyle}
                                    dropdownStyle={styles.dropdownOptions}
                                    dropdownTextStyle={{ color: "black", fontSize: 14, fontWeight: "600" }}
                                    dropdownTextHighlightStyle={{ backgroundColor: "#caf0f8" }}
                                    textStyle={{ color: "black", fontSize: 14, paddingHorizontal: 10 }}
                                    saveScrollPosition={false}
                                    defaultIndex={0}
                                    isFullWidth={true}
                                    onSelect={(index) => {
                                        const selectedOption = yearOptions[index];
                                        onChange(selectedOption.value);
                                        setSelectedYear(selectedOption.value);
                                    }}
                                    defaultValue="Select Year Assigned"
                                />
                            )}
                            name="year"
                            defaultValue={1}
                        />
                        {errors.year && <Text style={styles.errorText}>Year Assigned is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                        <Text style={styles.label} >Block Capacity<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Eg : 250"
                                placeholderTextColor={"#adb5bd"}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            )}
                            name="capacity"
                            defaultValue=""
                        />
                        {errors.capacity && <Text style={styles.errorText}>Block Capacity is required.</Text>}
                </View>

                <MainButton isButtonDisabled={isButtonDisabled} text={"Create Block"} onPress={handleSubmit(submitHandler)} />
            </View>
        </View>
        </ScrollView>
  )
}

export default CreateHostelBlock

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:'100%',
    },
    subFormView:{
        width:"100%",
        display:'flex',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'start',
        gap:2,
    },
    form:{
        paddingTop:60,
        paddingBottom:30,
        width:"80%",
        display:'flex',
        justifyContent:'center',
        alignItems:'start',
        flexDirection:'column',
        gap:20,
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
        color: "black",
    },
    button:{
        textAlign:'center',
        borderRadius:30,
        fontSize:15,
        fontWeight:'800',
        color:"black"
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
    },
    radioContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    radioOption: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioLabel: {
        fontSize: 16,
        fontWeight:"700",
        color: '#000',
    },
    errorText:{
        fontSize:14,
        color:"red",
    },
})
  