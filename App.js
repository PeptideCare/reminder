import {
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import mainStyles from './styles/mainStyles';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

    const [reminder, setReminder] = useState('');
    const [reminders, setReminders] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const loadReminders = async () => {
            try {
                const storedReminders = await AsyncStorage.getItem('reminders');
                if (storedReminders) {
                    setReminders(JSON.parse(storedReminders));
                }
            } catch (error) {
                console.error('Failed to load reminders:', error);
            }
        };
        loadReminders();
    }, []);

    useEffect(() => {
        const saveReminders = async () => {
            try {
                await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
            } catch (error) {
                console.error('Failed to save reminders:', error);
            }
        };
        saveReminders();
    }, [reminders]);

    const handleSave = () => {
        if (reminder.trim()) {
            const newReminder = {
                text: reminder,
                time: date.toLocaleString(),
            };
            setReminders([...reminders, newReminder]);
            setReminder('');
            setDate(new Date());
        }
    };

    const handleDelete = (index) => {
        const newReminders = reminders.filter((_, i) => i !== index);
        setReminders(newReminders);
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    return (
        <KeyboardAvoidingView
            style={mainStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView style={mainStyles.innerContainer}>
                <Text style={mainStyles.title}>Reminder Card</Text>

                <ScrollView style={mainStyles.scrollView} contentContainerStyle={mainStyles.remindersContainer}>
                    {reminders.map((item, index) => (
                        <View key={index} style={mainStyles.card}>
                            <View>
                                <Text style={mainStyles.reminderText}>{item.text}</Text>
                                <Text style={mainStyles.reminderTime}>Reminder Time : {item.time}</Text>
                            </View>
                            <TouchableOpacity style={mainStyles.deleteButton} onPress={() => handleDelete(index)}>
                                <Text style={mainStyles.deleteButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                <TextInput
                    style={mainStyles.input}
                    placeholder="Enter your reminder here"
                    value={reminder}
                    onChangeText={setReminder}
                />

                <TouchableOpacity style={mainStyles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <Text style={mainStyles.dateButtonText}>Reminder Time: {date.toLocaleString()}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="datetime"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <TouchableOpacity style={mainStyles.button} onPress={handleSave}>
                    <Text style={mainStyles.buttonText}>Save Reminder</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}


