import React from 'react';
import { Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ThreatCard } from './ThreatCard';
import { Threat } from '@/lib/store/threats';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface SwipeableThreatCardProps {
  threat: Threat;
  onSwipeLeft: (id: string) => void;
  onSwipeRight: (id: string) => void;
  enabled?: boolean;
}

export function SwipeableThreatCard({ threat, onSwipeLeft, onSwipeRight, enabled = true }: SwipeableThreatCardProps) {
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const gesture = Gesture.Pan()
    .enabled(enabled)
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x;
    })
    .onEnd(() => {
       if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
          if (translateX.value > 0) {
            // Swipe Right (Takedown)
            runOnJS(onSwipeRight)(threat.id);
            runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
            translateX.value = withSpring(SCREEN_WIDTH * 1.5);
          } else {
            // Swipe Left (False Positive)
            runOnJS(onSwipeLeft)(threat.id);
            runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
            translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
          }
       } else {
         translateX.value = withSpring(0);
       }
    });


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
        { translateX: translateX.value },
        { rotate: `${translateX.value / 20}deg` }
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle, { position: 'absolute', width: '100%', zIndex: 100 }]}>
        <ThreatCard {...threat} />
      </Animated.View>
    </GestureDetector>
  );
}
