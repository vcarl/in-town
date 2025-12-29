import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import type { Contact } from '../types/contact';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface SwipeCardProps {
  contact: Contact;
  onSwipeLeft: (contact: Contact) => void;
  onSwipeRight: (contact: Contact) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ contact, onSwipeLeft, onSwipeRight }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Swipe detected
        const direction = event.translationX > 0 ? 'right' : 'left';
        
        // Animate card off screen
        translateX.value = withTiming(
          direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH,
          { duration: 300 }
        );
        opacity.value = withTiming(0, { duration: 300 });
        
        // Call callback after animation
        setTimeout(() => {
          if (direction === 'right') {
            runOnJS(onSwipeRight)(contact);
          } else {
            runOnJS(onSwipeLeft)(contact);
          }
        }, 300);
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });
  
  const animatedStyle = useAnimatedStyle(() => {
    const rotation = translateX.value / 20;
    
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
      opacity: opacity.value,
    };
  });
  
  const leftIndicatorStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -50 ? withTiming(1) : withTiming(0),
  }));
  
  const rightIndicatorStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 50 ? withTiming(1) : withTiming(0),
  }));
  
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Animated.View style={[styles.indicator, styles.leftIndicator, leftIndicatorStyle]}>
          <Text style={styles.indicatorText}>NOPE</Text>
        </Animated.View>
        
        <Animated.View style={[styles.indicator, styles.rightIndicator, rightIndicatorStyle]}>
          <Text style={styles.indicatorText}>VISIT</Text>
        </Animated.View>
        
        <View style={styles.content}>
          <Text style={styles.name}>{contact.name}</Text>
          
          <View style={styles.infoContainer}>
            {contact.relationship && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Relationship:</Text>
                <Text style={styles.value}>{contact.relationship}</Text>
              </View>
            )}
            
            {contact.birthday && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Birthday:</Text>
                <Text style={styles.value}>{contact.birthday}</Text>
              </View>
            )}
            
            {contact.address && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{contact.address}</Text>
              </View>
            )}
            
            {contact.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{contact.phone}</Text>
              </View>
            )}
            
            {(contact.instagram || contact.twitter || contact.facebook) && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Socials:</Text>
                <View style={styles.socials}>
                  {contact.instagram && <Text style={styles.social}>📷 {contact.instagram}</Text>}
                  {contact.twitter && <Text style={styles.social}>🐦 {contact.twitter}</Text>}
                  {contact.facebook && <Text style={styles.social}>📘 {contact.facebook}</Text>}
                </View>
              </View>
            )}
          </View>
          
          <Text style={styles.instruction}>← Swipe left (nope) or right (visit) →</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: 500,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 12,
  },
  infoRow: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  socials: {
    gap: 4,
  },
  social: {
    fontSize: 14,
    color: '#000',
    marginTop: 2,
  },
  instruction: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 'auto',
  },
  indicator: {
    position: 'absolute',
    top: 40,
    padding: 10,
    borderRadius: 10,
    borderWidth: 3,
    zIndex: 1,
  },
  leftIndicator: {
    left: 40,
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  rightIndicator: {
    right: 40,
    borderColor: '#4ECDC4',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  indicatorText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
