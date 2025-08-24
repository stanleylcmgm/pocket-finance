import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomDatePicker = ({ 
  visible, 
  onClose, 
  onDateSelect, 
  initialDate = new Date(),
  inline = false
}) => {
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());

  // Update internal state when initialDate changes
  useEffect(() => {
    if (initialDate) {
      setSelectedYear(initialDate.getFullYear());
      setSelectedMonth(initialDate.getMonth());
      setSelectedDay(initialDate.getDate());
    }
  }, [initialDate]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
    console.log('Date selected in picker:', selectedDate);
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDay(day);
    onDateSelect(selectedDate);
  };

  const handleTodayPress = () => {
    const today = new Date();
    handleDateSelect(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const calendarDays = generateCalendarDays(selectedYear, selectedMonth);

  if (!visible && !inline) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Date</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Month/Year Navigation */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={20} color="#007bff" />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>
          {monthNames[selectedMonth]} {selectedYear}
        </Text>
        
        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={20} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      <View style={styles.dayHeaders}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text key={`day-header-${index}`} style={styles.dayHeader}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          const isCurrentDay = isToday(selectedYear, selectedMonth, day);
          const isSelected = isSelectedDate(selectedYear, selectedMonth, day);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                day === null && { backgroundColor: 'transparent' },
                isCurrentDay && styles.todayButton,
                isSelected && styles.selectedButton,
              ]}
              onPress={() => {
                if (day !== null) {
                  handleDateSelect(selectedYear, selectedMonth, day);
                }
              }}
              disabled={day === null}
            >
              <Text style={[
                styles.dayText,
                day === null && { color: 'transparent' },
                isCurrentDay && styles.todayText,
                isSelected && styles.selectedText,
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={onClose}
        >
          <Text style={styles.actionText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.todayActionButton]}
          onPress={handleTodayPress}
        >
          <Text style={styles.actionText}>Today</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  navButton: {
    padding: 8,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayButton: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderRadius: 4,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  todayButton: {
    backgroundColor: '#e3f2fd',
  },
  todayText: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  todayActionButton: {
    backgroundColor: '#007bff',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CustomDatePicker;