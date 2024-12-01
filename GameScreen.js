import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { db, auth } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Accelerometer } from 'expo-sensors';
import { PanGestureHandler } from 'react-native-gesture-handler'; // For swipe gestures
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const GameScreen = ({ navigation }) => {
  const [countdown, setCountdown] = useState(3);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [currentAction, setCurrentAction] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [score, setScore] = useState(0);

  // List of possible actions
  const actions = [
    'Swipe Up',
    'Swipe Down',
    'Swipe Left',
    'Swipe Right',
    'Pinch In',
    'Pinch Out',
    'Tilt Up',
    'Tilt Down',
    'Tilt Left',
    'Tilt Right',
  ];

  useEffect(() => {
    startCountdown();
  }, []);

  useEffect(() => {
    // Set up accelerometer for tilt actions
    const accelerometerSubscription = Accelerometer.addListener(accelerometerData => {
      if (isUserTurn) {
        handleTiltAction(accelerometerData);
      }
    });

    return () => {
      accelerometerSubscription.remove();
    };
  }, [isUserTurn]);

  const startCountdown = () => {
    let counter = 3;
    const interval = setInterval(() => {
      setCountdown(counter);
      counter--;
      if (counter < 0) {
        clearInterval(interval);
        startGame();
      }
    }, 1000);
  };

  const startGame = () => {
    const firstAction = actions[Math.floor(Math.random() * actions.length)];
    setSequence([firstAction]);
    setIsUserTurn(false);
    displaySequence([firstAction]);
  };

  const displaySequence = (seq) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < seq.length) {
        setCurrentAction(seq[index]);
        index++;
      } else {
        clearInterval(interval);
        setCurrentAction('Your Turn');
        setIsUserTurn(true);
        setUserSequence([]);
      }
    }, 1000); // 1 second per action
  };

  const handleUserAction = (action) => {
    if (!isUserTurn) return;

    const updatedUserSequence = [...userSequence, action];
    setUserSequence(updatedUserSequence);

    const correctSequence = sequence.slice(0, updatedUserSequence.length);
    if (action !== correctSequence[updatedUserSequence.length - 1]) {
      endGame();
      return;
    }

    if (updatedUserSequence.length === sequence.length) {
      setScore(score + 1);
      const nextAction = actions[Math.floor(Math.random() * actions.length)];
      setSequence([...sequence, nextAction]);
      setIsUserTurn(false);
      displaySequence([...sequence, nextAction]);
    }
  };

  const endGame = async () => {
    setIsUserTurn(false);
    navigation.navigate('GameOver', { score, sequence });
    
    // Update High Score in Firestore
    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
    
      if (userDoc.exists() && userDoc.data().highScore < score) {
        await updateDoc(userRef, { highScore: score });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update high score.');
    }
  };

  // Detect Tilt Action
  const handleTiltAction = (data) => {
    const { x, y, z } = data;

    if (isUserTurn) {
      if (currentAction === 'Tilt Up' && y > .7) {
        handleUserAction('Tilt Up');
      } else if (currentAction === 'Tilt Down' && y < -.7) {
        handleUserAction('Tilt Down');
      } else if (currentAction === 'Tilt Left' && x < -.7) {
        handleUserAction('Tilt Left');
      } else if (currentAction === 'Tilt Right' && x > .7) {
        handleUserAction('Tilt Right');
      }
    }
  };

  // Handle Swipe Gestures
  const handleSwipeGesture = (event, direction) => {
    if (isUserTurn) {
      if (direction === 'up' && event.nativeEvent.translationY < -50) {
        handleUserAction('Swipe Up');
      } else if (direction === 'down' && event.nativeEvent.translationY > 50) {
        handleUserAction('Swipe Down');
      } else if (direction === 'left' && event.nativeEvent.translationX < -50) {
        handleUserAction('Swipe Left');
      } else if (direction === 'right' && event.nativeEvent.translationX > 50) {
        handleUserAction('Swipe Right');
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Countdown or Game Status */}
      {countdown > 0 ? (
        <Text style={styles.countdownText}>{countdown}</Text>
      ) : (
        <Text style={styles.actionText}>{currentAction}</Text>
      )}

      {/* Game Controls Removed */}
      {isUserTurn && (
        <View style={styles.controls}>
          {/* Swipe Gestures */}
          {['Swipe Up', 'Swipe Down', 'Swipe Left', 'Swipe Right'].map((action) => (
            <PanGestureHandler
              key={action}
              onGestureEvent={(event) => handleSwipeGesture(event, action.split(' ')[1].toLowerCase())}
            >
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{action}</Text>
              </View>
            </PanGestureHandler>
          ))}
        </View>
      )}
    </GestureHandlerRootView>
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
  countdownText: {
    fontSize: 48,
    color: '#32CD32',
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default GameScreen;
