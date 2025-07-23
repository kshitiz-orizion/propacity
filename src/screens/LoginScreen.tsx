import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: any;
  Login: any;
  Preview: { title: string; content: string; image: string | null };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault(); // Optional: prevent back navigation
    });
    return unsubscribe;
  }, [navigation]);

  const onLogin = () => {
    let hasError = false;

    if (username.trim() === '') {
      setUsernameError(true);
      hasError = true;
    } else {
      setUsernameError(false);
    }

    if (password.trim() === '') {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (hasError) {
      return;
    }

    if (username === 'admin' && password === 'admin') {
      dispatch(loginSuccess());
      Alert.alert('Success', 'Logged in!');
      navigation.navigate('Home');
      setUsername('');
      setPassword('');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={[styles.input, usernameError && styles.errorInput]}
        placeholder={usernameError ? "Username cannot be empty" : "Username"}
        placeholderTextColor={usernameError ? 'red' : '#888'}
        value={username}
        autoCapitalize="none"
        onChangeText={(text) => {
          setUsername(text);
          if (usernameError) setUsernameError(false);
        }}
      />

      <TextInput
        style={[styles.input, passwordError && styles.errorInput]}
        placeholder={passwordError ? "Password cannot be empty" : "Password"}
        placeholderTextColor={passwordError ? 'red' : '#888'}
        value={password}
        secureTextEntry
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) setPasswordError(false);
        }}
      />


      <Button title="Login" onPress={onLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
});
