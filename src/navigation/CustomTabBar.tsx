import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import { theme } from '../theme/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const ELEGANT_SPRING = {
  damping: 24,
  stiffness: 280,
  mass: 0.6,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const TACTILE_SPRING = {
  damping: 18,
  stiffness: 350,
  mass: 0.4,
};

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  
  const TAB_WIDTH = windowWidth / state.routes.length;
  
  const translateX = useSharedValue(state.index * TAB_WIDTH);

  useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, ELEGANT_SPRING);
  }, [state.index, TAB_WIDTH, translateX]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const BAR_HEIGHT = 64; // Sleeker, minimal height

  return (
    <View style={[
      styles.container,
      { 
        height: BAR_HEIGHT + insets.bottom,
        paddingBottom: insets.bottom,
        width: windowWidth,
      }
    ]}>
      {/* Premium Glassmorphism Effect */}
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={25}
        reducedTransparencyFallbackColor={theme.colors.background}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(13, 14, 21, 0.75)' }]} />

      {/* Minimal Sliding Indicator */}
      <Animated.View style={[styles.activeIndicatorContainer, animatedIndicatorStyle, { width: TAB_WIDTH }]}>
        <View style={styles.topIndicatorDash} />
      </Animated.View>

      <View style={styles.content}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              options={options}
              navigation={navigation}
            />
          );
        })}
      </View>
    </View>
  );
};

// Extracted TabItem for intense tactile interactions
const TabItem = React.memo(({ route, isFocused, options, navigation }: any) => {
  const Icon = options.tabBarIcon;
  
  // Interaction shared values
  const scale = useSharedValue(isFocused ? 1 : 0.95);
  const opacity = useSharedValue(isFocused ? 1 : 0.5);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSpring(1, TACTILE_SPRING);
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(0.95, TACTILE_SPRING);
      opacity.value = withTiming(0.5, { duration: 200 });
    }
  }, [isFocused, scale, opacity]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * pressScale.value }
    ],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.85, TACTILE_SPRING); // Minimal squish effect
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, TACTILE_SPRING); // Spring back
  };

  const onPress = () => {
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
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
        {Icon && <Icon 
          focused={isFocused} 
          color={isFocused ? '#FFFFFF' : theme.colors.text.secondary} 
          size={24} 
          weight={isFocused ? "fill" : "regular"} 
        />}
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    // Elegant shadow dropping downward
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    flex: 1,
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeIndicatorContainer: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1,
  },
  topIndicatorDash: {
    width: 20,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
