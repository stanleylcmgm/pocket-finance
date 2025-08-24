import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomDatePicker = ({ 
  visible, 
  onClose, 
  onDateSelect, 
  initialDate = new Date(),
  styles 
}) => {
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate();
  };

  const isSelectedDate = (year, month, day) => {
    return year === selectedYear && 
           month === selectedMonth && 
           day === selectedDay;
  };

  const handleDateSelect = (year, month, day) => {
    const selectedDate = new Date(year, month, day);
    onDateSelect(selectedDate);
    onClose();
  };

  const handleTodayPress = () => {
    const today = new Date();
    handleDateSelect(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const calendarDays = generateCalendarDays(selectedYear, selectedMonth);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.datePickerContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>

          {/* Month/Year Navigation */}
          <View style={styles.datePickerHeader}>
            <TouchableOpacity 
              onPress={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              style={styles.monthButton}
            >
              <Ionicons name="chevron-back" size={20} color="#007bff" />
            </TouchableOpacity>
            
            <Text style={styles.datePickerCurrentDate}>
              {monthNames[selectedMonth]} {selectedYear}
            </Text>
            
            <TouchableOpacity 
              onPress={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              style={styles.monthButton}
            >
              <Ionicons name="chevron-forward" size={20} color="#007bff" />
            </TouchableOpacity>
          </View>

          {/* Day Headers */}
          <View style={styles.calendarHeader}>
            {dayNames.map((day) => (
              <Text key={day} style={styles.calendarDayHeader}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  day === null && styles.calendarDayEmpty,
                  day !== null && isToday(selectedYear, selectedMonth, day) && styles.calendarDayToday,
                  day !== null && isSelectedDate(selectedYear, selectedMonth, day) && styles.calendarDaySelected,
                ]}
                onPress={() => {
                  if (day !== null) {
                    handleDateSelect(selectedYear, selectedMonth, day);
                  }
                }}
                disabled={day === null}
              >
                <Text style={[
                  styles.calendarDayText,
                  day === null && styles.calendarDayTextEmpty,
                  day !== null && isToday(selectedYear, selectedMonth, day) && styles.calendarDayTextToday,
                  day !== null && isSelectedDate(selectedYear, selectedMonth, day) && styles.calendarDayTextSelected,
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.datePickerButtons}>
            <TouchableOpacity
              style={[styles.datePickerButton, { backgroundColor: '#6c757d' }]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.datePickerButton, { backgroundColor: '#007bff' }]}
              onPress={handleTodayPress}
            >
              <Text style={styles.saveButtonText}>Today</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomDatePicker;
