import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import HostelBlockCard from '../../components/institute/HostelBlockCard';
import { useDispatch } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { fetchHostelData } from '../../services/operations/CommonAPI';
import AnimatedCardHostelBlock from '../../components/common/AnimatedCardHostelBlock';

const HostelBlocks = () => {

    const [loading,setLoading] = useState(true);
    const [boysHostelData, setBoysHostelData] = useState([]);
    const [girlsHostelData, setGirlsHostelData] = useState([]);

    const dispatch = useDispatch();
    const toast = useToast();

    useEffect(() => {
        const fetchHostelBlockData = async() => {
            const data = await dispatch(fetchHostelData(toast));
            if (!data) return;
        
            setBoysHostelData(data.filter((item) => item.gender === 'M'));
            setGirlsHostelData(data.filter((item) => item.gender === 'F'));

            setLoading(false);
        };
        fetchHostelBlockData();
    },[]);

  return (
    <>
        {
            loading ? "" :
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.subContainer}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#000000', textAlign: 'center' }}>Girls Hostel Blocks</Text>
                    <View style={styles.cardContainer}>
                        {girlsHostelData && girlsHostelData.map((data, index) => (
                        <AnimatedCardHostelBlock key={index} data={data} />
                        ))}
                    </View>
                    </View>
                    <View style={styles.hr} />
                    <View style={styles.subContainer}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#000000', textAlign: 'center' }}>Boys Hostel Blocks</Text>
                    <View style={styles.cardContainer}>
                        {boysHostelData && boysHostelData.map((data, index) => (
                        <AnimatedCardHostelBlock key={index} data={data} />
                        ))}
                    </View>
                    </View>
                </View>
            </ScrollView>
        }
    </>
  );
};

export default HostelBlocks;

const styles = StyleSheet.create({
  heading: {
    width: '100%',
    backgroundColor: '#ffb703',
    paddingVertical: 15,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 10,
    gap: 30,
  },
  subContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '90%',
    gap: 20,
    paddingVertical: 30,
    paddingHorizontal: 0,
  },
  hr: {
    width: '100%',
    height: 2,
    backgroundColor: '#495057',
    borderRadius: 100,
  },
});
