import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GameOverScreen = ({ navigation, route }) => {
    const { score, sequence } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game Over</Text>
            <Text style={styles.score}>Your Score: {score}</Text>

            <Text style={styles.sequenceTitle}>Correct Sequence:</Text>
            <View style={styles.sequenceContainer}>
                {sequence.map((action, index) => (
                    <Text key={index} style={styles.sequenceItem}>
                        {index + 1}. {action}
                    </Text>
                ))}
            </View>

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.navigate('Menu')}
            >
                <Text style={styles.menuButtonText}>Back to Menu</Text>
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
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    score: {
        fontSize: 24,
        color: '#32CD32',
        marginBottom: 20,
    },
    sequenceTitle: {
        fontSize: 20,
        color: '#FFF',
        marginBottom: 10,
    },
    sequenceContainer: {
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
        padding: 10,
        width: '100%',
        maxHeight: 200,
        overflow: 'scroll',
    },
    sequenceItem: {
        fontSize: 18,
        color: '#FFF',
        marginBottom: 5,
    },
    menuButton: {
        marginTop: 30,
        backgroundColor: '#32CD32',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    menuButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default GameOverScreen;
