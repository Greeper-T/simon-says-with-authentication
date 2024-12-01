import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import { Accelerometer } from 'expo-sensors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const GameScreen = ({ navigation }) => {
  const [sequence, setSequence] = useState([]); 
  const [userSequence, setUserSequence] = useState([]); 
  const [isUserTurn, setIsUserTurn] = useState(false); 
  const [score, setScore] = useState(0); 
  const [currentAction, setCurrentAction] = useState(""); 
  const [lastAttemptedAction, setLastAttemptedAction] = useState(""); 

  const userSequenceRef = useRef(userSequence); 
  const sequenceRef = useRef(sequence);

  const actions = [
    'Swipe Up', 'Swipe Down', 'Swipe Left', 'Swipe Right',
    'Pinch In', 'Pinch Out'
  ];
//, 'Tilt Up', 'Tilt Down', 'Tilt Left', 'Tilt Right'
  const startGame = () => {
    setUserSequence([]);  // Reset user sequence at the start of a new game
    const initialAction = generateUniqueAction();
    setSequence([initialAction]);  // Set the initial sequence
    sequenceRef.current = [initialAction];
    setIsUserTurn(false);  // Ensure user can't act immediately
    displaySequence([initialAction]);  // Display the sequence to the user
  };

  const generateUniqueAction = () => {
    let action = actions[Math.floor(Math.random() * actions.length)];
    while (sequenceRef.current[sequenceRef.current.length - 1] === action) {
      action = actions[Math.floor(Math.random() * actions.length)];
    }
    return action;
  };

  const displaySequence = (seq) => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrentAction(seq[index]);  // Show the current action
      index++;
      if (index === seq.length) {
        clearInterval(interval);  // Stop the interval when the sequence is complete
        setTimeout(() => {
          setIsUserTurn(true);  // Now set the user's turn after the sequence is displayed
          setCurrentAction("Your Turn");
        }, 500);  // Add a small delay to make sure "Your Turn" shows after sequence
      }
    }, 1000); // Delay between each action in the sequence
  };
  
  const handleUserAction = (action) => {
    if (!isUserTurn) return;

    setLastAttemptedAction(action);

    if (action === sequenceRef.current[userSequenceRef.current.length]) {
      setUserSequence(prev => {
        const newSequence = [...prev, action];
        userSequenceRef.current = newSequence;
        return newSequence;
      });

      // Once the sequence is complete, add the next action
      if (userSequenceRef.current.length + 1 === sequenceRef.current.length) {
        const nextAction = generateUniqueAction();
        setSequence(prev => {
          const newSequence = [...prev, nextAction];
          sequenceRef.current = newSequence;
          return newSequence;
        });
        setScore(prevScore => prevScore + 1);
        setIsUserTurn(false);
        displaySequence([...sequenceRef.current, nextAction]);
      }
    } else {
      endGame();
    }
  };

  const handlePanGesture = (event) => {
    const { translationX, translationY, state } = event.nativeEvent;
    if (state === 4 && isUserTurn) {
      const swipeThreshold = 50;
      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > swipeThreshold) handleUserAction('Swipe Right');
        else if (translationX < -swipeThreshold) handleUserAction('Swipe Left');
      } else {
        if (translationY > swipeThreshold) handleUserAction('Swipe Down');
        else if (translationY < -swipeThreshold) handleUserAction('Swipe Up');
      }
    }
  };

  const handlePinchGesture = (event) => {
    const { scale } = event.nativeEvent;
    if (isUserTurn) {
      if (scale > 1.3) handleUserAction('Pinch Out');
      else if (scale < 0.7) handleUserAction('Pinch In');
    }
  };

  const handleTiltAction = (data) => {
    const { x, y, z } = data;
    if (isUserTurn) {
      if (y > 0.5) handleUserAction('Tilt Up');
      else if (y < -0.5) handleUserAction('Tilt Down');
      else if (x < -0.5) handleUserAction('Tilt Left');
      else if (x > 0.5) handleUserAction('Tilt Right');
    }
  };

  const endGame = () => {
    setIsUserTurn(false);
    Alert.alert("Game Over", `Your final score is: ${score}\nLast attempted action: ${lastAttemptedAction}`, [
      { text: 'OK', onPress: () => navigation.navigate('GameOver', { score, sequence }) },
    ]);
  };

  useEffect(() => {
    const accelerometerSubscription = Accelerometer.addListener(accelerometerData => {
      handleTiltAction(accelerometerData);
    });
    return () => {
      accelerometerSubscription.remove();
    };
  }, [userSequence]);

  useEffect(() => {
    startGame();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Simon Says Game</Text>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.action}>{currentAction}</Text>

        <View style={styles.gestureContainer}>
          <PanGestureHandler onGestureEvent={handlePanGesture}>
            <View style={styles.gestureBox}>
              <Text style={styles.gestureText}>Swipe Here</Text>
            </View>
          </PanGestureHandler>

          <PinchGestureHandler onGestureEvent={handlePinchGesture}>
            <View style={styles.gestureBox}>
              <Text style={styles.gestureText}>Pinch Here</Text>
            </View>
          </PinchGestureHandler>
        </View>

        <View style={styles.userActionsContainer}>
          <Text style={styles.userActionsTitle}>Your Actions:</Text>
          <ScrollView horizontal style={styles.userActions}>
            {userSequence.map((action, index) => (
              <View key={index} style={styles.actionBubble}>
                <Text style={styles.actionText}>{action}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B1B', // Dark background
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#66FF66', // Greenish text color
    marginBottom: 10,
  },
  score: {
    fontSize: 24,
    marginVertical: 20,
    color: '#A0A0A0', // Light gray text for score
  },
  action: {
    fontSize: 30,
    marginTop: 20,
    color: '#66FF66', // Greenish action text
    fontStyle: 'italic',
  },
  gestureContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
  gestureBox: {
    width: 160,
    height: 160,
    backgroundColor: '#333', // Dark gesture box
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gestureText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#66FF66', // Greenish text color for gestures
  },
  userActionsContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  userActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A0A0A0', // Light gray for user actions
  },
  userActions: {
    flexDirection: 'row',
  },
  actionBubble: {
    backgroundColor: '#444', // Dark action bubble
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  actionText: {
    fontSize: 16,
    color: '#66FF66', // Greenish action text
  },
});

export default GameScreen;
