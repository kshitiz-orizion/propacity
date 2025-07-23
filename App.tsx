// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './src/screens/LoginScreen';
import TabNavigator from './src/hooks/TabNavigator';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

import { ActivityIndicator } from 'react-native-paper';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [loading,setLoading] = useState(true);
  const [authenticated,setAuthenticated] = useState<string | null>();


  useEffect(()=>{
    fetchLogin()
  },[])

  const fetchLogin = async() =>{
    const value = await AsyncStorage.getItem('isAuthenticated');
    setAuthenticated(value)
    setLoading(false);
  }

  if(loading) return <ActivityIndicator  style={{ marginTop: 40 }}/>
  return (
    <NavigationContainer>
      <Provider store={store} >
        <Stack.Navigator initialRouteName={authenticated ? "Home" : "Login"}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Welcome to Propacity", headerShown:false}} />
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={{ title: 'Welcome', headerShown: false }}
          />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}
