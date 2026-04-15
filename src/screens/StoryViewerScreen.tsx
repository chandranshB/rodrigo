import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  cancelAnimation,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '../theme/theme';
import { mockUsers, mockStories } from '../data/mockDatabase';
import { X, Heart, PaperPlaneRight as Send } from 'phosphor-react-native';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000;
const SWIPE_THRESHOLD = 60;

export const StoryViewerScreen = ({ route, navigation }: any) => {
  const { userIds, initialUserIndex } = route.params as {
    userIds: string[];
    initialUserIndex: number;
  };

  const [userIndex, setUserIndex] = useState(initialUserIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const progress = useSharedValue(0);
  const translateX = useSharedValue(0);

  const userId = userIds[userIndex];
  const user = mockUsers[userId];
  const userStories = mockStories.filter(s => s.userId === userId);
  const story = userStories[storyIndex];

  // ─── Navigation helpers ───────────────────────────────────────────────────

  const goToUser = useCallback((newUserIndex: number, fromStoryIndex = 0) => {
    if (newUserIndex < 0 || newUserIndex >= userIds.length) {
      navigation.goBack();
      return;
    }
    cancelAnimation(progress);
    progress.value = 0;
    setStoryIndex(fromStoryIndex);
    setUserIndex(newUserIndex);
  }, [userIds, navigation, progress]);

  const nextStory = useCallback(() => {
    if (storyIndex < userStories.length - 1) {
      progress.value = 0;
      setStoryIndex(i => i + 1);
    } else {
      goToUser(userIndex + 1, 0);
    }
  }, [storyIndex, userStories.length, userIndex, goToUser, progress]);

  const prevStory = useCallback(() => {
    if (storyIndex > 0) {
      progress.value = 0;
      setStoryIndex(i => i - 1);
    } else if (userIndex > 0) {
      // Go to last story of previous user
      const prevUserId = userIds[userIndex - 1];
      const prevUserStories = mockStories.filter(s => s.userId === prevUserId);
      goToUser(userIndex - 1, prevUserStories.length - 1);
    } else {
      // Restart current story
      progress.value = 0;
      startProgress();
    }
  }, [storyIndex, userIndex, userIds, goToUser, progress]);

  // ─── Progress animation ───────────────────────────────────────────────────

  const startProgress = useCallback(() => {
    const remaining = STORY_DURATION * (1 - progress.value);
    progress.value = withTiming(1, {
      duration: remaining,
      easing: Easing.linear,
    }, (finished) => {
      if (finished) runOnJS(nextStory)();
    });
  }, [progress, nextStory]);

  const pauseProgress = useCallback(() => {
    cancelAnimation(progress);
    setIsPaused(true);
  }, [progress]);

  const resumeProgress = useCallback(() => {
    setIsPaused(false);
    startProgress();
  }, [startProgress]);

  useEffect(() => {
    progress.value = 0;
    startProgress();
    return () => cancelAnimation(progress);
  }, [storyIndex, userIndex]);

  // ─── Swipe gesture (left = next user, right = prev user) ─────────────────

  const swipeGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(0);
        runOnJS(goToUser)(userIndex + 1, 0);
      } else if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(0);
        runOnJS(goToUser)(userIndex - 1, 0);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedSlide = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!story) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
        <StatusBar hidden />
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.container, animatedSlide]}>
            {/* Background image */}
            <Image source={{ uri: story.mediaUrl }} style={styles.media} resizeMode="cover" />

            <View style={styles.overlay}>
              {/* Progress bars */}
              <View style={styles.progressContainer}>
                {userStories.map((_, i) => (
                  <View key={i} style={styles.progressTrack}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        i === storyIndex
                          ? progressStyle
                          : { width: i < storyIndex ? '100%' : '0%' },
                      ]}
                    />
                  </View>
                ))}
              </View>

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  <View>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.timestamp}>{story.timestamp}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                  <X color="#FFF" size={28} />
                </TouchableOpacity>
              </View>

              {/* Tap zones */}
              <View style={styles.tapArea}>
                <Pressable
                  style={styles.tapSide}
                  onPress={prevStory}
                  onLongPress={pauseProgress}
                  onPressOut={() => isPaused && resumeProgress()}
                />
                <Pressable
                  style={styles.tapSide}
                  onPress={nextStory}
                  onLongPress={pauseProgress}
                  onPressOut={() => isPaused && resumeProgress()}
                />
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <View style={styles.replyBox}>
                  <TextInput
                    placeholder={`Reply to ${user.username}...`}
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    style={styles.replyInput}
                    onFocus={pauseProgress}
                    onBlur={resumeProgress}
                  />
                </View>
                <TouchableOpacity style={styles.footerIcon}>
                  <Heart color="#FFF" size={26} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcon}>
                  <Send color="#FFF" size={26} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  media: {
    width,
    height,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 4,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
  },
  closeBtn: {
    padding: 6,
  },
  tapArea: {
    flex: 1,
    flexDirection: 'row',
  },
  tapSide: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  replyBox: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  replyInput: {
    color: '#FFF',
    fontSize: 14,
  },
  footerIcon: {
    marginLeft: 16,
  },
});
