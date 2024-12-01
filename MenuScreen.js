import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const MenuScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUsername(userDoc.data().username);
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch user data.');
            }
        };

        fetchUsername();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Auth');
        } catch (error) {
            Alert.alert('Error', 'Failed to sign out.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
                <Text style={styles.usernameText}>Hi, {username}!</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Simon Says</Text>

            {/* Buttons */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('GameScreen')}
            >
                <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Leaderboard')}
            >
                <Text style={styles.buttonText}>Leaderboard</Text>
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
    topBar: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    signOutText: {
        color: '#32CD32',
        fontSize: 16,
        fontWeight: 'bold',
    },
    usernameText: {
        color: '#FFF',
        fontSize: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#32CD32',
        marginBottom: 40,
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: '#32CD32',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MenuScreen;
