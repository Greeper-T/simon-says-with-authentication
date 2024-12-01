import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

const AuthScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !username) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }

        try {
            // Check if the username is taken
            const usernameRef = doc(db, 'usernames', username);
            const usernameSnap = await getDoc(usernameRef);
            if (usernameSnap.exists()) {
                Alert.alert('Error', 'Username already taken!');
                return;
            }

            // Create the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save the username and high score
            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                highScore: 0,
            });

            // Reserve the username
            await setDoc(doc(db, 'usernames', username), { uid: user.uid });

            Alert.alert('Success', 'Account created!');
            navigation.navigate('Menu');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Email and password are required!');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Logged in!');
            navigation.navigate('Menu');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isSigningUp ? 'Sign Up' : 'Login'}</Text>
            {isSigningUp && (
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={isSigningUp ? handleSignup : handleLogin}
            >
                <Text style={styles.buttonText}>{isSigningUp ? 'Sign Up' : 'Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSigningUp(!isSigningUp)}>
                <Text style={styles.toggleText}>
                    {isSigningUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#32CD32',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#2E2E2E',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: '#FFF',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#32CD32',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    toggleText: {
        color: '#32CD32',
        fontSize: 14,
        marginTop: 10,
    },
});

export default AuthScreen;
