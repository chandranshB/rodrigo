import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const ELEGANT_SPRING = {
  damping: 22,
  stiffness: 280,
  mass: 0.6,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const ICON_SPRING = {
  damping: 12,
  stiffness: 300,
  mass: 0.5,
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

  const BAR_HEIGHT = 64;
  // Extra overflow to kill any sub-pixel gap at the bottom edge
  const OVERFLOW = 20;

  return (
    <BlurView
      style={[
        styles.container,
        { 
          height: BAR_HEIGHT + insets.bottom + OVERFLOW,
          paddingBottom: insets.bottom + OVERFLOW,
          width: windowWidth,
        }
      ]}
      blurType="dark"
      blurAmount={20}
      reducedTransparencyFallbackColor="rgba(13, 14, 21, 0.96)"
    >
      {/* Sliding Top Glow Line */}
      <Animated.View style={[styles.activeIndicatorContainer, animatedIndicatorStyle, { width: TAB_WIDTH }]}>
        <View style={styles.topGlowLine} />
      </Animated.View>

      <View style={styles.content}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

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
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              <TabIcon 
                isFocused={isFocused} 
                options={options}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
};

// Memoized TabIcon for fluid interaction
const TabIcon = React.memo(({ isFocused, options }: any) => {
  const Icon = options.tabBarIcon;
  const scale = useSharedValue(isFocused ? 1.2 : 0.95);
  const translateY = useSharedValue(isFocused ? -6 : 0);
  const opacity = useSharedValue(isFocused ? 1 : 0.85);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSequence(
        withTiming(0.85, { duration: 60 }),
        withSpring(1.2, ICON_SPRING)
      );
      translateY.value = withSequence(
        withTiming(2, { duration: 60 }),
        withSpring(-6, ICON_SPRING)
      );
    } else {
      scale.value = withSpring(0.95, ICON_SPRING);
      translateY.value = withSpring(0, ICON_SPRING);
    }
    opacity.value = withTiming(isFocused ? 1 : 0.85, { duration: 250 });
  }, [isFocused, scale, translateY, opacity]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
      {Icon && <Icon 
        focused={isFocused} 
        color={isFocused ? '#FFFFFF' : theme.colors.text.secondary} 
        size={24} 
      />}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginBottom: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
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
  topGlowLine: {
    width: '40%',
    height: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },

  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
