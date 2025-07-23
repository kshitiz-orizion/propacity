import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Text, View } from 'react-native';

import { useIsFocused } from '@react-navigation/native';


const ProtectedRoute = (WrappedComponent: React.ComponentType<any>) => {

  const isFocused = useIsFocused();
  
  const Wrapper: React.FC = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchIsLoggedIn = async () => {
        const value = await AsyncStorage.getItem('isAuthenticated');
        setIsLoggedIn(value === 'true'); // convert string to boolean
        setLoading(false);
      };
      fetchIsLoggedIn();
    }, []);

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (!isLoggedIn) {
      return <Text style={{ marginTop: 40, textAlign: 'center' }}>Not Authenticated</Text>;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default ProtectedRoute;
