import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import * as Notifications from 'expo-notifications';
import styles from '../styles/homeScreenStyle';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const HomeScreen = ({ navigation }) => {
    const [reminders, setReminders] = useState([]);
    const [expoPushToken, setExpoPushToken] = useState(null);

    // 알림 승인 안 되어있을 때 alert
    useEffect(() => {
        (async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Please allow the notification permission!');
            }
        })();
    }, []);

    // 알림 승인 요청
    useEffect(() => {
        const registerForPushNotificationsAsync = async () => {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);
        };

        registerForPushNotificationsAsync();
    }, []);


    // storage에서 list 가져옴
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

    // reminder time에 알림
    useEffect(() => {
        // Schedule notifications for all reminders
        reminders.forEach(scheduleNotification);
    }, [reminders]);

    const handleDelete = async (index) => {
        const newReminders = reminders.filter((_, i) => i !== index);
        setReminders(newReminders);
        try {
            await AsyncStorage.setItem('reminders', JSON.stringify(newReminders));
        } catch (error) {
            console.error('Failed to save reminders:', error);
        }
    };

    const scheduleNotification = async (reminder) => {
        const reminderTime = reminder.time;
        const currentTime = new Date().toLocaleString();

        console.log('reminder time : ', {reminderTime});
        console.log('current time  : ', {currentTime});

        // Ensure the reminder time is in the future
        if (reminderTime < currentTime) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Reminder',
                    body: reminder.text,
                },
                trigger: {
                    second: reminderTime,
                },
            });
            console.log('Notification scheduled for:', reminderTime);
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
                            {item.time !== '' && (
                                <Text style={styles.reminderTime}>{item.time}</Text>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDelete(index)}
                        >
                            <Text style={styles.deleteButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate('Add Reminder', { setReminders })
                }
            >
                <Text style={styles.buttonText}>Add Reminder</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default HomeScreen;