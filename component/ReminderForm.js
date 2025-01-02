import React, { useState } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity, View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from "../styles/reminderStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReminderForm = ({ navigation, route }) => {
    const [reminder, setReminder] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = async () => {
        if (reminder.trim()) {
            const newReminder = {
                text: reminder,
                time: date.toLocaleString(),
            };

            try {
                const storedReminders = await AsyncStorage.getItem('reminders');
                const reminders = storedReminders ? JSON.parse(storedReminders) : [];
                reminders.push(newReminder);
                await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
            } catch (error) {
                console.error('Error saving reminder to AsyncStorage:', error);
            }

            route.params.setReminders((prevReminders) => [...prevReminders, newReminder]);
            navigation.goBack();
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerSpacer} />

            <TextInput
                style={styles.input}
                placeholder="Enter your reminder"
                value={reminder}
                onChangeText={setReminder}
            />

            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateButtonText}>Set Reminder Time</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="datetime"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Reminder</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ReminderForm;