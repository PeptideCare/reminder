import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ReminderForm from './component/ReminderForm';
import HomeScreen from "./component/HomeScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Add Reminder" component={ReminderForm} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


