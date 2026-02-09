import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export interface Threat {
  id: string;
  domain: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  source: string;
  timestamp: string;
}

interface TakedownCardProps {
  threat: Threat;
  onSwipeLeft: (id: string) => void;
  onSwipeRight: (id: string) => void;
}

export default function TakedownCard({ threat, onSwipeLeft, onSwipeRight }: TakedownCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x;
      translateY.value = event.translationY + context.value.y;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        // Swipe completed
        const direction = translateX.value > 0 ? 'right' : 'left';

        // Animate off screen
        translateX.value = withTiming(direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5, {}, () => {
          if (direction === 'right') {
            runOnJS(onSwipeRight)(threat.id);
          } else {
            runOnJS(onSwipeLeft)(threat.id);
          }
        });

        // Haptic feedback (if supported)
        if (Platform.OS !== 'web') {
           runOnJS(Haptics.notificationAsync)(
             direction === 'right'
               ? Haptics.NotificationFeedbackType.Success
               : Haptics.NotificationFeedbackType.Warning
           );
        }

      } else {
        // Reset
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  // Overlay styles for swipe feedback
  const rightSwipeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1]),
  }));

  const leftSwipeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0]),
  }));

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-900 border-red-500';
      case 'HIGH': return 'bg-orange-900 border-orange-500';
      case 'MEDIUM': return 'bg-yellow-900 border-yellow-500';
      default: return 'bg-gray-800 border-gray-600';
    }
  };

  const getThreatTextColor = (level: string) => {
     switch (level) {
      case 'CRITICAL': return 'text-red-500';
      case 'HIGH': return 'text-orange-500';
      case 'MEDIUM': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
           {/* Card Content */}
           <View className={`w-full h-full rounded-2xl border-2 p-6 justify-between ${getThreatColor(threat.threatLevel)}`}>

              {/* Header */}
              <View>
                <View className="flex-row justify-between items-center mb-4">
                   <Text className={`font-black text-xs tracking-widest border border-white/20 px-2 py-1 rounded ${getThreatTextColor(threat.threatLevel)}`}>
                     {threat.threatLevel} THREAT
                   </Text>
                   <FontAwesome name="warning" size={20} color="white" />
                </View>
                <Text className="text-white text-3xl font-bold mb-1" numberOfLines={1} adjustsFontSizeToFit>
                  {threat.domain}
                </Text>
                <Text className="text-gray-300 text-sm font-mono">
                  SRC: {threat.source}
                </Text>
              </View>

              {/* Body */}
              <View className="flex-1 justify-center py-8">
                 <View className="bg-black/30 p-4 rounded-lg">
                    <Text className="text-gray-400 text-xs font-mono mb-2">DETECTED AT:</Text>
                    <Text className="text-white font-mono">{threat.timestamp}</Text>

                    <View className="h-[1px] bg-white/10 my-4" />

                    <Text className="text-gray-400 text-xs font-mono mb-2">VECTOR ANALYSIS:</Text>
                    <Text className="text-white font-mono text-xs">
                      High probability of credential harvesting.
                      Domain registered &lt; 24h ago.
                    </Text>
                 </View>
              </View>

              {/* Footer / Instructions */}
              <View className="flex-row justify-between items-center px-2">
                 <View className="items-center">
                    <FontAwesome name="arrow-left" size={16} color="#fbbf24" />
                    <Text className="text-yellow-400 text-[10px] font-bold mt-1">IGNORE</Text>
                 </View>

                 <View className="bg-white/10 px-4 py-2 rounded-full">
                    <Text className="text-white/50 text-xs font-bold">SWIPE TO ACT</Text>
                 </View>

                 <View className="items-center">
                    <FontAwesome name="arrow-right" size={16} color="#ef4444" />
                    <Text className="text-red-400 text-[10px] font-bold mt-1">TAKEDOWN</Text>
                 </View>
              </View>

              {/* Swipe Overlays */}
              <Animated.View style={[styles.overlay, styles.rightOverlay, rightSwipeStyle]}>
                 <Text className="text-red-500 text-4xl font-black border-4 border-red-500 px-4 py-2 rounded transform -rotate-12">
                   PURGE
                 </Text>
              </Animated.View>

              <Animated.View style={[styles.overlay, styles.leftOverlay, leftSwipeStyle]}>
                 <Text className="text-yellow-500 text-4xl font-black border-4 border-yellow-500 px-4 py-2 rounded transform rotate-12">
                   SKIP
                 </Text>
              </Animated.View>

           </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  overlay: {
    position: 'absolute',
    top: 40,
    zIndex: 10,
  },
  rightOverlay: {
    left: 40,
  },
  leftOverlay: {
    right: 40,
  },
});
