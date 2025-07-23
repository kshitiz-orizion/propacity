import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { logout } from '../store/authSlice';
import { useDispatch } from 'react-redux';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Preview: { title: string; content: string; image: string | null };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const DetailsScreen = ({navigation}:Props) => {
    const dispatch = useDispatch()
    const handleLogout = () =>{
        dispatch(logout());
        navigation.navigate('Login')
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.commentButton} onPress={handleLogout}>
                <Text style={styles.commentButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentButton: {
        marginTop: 10,
        paddingVertical: 10,
        backgroundColor: '#007bff',
        borderRadius: 6,
        alignItems: 'center',
        width:100
    },
    commentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})

export default DetailsScreen