import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_BAR_MARGIN = 24; // More breathing room for elegance

const ELEGANT_SPRING = {
  damping: 22,
  stiffness: 280,
  mass: 0.4,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  
  const TAB_BAR_WIDTH = windowWidth - (TAB_BAR_MARGIN * 2);
  const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;
  
  const translateX = useSharedValue(state.index * TAB_WIDTH);
  const containerScale = useSharedValue(1);

  useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, ELEGANT_SPRING);
  }, [state.index, TAB_WIDTH, translateX]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  return (
    <Animated.View style={[
      styles.container,
      animatedContainerStyle,
      { 
        bottom: Math.max(insets.bottom, 20),
        width: TAB_BAR_WIDTH,
      }
    ]}>
      {/* Ultra-minimalist Background Blur */}
      <View style={styles.blurOverlay} />
      
      <View style={styles.content}>
        {/* The Soft Aura Glow Background */}
        <Animated.View style={[styles.activePill, animatedPillStyle, { width: TAB_WIDTH }]}>
          <LinearGradient
            colors={['rgba(179, 146, 240, 0.15)', 'transparent']}
            style={styles.pillGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </Animated.View>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            containerScale.value = withSequence(
              withTiming(0.97, { duration: 80 }),
              withSpring(1, ELEGANT_SPRING)
            );

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={1}
            >
              <TabIcon 
                isFocused={isFocused} 
                options={options}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

// Memoized TabIcon for performance and stability
const TabIcon = React.memo(({ isFocused, options }: any) => {
  const Icon = options.tabBarIcon;
  const scale = useSharedValue(isFocused ? 1.15 : 1);
  const opacity = useSharedValue(isFocused ? 1 : 0.4);
  const dotScale = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1, ELEGANT_SPRING);
    opacity.value = withTiming(isFocused ? 1 : 0.4, { duration: 200 });
    dotScale.value = withSpring(isFocused ? 1 : 0, ELEGANT_SPRING);
  }, [isFocused, scale, opacity, dotScale]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotScale.value,
  }));

  return (
    <View style={styles.iconWrapper}>
      <Animated.View style={animatedIconStyle}>
        {Icon && <Icon 
          focused={isFocused} 
          color={isFocused ? '#FFFFFF' : theme.colors.text.muted} 
          size={24} 
        />}
      </Animated.View>
      
      {/* Minimalist Active Dot */}
      <Animated.View style={[styles.activeDot, animatedDotStyle]} />
      
      {/* Soft Aura Glow Layer */}
      {isFocused && (
        <View style={styles.auraGlow} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    height: 64,
    backgroundColor: 'rgba(13, 14, 21, 0.8)', // Deep Midnight Void
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
    overflow: 'hidden',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexDirection: 'row',
    height: '100%',
    zIndex: 2,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  pillGradient: {
    width: '60%',
    height: '80%',
    borderRadius: 20,
  },
  iconWrapper: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  activeDot: {
    position: 'absolute',
    bottom: 12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  auraGlow: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    opacity: 0.15,
    transform: [{ scale: 2.2 }],
    zIndex: -1,
  }
});
