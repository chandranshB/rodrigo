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
  withSpring,
  Easing,
  runOnJS,
  cancelAnimation,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { mockUsers, mockStories } from '../data/mockDatabase';
import { X, Heart, PaperPlaneRight as Send } from 'phosphor-react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// 9:16 card dimensions, capped to screen
const CARD_H = Math.min(SCREEN_H, (SCREEN_W * 16) / 9);
const CARD_W = SCREEN_W;

const STORY_DURATION = 5000;
const SWIPE_THRESHOLD = 50;

// ─── Single story card ────────────────────────────────────────────────────────
interface StoryCardProps {
  userId: string;
  storyIndex: number;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ userId, storyIndex, isActive, onNext, onPrev }) => {
  const user = mockUsers[userId];
  const userStories = mockStories.filter(s => s.userId === userId);
  const story = userStories[storyIndex] ?? userStories[0];
  const progress = useSharedValue(0);
  const isPausedRef = useRef(false);
  const onNextRef = useRef(onNext);
  const [, forceRender] = useState(0);

  // Keep ref in sync so the worklet callback always calls the latest onNext
  useEffect(() => { onNextRef.current = onNext; }, [onNext]);

  const startProgress = useCallback((fromValue = 0) => {
    progress.value = fromValue;
    const remaining = STORY_DURATION * (1 - fromValue);
    progress.value = withTiming(1, { duration: remaining, easing: Easing.linear }, (done) => {
      if (done) runOnJS(onNextRef.current)();
    });
  }, [progress]);

  const pauseProgress = useCallback(() => {
    cancelAnimation(progress);
    isPausedRef.current = true;
    forceRender(n => n + 1);
  }, [progress]);

  const resumeProgress = useCallback(() => {
    isPausedRef.current = false;
    forceRender(n => n + 1);
    startProgress(progress.value);
  }, [progress, startProgress]);

  // Restart timer whenever story or active state changes
  useEffect(() => {
    if (!isActive) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }
    isPausedRef.current = false;
    startProgress(0);
    return () => cancelAnimation(progress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyIndex, isActive]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!story) return null;

  return (
    <View style={card.container}>
      <Image source={{ uri: story.mediaUrl }} style={card.media} resizeMode="cover" />
      <View style={card.overlay}>
        {/* Progress bars */}
        <View style={card.progressRow}>
          {userStories.map((_, i) => (
            <View key={i} style={card.track}>
              <Animated.View
                style={[
                  card.fill,
                  i === storyIndex ? progressStyle : { width: i < storyIndex ? '100%' : '0%' },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={card.header}>
          <View style={card.userInfo}>
            <Image source={{ uri: user.avatar }} style={card.avatar} />
            <View>
              <Text style={card.username}>{user.username}</Text>
              <Text style={card.timestamp}>{story.timestamp}</Text>
            </View>
          </View>
        </View>

        {/* Tap zones */}
        <View style={card.tapArea}>
          <Pressable
            style={card.tapSide}
            onPress={onPrev}
            onLongPress={pauseProgress}
            onPressOut={() => isPausedRef.current && resumeProgress()}
          />
          <Pressable
            style={card.tapSide}
            onPress={onNext}
            onLongPress={pauseProgress}
            onPressOut={() => isPausedRef.current && resumeProgress()}
          />
        </View>

        {/* Footer */}
        <View style={card.footer}>
          <View style={card.replyBox}>
            <TextInput
              placeholder={`Reply to ${user.username}...`}
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={card.replyInput}
              onFocus={pauseProgress}
              onBlur={resumeProgress}
            />
          </View>
          <TouchableOpacity style={card.icon}><Heart color="#FFF" size={26} /></TouchableOpacity>
          <TouchableOpacity style={card.icon}><Send color="#FFF" size={26} /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ─── Main viewer ──────────────────────────────────────────────────────────────
export const StoryViewerScreen = ({ route, navigation }: any) => {
  const { userIds, initialUserIndex } = route.params as {
    userIds: string[];
    initialUserIndex: number;
  };

  const [userIndex, setUserIndex] = useState(initialUserIndex);
  const [storyIndex, setStoryIndex] = useState(0);

  // translateX drives the slide: 0 = current, -CARD_W = slid left, +CARD_W = slid right
  const translateX = useSharedValue(0);

  const userId = userIds[userIndex];
  const prevUserId = userIds[userIndex - 1] ?? null;
  const nextUserId = userIds[userIndex + 1] ?? null;

  const commitGoUser = useCallback((newIndex: number, fromStory = 0) => {
    translateX.value = 0;
    setStoryIndex(fromStory);
    setUserIndex(newIndex);
  }, [translateX]);

  const goNextUser = useCallback(() => {
    if (userIndex >= userIds.length - 1) { navigation.goBack(); return; }
    translateX.value = withTiming(-CARD_W, { duration: 280, easing: Easing.out(Easing.cubic) }, () => {
      runOnJS(commitGoUser)(userIndex + 1, 0);
    });
  }, [userIndex, userIds, navigation, translateX, commitGoUser]);

  const goPrevUser = useCallback(() => {
    if (userIndex <= 0) { navigation.goBack(); return; }
    translateX.value = withTiming(CARD_W, { duration: 280, easing: Easing.out(Easing.cubic) }, () => {
      runOnJS(commitGoUser)(userIndex - 1, 0);
    });
  }, [userIndex, translateX, commitGoUser]);

  const handleNext = useCallback(() => {
    const userStories = mockStories.filter(s => s.userId === userId);
    if (storyIndex < userStories.length - 1) {
      setStoryIndex(i => i + 1);
    } else {
      goNextUser();
    }
  }, [storyIndex, userId, goNextUser]);

  const handlePrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex(i => i - 1);
    } else {
      goPrevUser();
    }
  }, [storyIndex, goPrevUser]);

  // Pan gesture for swiping between users
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onUpdate((e) => {
      // Resist at edges
      const isAtStart = userIndex === 0 && e.translationX > 0;
      const isAtEnd = userIndex === userIds.length - 1 && e.translationX < 0;
      const resistance = isAtStart || isAtEnd ? 0.25 : 1;
      translateX.value = e.translationX * resistance;
    })
    .onEnd((e) => {
      const vel = e.velocityX;
      if (e.translationX < -SWIPE_THRESHOLD || vel < -500) {
        runOnJS(goNextUser)();
      } else if (e.translationX > SWIPE_THRESHOLD || vel > 500) {
        runOnJS(goPrevUser)();
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  // Current card slides with finger
  const currentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Prev card peeks in from the right when swiping right
  const prevStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: interpolate(
        translateX.value,
        [0, CARD_W],
        [-CARD_W * 0.3, 0],
        Extrapolation.CLAMP,
      ),
    }],
    opacity: interpolate(translateX.value, [0, CARD_W * 0.5], [0, 1], Extrapolation.CLAMP),
  }));

  // Next card peeks in from the left when swiping left
  const nextStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: interpolate(
        translateX.value,
        [-CARD_W, 0],
        [0, CARD_W * 0.3],
        Extrapolation.CLAMP,
      ),
    }],
    opacity: interpolate(translateX.value, [-CARD_W * 0.5, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
        <View style={styles.stage}>
          {/* Prev user card (behind, peeks when swiping right) */}
          {prevUserId && (
            <Animated.View style={[styles.cardSlot, prevStyle]}>
              <StoryCard
                userId={prevUserId}
                storyIndex={0}
                isActive={false}
                onNext={() => {}}
                onPrev={() => {}}
              />
            </Animated.View>
          )}

          {/* Next user card (behind, peeks when swiping left) */}
          {nextUserId && (
            <Animated.View style={[styles.cardSlot, nextStyle]}>
              <StoryCard
                userId={nextUserId}
                storyIndex={0}
                isActive={false}
                onNext={() => {}}
                onPrev={() => {}}
              />
            </Animated.View>
          )}

          {/* Current user card (on top, draggable) */}
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.cardSlot, currentStyle]}>
              <StoryCard
                userId={userId}
                storyIndex={storyIndex}
                isActive={true}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            </Animated.View>
          </GestureDetector>

          {/* Close button — always on top */}
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <X color="#FFF" size={28} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  cardSlot: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 36,
    right: 16,
    zIndex: 100,
    padding: 6,
  },
});

const card = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  media: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 4,
  },
  track: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
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
    paddingHorizontal: 14,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  replyBox: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  replyInput: {
    color: '#FFF',
    fontSize: 14,
  },
  icon: {
    marginLeft: 14,
  },
});
