import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import PostScreen from '../screens/PostScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import ProtectedRoute from './ProtectedRoute';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = '';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={ProtectedRoute(HomeScreen)} options={{title: "Feed"}}/>
            <Tab.Screen name="Post" component={ProtectedRoute(PostScreen)} options={{title: "Post"}}/>
            <Tab.Screen name="Settings" component={ProtectedRoute(DetailsScreen)} options={{title:"Settings"}}/>
        </Tab.Navigator>
    )
}
