import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Adjust the path to your Firebase config

const LeaderboardScreen = ({ navigation }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [userRank, setUserRank] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Fetch top 100 players ordered by high score, descending
                const leaderboardQuery = query(
                    collection(db, 'users'),
                    orderBy('highScore', 'desc'),
                    limit(100)
                );
                const querySnapshot = await getDocs(leaderboardQuery);

                const leaderboardData = [];
                querySnapshot.forEach((doc) => {
                    leaderboardData.push({ id: doc.id, ...doc.data() });
                });

                setLeaderboard(leaderboardData);

                // Check if the current user is in the leaderboard
                const currentUser = auth.currentUser;
                const userIndex = leaderboardData.findIndex((user) => user.id === currentUser.uid);
                setUserRank(userIndex !== -1 ? userIndex + 1 : null);
            } catch (error) {
                Alert.alert('Error', 'Failed to load leaderboard');
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {leaderboard.map((player, index) => (
                    <View
                        key={player.id}
                        style={[
                            styles.playerItem,
                            userRank === index + 1 && styles.userHighlight, // Highlight the user's rank
                        ]}
                    >
                        <Text style={styles.rank}>{index + 1}</Text>
                        <Text style={styles.username}>{player.username}</Text>
                        <Text style={styles.score}>{player.highScore}</Text>
                    </View>
                ))}

                {/* Display empty spots if there are less than 100 players */}
                {leaderboard.length < 100 &&
                    Array.from({ length: 100 - leaderboard.length }).map((_, index) => (
                        <View key={index} style={styles.emptySpot}>
                            <Text style={styles.emptyText}>-------</Text>
                        </View>
                    ))}
            </ScrollView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Menu')}>
                <Text style={styles.backButtonText}>Back to Menu</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        paddingTop: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    playerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#2C2C2C',
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
        width: '100%',
    },
    rank: {
        color: '#FFF',
        fontSize: 20,
        width: '10%',
        textAlign: 'center',
    },
    username: {
        color: '#FFF',
        fontSize: 18,
        width: '60%',
    },
    score: {
        color: '#32CD32',
        fontSize: 18,
        width: '30%',
        textAlign: 'center',
    },
    userHighlight: {
        backgroundColor: '#32CD32', // Highlight user's rank with green
    },
    emptySpot: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#2C2C2C',
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
        width: '100%',
    },
    emptyText: {
        color: '#777',
        fontSize: 18,
        textAlign: 'center',
        width: '100%',
    },
    backButton: {
        marginTop: 30,
        backgroundColor: '#32CD32',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LeaderboardScreen;
