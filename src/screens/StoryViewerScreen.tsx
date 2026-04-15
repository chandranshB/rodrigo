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
const CARD_H = Math.min(SCREEN_H, (SCREEN_W * 16) / 9);
const CARD_W = SCREEN_W;
const STORY_DURATION = 5000;
const SWIPE_THRESHOLD = 50;

// Pre-compute per-user story lists once
const storiesByUser: Record<string, typeof mockStories> = {};
mockStories.forEach(s => {
  if (!storiesByUser[s.userId]) storiesByUser[s.userId] = [];
  storiesByUser[s.userId].push(s);
});

// ─── Pure presentational card ─────────────────────────────────────────────────
interface StoryCardProps {
  userId: string;
  storyIndex: number;
  progressValue: Animated.SharedValue<number>;
  onNext: () => void;
  onPrev: () => void;
  onPauseStart: () => void;
  onPauseEnd: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({
  userId, storyIndex, progressValue,
  onNext, onPrev, onPauseStart, onPauseEnd,
}) => {
  const user = mockUsers[userId];
  const userStories = storiesByUser[userId] ?? [];
  const story = userStories[storyIndex] ?? userStories[0];

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  if (!story || !user) return null;

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
                  i === storyIndex
                    ? progressStyle
                    : { width: i < storyIndex ? '100%' : '0%' },
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
            onLongPress={onPauseStart}
            onPressOut={onPauseEnd}
          />
          <Pressable
            style={card.tapSide}
            onPress={onNext}
            onLongPress={onPauseStart}
            onPressOut={onPauseEnd}
          />
        </View>

        {/* Footer */}
        <View style={card.footer}>
          <View style={card.replyBox}>
            <TextInput
              placeholder={`Reply to ${user.username}...`}
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={card.replyInput}
              onFocus={onPauseStart}
              onBlur={onPauseEnd}
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

  // Shared values
  const progress = useSharedValue(0);
  const translateX = useSharedValue(0);
  const dummyProgress = useSharedValue(0); // static value for non-active peek cards

  // Refs so worklet callbacks always see latest values without re-creating gestures
  const userIndexRef = useRef(userIndex);
  const storyIndexRef = useRef(storyIndex);
  const isPausedRef = useRef(false);
  const isAnimatingUserRef = useRef(false); // prevent double-fires during slide animation

  useEffect(() => { userIndexRef.current = userIndex; }, [userIndex]);
  useEffect(() => { storyIndexRef.current = storyIndex; }, [storyIndex]);

  const userId = userIds[userIndex];
  const prevUserId = userIds[userIndex - 1] ?? null;
  const nextUserId = userIds[userIndex + 1] ?? null;

  // ─── Timer ──────────────────────────────────────────────────────────────────

  // Called from JS thread to advance after timer fires
  const advanceStory = useCallback(() => {
    const ui = userIndexRef.current;
    const si = storyIndexRef.current;
    const uid = userIds[ui];
    const stories = storiesByUser[uid] ?? [];

    if (si < stories.length - 1) {
      progress.value = 0;
      setStoryIndex(si + 1);
    } else {
      // Move to next user
      if (ui >= userIds.length - 1) {
        navigation.goBack();
      } else {
        isAnimatingUserRef.current = true;
        translateX.value = withTiming(-CARD_W, { duration: 280, easing: Easing.out(Easing.cubic) }, () => {
          runOnJS(commitNextUser)(ui + 1);
        });
      }
    }
  }, [userIds, navigation, progress, translateX]);

  const commitNextUser = useCallback((newUserIndex: number) => {
    translateX.value = 0;
    progress.value = 0;
    isAnimatingUserRef.current = false;
    setStoryIndex(0);
    setUserIndex(newUserIndex);
  }, [translateX, progress]);

  const startTimer = useCallback(() => {
    cancelAnimation(progress);
    progress.value = withTiming(1, {
      duration: STORY_DURATION,
      easing: Easing.linear,
    }, (finished) => {
      if (finished) runOnJS(advanceStory)();
    });
  }, [progress, advanceStory]);

  // Restart timer every time story or user changes
  useEffect(() => {
    if (isPausedRef.current) return;
    progress.value = 0;
    startTimer();
    return () => cancelAnimation(progress);
  // Only re-run when the actual story/user identity changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyIndex, userIndex]);

  const pauseTimer = useCallback(() => {
    if (isPausedRef.current) return;
    isPausedRef.current = true;
    cancelAnimation(progress);
  }, [progress]);

  const resumeTimer = useCallback(() => {
    if (!isPausedRef.current) return;
    isPausedRef.current = false;
    // Resume from current position
    const remaining = STORY_DURATION * (1 - progress.value);
    progress.value = withTiming(1, {
      duration: remaining,
      easing: Easing.linear,
    }, (finished) => {
      if (finished) runOnJS(advanceStory)();
    });
  }, [progress, advanceStory]);

  // ─── Tap navigation ──────────────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    if (isAnimatingUserRef.current) return;
    const si = storyIndexRef.current;
    const ui = userIndexRef.current;
    const uid = userIds[ui];
    const stories = storiesByUser[uid] ?? [];

    cancelAnimation(progress);
    progress.value = 0;

    if (si < stories.length - 1) {
      setStoryIndex(si + 1);
    } else if (ui < userIds.length - 1) {
      isAnimatingUserRef.current = true;
      translateX.value = withTiming(-CARD_W, { duration: 280, easing: Easing.out(Easing.cubic) }, () => {
        runOnJS(commitNextUser)(ui + 1);
      });
    } else {
      navigation.goBack();
    }
  }, [userIds, navigation, progress, translateX, commitNextUser]);

  const handlePrev = useCallback(() => {
    if (isAnimatingUserRef.current) return;
    const si = storyIndexRef.current;
    const ui = userIndexRef.current;

    cancelAnimation(progress);
    progress.value = 0;

    if (si > 0) {
      setStoryIndex(si - 1);
    } else if (ui > 0) {
      isAnimatingUserRef.current = true;
      translateX.value = withTiming(CARD_W, { duration: 280, easing: Easing.out(Easing.cubic) }, () => {
        runOnJS(commitPrevUser)(ui - 1);
      });
    } else {
      // Restart first story
      startTimer();
    }
  }, [progress, translateX, startTimer]);

  const commitPrevUser = useCallback((newUserIndex: number) => {
    const uid = userIds[newUserIndex];
    const stories = storiesByUser[uid] ?? [];
    translateX.value = 0;
    progress.value = 0;
    isAnimatingUserRef.current = false;
    setStoryIndex(stories.length - 1);
    setUserIndex(newUserIndex);
  }, [userIds, translateX, progress]);

  // ─── Swipe gesture ───────────────────────────────────────────────────────────

  const panGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-20, 20])
    .onUpdate((e) => {
      const atStart = userIndexRef.current === 0 && e.translationX > 0;
      const atEnd = userIndexRef.current === userIds.length - 1 && e.translationX < 0;
      translateX.value = e.translationX * (atStart || atEnd ? 0.2 : 1);
    })
    .onEnd((e) => {
      const vel = e.velocityX;
      const dx = e.translationX;
      if (dx < -SWIPE_THRESHOLD || vel < -600) {
        runOnJS(handleNext)();
      } else if (dx > SWIPE_THRESHOLD || vel > 600) {
        runOnJS(handlePrev)();
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  // ─── Animated styles ─────────────────────────────────────────────────────────

  const currentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const prevStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: interpolate(translateX.value, [0, CARD_W], [-CARD_W * 0.3, 0], Extrapolation.CLAMP),
    }],
    opacity: interpolate(translateX.value, [0, CARD_W * 0.4], [0, 1], Extrapolation.CLAMP),
  }));

  const nextStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: interpolate(translateX.value, [-CARD_W, 0], [0, CARD_W * 0.3], Extrapolation.CLAMP),
    }],
    opacity: interpolate(translateX.value, [-CARD_W * 0.4, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
        <View style={styles.stage}>

          {prevUserId && (
            <Animated.View style={[styles.cardSlot, prevStyle]}>
              <StoryCard
                userId={prevUserId}
                storyIndex={0}
                progressValue={dummyProgress}
                onNext={() => {}} onPrev={() => {}}
                onPauseStart={() => {}} onPauseEnd={() => {}}
              />
            </Animated.View>
          )}

          {nextUserId && (
            <Animated.View style={[styles.cardSlot, nextStyle]}>
              <StoryCard
                userId={nextUserId}
                storyIndex={0}
                progressValue={dummyProgress}
                onNext={() => {}} onPrev={() => {}}
                onPauseStart={() => {}} onPauseEnd={() => {}}
              />
            </Animated.View>
          )}

          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.cardSlot, currentStyle]}>
              <StoryCard
                userId={userId}
                storyIndex={storyIndex}
                progressValue={progress}
                onNext={handleNext}
                onPrev={handlePrev}
                onPauseStart={pauseTimer}
                onPauseEnd={resumeTimer}
              />
            </Animated.View>
          </GestureDetector>

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
  root: { flex: 1, backgroundColor: '#000' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
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
  container: { flex: 1, backgroundColor: '#111' },
  media: { width: '100%', height: '100%', position: 'absolute' },
  overlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    justifyContent: 'space-between',
  },
  progressRow: { flexDirection: 'row', paddingHorizontal: 10, gap: 4 },
  track: {
    flex: 1, height: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2, overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: '#FFF', borderRadius: 2 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginTop: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 19, marginRight: 10, borderWidth: 1.5, borderColor: '#FFF' },
  username: {
    color: '#FFF', fontWeight: 'bold', fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
  timestamp: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  tapArea: { flex: 1, flexDirection: 'row' },
  tapSide: { flex: 1 },
  footer: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  replyBox: {
    flex: 1, height: 44, borderRadius: 22,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 16, justifyContent: 'center',
  },
  replyInput: { color: '#FFF', fontSize: 14 },
  icon: { marginLeft: 14 },
});
