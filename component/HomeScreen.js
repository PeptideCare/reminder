import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import styles from "../styles/homeScreenStyle";

const HomeScreen = ({ navigation }) => {
    const [reminders, setReminders] = useState([]);

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

    const handleDelete = async (index) => {
        const newReminders = reminders.filter((_, i) => i !== index);
        setReminders(newReminders);
        try {
            await AsyncStorage.setItem('reminders', JSON.stringify(newReminders));
        } catch (error) {
            console.error('Failed to save reminders:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerSpacer} />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.remindersContainer}>
                {reminders.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <View>
                            <Text style={styles.reminderText}>{item.text}</Text>
                            {item.time !== '' && (<Text style={styles.reminderTime}>{item.time}</Text>)}
                        </View>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
                            <Text style={styles.deleteButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Add Reminder', { setReminders })}>
                <Text style={styles.buttonText}>Add Reminder</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default HomeScreen;