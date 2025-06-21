import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import MainButton from '../../components/common/MainButton';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createAnnouncement } from '../../services/operations/OfficialAPI';
import DocumentPicker from 'react-native-document-picker';
import { useToast } from 'react-native-toast-notifications';

const CreateAnnouncement = () => {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const [fileResponse, setFileResponse] = useState(null);
  const toast = useToast();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onSubmit = async (data) => {
    setIsButtonDisabled(true);
    let formData = new FormData();
    formData.append("title",data.title);
    formData.append("textContent",data.textContent);
    if(fileResponse){
      formData.append("file",{uri:fileResponse[0]?.uri, type:fileResponse[0]?.type, name:fileResponse[0]?.name});
    }
    await dispatch(createAnnouncement(formData, token, toast));
    setValue("title","");
    setValue("textContent","");
    setFileResponse(null);
    setIsButtonDisabled(false);
  };

  const pickUpFile = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        // allowMultiSelection:true,
        presentationStyle: 'fullScreen',
      });
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.subFormView}>
          <Text style={styles.label}>
            Title<Text style={{ fontSize: 10, color: 'red' }}>*</Text> :
          </Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter Title"
                placeholderTextColor={"#adb5bd"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="title"
            defaultValue=""
          />
          {errors.title && <Text style={styles.errorText}>Title is required.</Text>}
        </View>

        <View style={styles.subFormView}>
          <Text style={styles.label}>
            Description<Text style={{ fontSize: 10, color: 'red' }}>*</Text> :
          </Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter Announcement Description"
                placeholderTextColor={"#adb5bd"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                numberOfLines={5}
                multiline
              />
            )}
            name="textContent"
            defaultValue=""
          />
          {errors.textContent && <Text style={styles.errorText}>Description is required.</Text>}
        </View>

        <View style={styles.subFormView}>
          <Text style={styles.label}>
            Select Documents to Upload :
          </Text>
          <View style={{display:'flex', flexDirection:"row", width:"100%", justifyContent:"space-between", alignItems:"flex-start", gap:20}}>
            <MainButton text="Pick File" onPress={pickUpFile} />
            <View>
              {
                fileResponse && 
                  <View style={{maxWidth:"80%", display:"flex",flexDirection:'column',gap:8}}>
                    {fileResponse.map((file,index) => <Text style={{color:"black", fontWeight:"700"}} key={index}>{file?.name}</Text>)}
                  </View>
              }
            </View>
          </View>
        </View>

        <View style={styles.subFormView}>
          <MainButton isButtonDisabled={isButtonDisabled} text="Create Announcement" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  form: {
    paddingTop: 60,
    paddingBottom: 30,
    width: "90%",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    flexDirection: 'column',
    gap: 30,
  },
  subFormView: {
    width:"100%",
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'start',
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  input: {
    width:"100%",
    padding: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#adb5bd",
    color:"black",
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default CreateAnnouncement;
