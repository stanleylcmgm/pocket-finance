import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Platform,
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

  console.log('DatePicker render - visible:', visible, 'inline:', inline, 'Platform:', Platform.OS);
  
  if (!visible && !inline) {
    console.log('DatePicker not rendering - not visible and not inline');
    return null;
  }

  const renderDatePicker = () => (
    <View style={inline ? styles.inlineContainer : styles.modalContainer}>
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

  // Inline mode - render directly
  if (inline) {
    return renderDatePicker();
  }

  // Modal mode - using same config as working month picker
  console.log('DatePicker rendering MODAL mode');
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {renderDatePicker()}
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Modal styles - using same pattern as working month picker
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 0,
    width: Math.min(width - 40, 350),
    maxHeight: height * 0.8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalContainer: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  inlineContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    letterSpacing: 0.3,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
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
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderRadius: 8,
    margin: 1,
  },
  dayText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  todayButton: {
    backgroundColor: '#e8f4fd',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  todayText: {
    color: '#007bff',
    fontWeight: '600',
  },
  selectedButton: {
    backgroundColor: '#007bff',
    ...Platform.select({
      ios: {
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  selectedText: {
    color: 'white',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  todayActionButton: {
    backgroundColor: '#007bff',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

export default CustomDatePicker;