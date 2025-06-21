import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentAttendance } from '../../services/operations/StudentAPI';
import { useFocusEffect } from '@react-navigation/native';

const AttendanceHistory = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const getMonthYearString = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(selectedMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedMonth(nextMonth);
  };

  const getAttendanceStatus = (date) => {
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const attendance = attendanceData.find((item) => item.date === formattedDate);
    return attendance ? attendance.status : 'N/A';
  };

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);
  const toast = useToast();
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchAttendanceData = async () => {
    const response = await dispatch(getStudentAttendance(token, toast));
    setAttendanceData(response);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAttendanceData();
    }, [token, toast])
  );

  const getBackgroundColor = (status) => {
    switch (status) {
      case 'present':
        return 'lightgreen';
      case 'absent':
        return 'salmon';
      default:
        return '#f0f0f0';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
    const calendar = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i);
      const attendanceStatus = getAttendanceStatus(currentDate);
      const backgroundColor = getBackgroundColor(attendanceStatus);
      calendar.push(
        <View key={i} style={[styles.calendarCell, { backgroundColor }]}>
          <Text style={styles.dayText}>{currentDate.getDate()}</Text>
        </View>
      );
    }
    return calendar;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{display:"flex", flexWrap:"wrap",marginVertical:30,flexDirection:"row", justifyContent:"space-evenly", alignItems:"center", gap:15}}>
        <View style={styles.legendContainer}>
          <View style={[styles.legendDot, { backgroundColor: 'lightgreen' }]} />
          <Text style={styles.legendText}>Present Days</Text>
        </View>
        <View style={styles.legendContainer}>
          <View style={[styles.legendDot, { backgroundColor: 'salmon' }]} />
          <Text style={styles.legendText}>Absent Days</Text>
        </View>
        <View style={styles.legendContainer}>
          <View style={[styles.legendDot, { backgroundColor: '#f0f0f0' }]} />
          <Text style={styles.legendText}>Not Marked</Text>
        </View>
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.arrowText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>{getMonthYearString(selectedMonth)}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.arrowText}>&gt;</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.calendar}>{renderCalendar()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  arrowText: {
    fontSize: 20,
    color: '#fff',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"black"
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14%',
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dayText: {
    fontSize: 16,
    color:"black"
  },
  goBackButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignSelf: 'center',
  },
  goBackText: {
    color: '#fff',
    fontSize: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 5,
  },
  legendText: {
    fontSize: 16,
    color: "#6c757d"
  },
});

export default AttendanceHistory;
