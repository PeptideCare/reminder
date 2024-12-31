import {
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useState } from 'react';

export default function App() {

    const [reminder, setReminder] = useState('');
    const [reminders, setReminders] = useState([]);

    const handleSave = () => {
        if (reminder.trim()) {
            setReminders([...reminders, reminder]);
            setReminder('');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView style={styles.innerContainer}>
                <Text style={styles.title}>Reminder Card</Text>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.remindersContainer}>
                    {reminders.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.reminderText}>{item}</Text>
                        </View>
                    ))}
                </ScrollView>

                <TextInput
                    style={styles.input}
                    placeholder="Enter your reminder here"
                    value={reminder}
                    onChangeText={setReminder}
                />

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save Reminder</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    scrollView: {
        width: '100%',
        marginBottom: 20,
    },
    remindersContainer: {
        alignItems: 'center',
    },
    card: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    reminderText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
    },
    input: {
        width: '90%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    button: {
        width: '90%',
        height: 50,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
