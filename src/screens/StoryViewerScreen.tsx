/**
 * StoryViewerScreen
 * - Tap left third  → previous story / previous user
 * - Tap right third → next story / next user
 * - Long press      → pause
 * - Swipe left/right → jump between users with slide animation
 * - Auto-advances every 5 s
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Image, StyleSheet, Dimensions, Text,
  TouchableOpacity, StatusBar, TextInput,
  Platform, Pressable,
} from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring,
  Easing, runOnJS, cancelAnimation,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { mockUsers, mockStories } from '../data/mockDatabase';
import { X, Heart, PaperPlaneRight as Send } from 'phosphor-react-native';

// ─── Constants ────────────────────────────────────────────────────────────────
const { width: W, height: H } = Dimensions.get('window');
const CARD_H    = Math.min(H, (W * 16) / 9);
const STORY_MS  = 5000;
const SLIDE_MS  = 280;
const THRESHOLD = 50;

// ─── Pre-compute story lists (module-level, never changes) ────────────────────
const storiesByUser: Record<string, typeof mockStories> = {};
mockStories.forEach(s => {
  if (!storiesByUser[s.userId]) storiesByUser[s.userId] = [];
  storiesByUser[s.userId].push(s);
});

// ─── Progress bar strip ───────────────────────────────────────────────────────
const ProgressBars = ({
  count, current, progress,
}: {
  count: number;
  current: number;
  progress: SharedValue<number>;
}) => {
  const activeStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  return (
    <View style={pb.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={pb.track}>
          <Animated.View
            style={[
              pb.fill,
              i === current ? activeStyle
                : i < current ? pb.full
                : pb.empty,
            ]}
          />
        </View>
      ))}
    </View>
  );
};

// ─── Single story card (pure display) ────────────────────────────────────────
const StoryCard = ({
  userId, storyIndex, progress, onNext, onPrev, onHoldStart, onHoldEnd,
}: {
  userId: string;
  storyIndex: number;
  progress: SharedValue<number>;
  onNext: () => void;
  onPrev: () => void;
  onHoldStart: () => void;
  onHoldEnd: () => void;
}) => {
  const user    = mockUsers[userId];
  const stories = storiesByUser[userId] ?? [];
  const story   = stories[storyIndex] ?? stories[0];
  if (!user || !story) return null;

  return (
    <View style={card.root}>
      <Image source={{ uri: story.mediaUrl }} style={card.img} resizeMode="cover" />
      <View style={card.overlay}>
        <ProgressBars count={stories.length} current={storyIndex} progress={progress} />
        <View style={card.header}>
          <Image source={{ uri: user.avatar }} style={card.avatar} />
          <View>
            <Text style={card.name}>{user.username}</Text>
            <Text style={card.time}>{story.timestamp} ago</Text>
          </View>
        </View>
        {/* Tap zones — left 35% = prev, right 65% = next */}
        <View style={card.taps}>
          <Pressable
            style={card.tapL}
            onPress={onPrev}
            onLongPress={onHoldStart}
            onPressOut={onHoldEnd}
            delayLongPress={200}
          />
          <Pressable
            style={card.tapR}
            onPress={onNext}
            onLongPress={onHoldStart}
            onPressOut={onHoldEnd}
            delayLongPress={200}
          />
        </View>
        <View style={card.footer}>
          <View style={card.replyWrap}>
            <TextInput
              placeholder={`Reply to ${user.username}…`}
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={card.replyInput}
              onFocus={onHoldStart}
              onBlur={onHoldEnd}
            />
          </View>
          <TouchableOpacity style={card.icon}><Heart color="#fff" size={24} /></TouchableOpacity>
          <TouchableOpacity style={card.icon}><Send  color="#fff" size={24} /></TouchableOpacity>
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

  // ── React state: source of truth for WHAT is shown ──────────────────────────
  const [ui, setUi] = useState(initialUserIndex); // user index
  const [si, setSi] = useState(0);                // story index within user

  // ── Shared values: source of truth for HOW it's animated ────────────────────
  const progress = useSharedValue(0);  // 0→1 for current story bar
  const slideX   = useSharedValue(0);  // horizontal offset of the card stack

  // ── Refs: mutable values readable from anywhere without stale closures ───────
  const uiRef     = useRef(ui);
  const siRef     = useRef(si);
  const paused    = useRef(false);
  const busy      = useRef(false);    // true while a user-switch slide is running

  // Keep refs in sync
  useEffect(() => { uiRef.current = ui; }, [ui]);
  useEffect(() => { siRef.current = si; }, [si]);

  // ── Timer ────────────────────────────────────────────────────────────────────
  // All timer logic is in JS. It reads refs so it never goes stale.


  const startTimer = useCallback(() => {
    cancelAnimation(progress);
    progress.value = 0;
    progress.value = withTiming(1, { duration: STORY_MS, easing: Easing.linear }, finished => {
      if (finished) runOnJS(advance)();
    });
  }, [progress]); // eslint-disable-line react-hooks/exhaustive-deps

  const pauseTimer = useCallback(() => {
    if (paused.current) return;
    paused.current = true;
    cancelAnimation(progress);
  }, [progress]);

  const resumeTimer = useCallback(() => {
    if (!paused.current) return;
    paused.current = false;
    // Resume from where we left off
    const left = STORY_MS * (1 - progress.value);
    progress.value = withTiming(1, { duration: left, easing: Easing.linear }, finished => {
      if (finished) runOnJS(advance)();
    });
  }, [progress]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigation ───────────────────────────────────────────────────────────────

  // Slide the whole stack to a new user, then commit state
  const slideToUser = useCallback((targetUi: number, targetSi: number, direction: 'left' | 'right') => {
    busy.current = true;
    cancelAnimation(progress);
    const toX = direction === 'left' ? -W : W;
    slideX.value = withTiming(toX, { duration: SLIDE_MS, easing: Easing.out(Easing.cubic) }, finished => {
      if (!finished) return;
      // Reset slide instantly (no animation) then update state
      slideX.value = 0;
      runOnJS(commitUser)(targetUi, targetSi);
    });
  }, [slideX, progress]); // eslint-disable-line react-hooks/exhaustive-deps

  const commitUser = useCallback((targetUi: number, targetSi: number) => {
    busy.current  = false;
    paused.current = false;
    setUi(targetUi);
    setSi(targetSi);
    // Timer restarts via the useEffect below
  }, []);

  const advance = useCallback(() => {
    if (busy.current) return;
    const curUi = uiRef.current;
    const curSi = siRef.current;
    const stories = storiesByUser[userIds[curUi]] ?? [];

    if (curSi < stories.length - 1) {
      // Next story of same user
      setSi(curSi + 1);
    } else if (curUi < userIds.length - 1) {
      slideToUser(curUi + 1, 0, 'left');
    } else {
      navigation.goBack();
    }
  }, [userIds, navigation, slideToUser]);

  const goNext = useCallback(() => {
    if (busy.current) return;
    advance();
  }, [advance]);

  const goPrev = useCallback(() => {
    if (busy.current) return;
    const curUi = uiRef.current;
    const curSi = siRef.current;

    if (curSi > 0) {
      setSi(curSi - 1);
    } else if (curUi > 0) {
      const prevStories = storiesByUser[userIds[curUi - 1]] ?? [];
      slideToUser(curUi - 1, prevStories.length - 1, 'right');
    } else {
      // Already at very first story — just restart timer
      startTimer();
    }
  }, [userIds, slideToUser, startTimer]);

  // Restart timer whenever story or user changes
  useEffect(() => {
    if (paused.current || busy.current) return;
    startTimer();
    return () => cancelAnimation(progress);
  }, [ui, si, startTimer, progress]);

  // ── Swipe gesture ─────────────────────────────────────────────────────────────
  // Runs entirely on the UI thread. Only calls runOnJS once at the very end.

  const panGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-20, 20])
    .onBegin(() => {
      'worklet';
      cancelAnimation(slideX);
      runOnJS(pauseTimer)();
    })
    .onUpdate(e => {
      'worklet';
      const raw = e.translationX;
      const atStart = uiRef.current === 0 && raw > 0;
      const atEnd   = uiRef.current === userIds.length - 1 && raw < 0;
      slideX.value  = raw * (atStart || atEnd ? 0.15 : 1);
    })
    .onEnd(e => {
      'worklet';
      const dx = e.translationX;
      const vx = e.velocityX;
      const curUi = uiRef.current;

      if ((dx < -THRESHOLD || vx < -600) && curUi < userIds.length - 1) {
        // Swipe left → next user
        slideX.value = withTiming(-W, { duration: SLIDE_MS, easing: Easing.out(Easing.cubic) }, done => {
          if (done) {
            slideX.value = 0;
            runOnJS(commitUser)(curUi + 1, 0);
          }
        });
      } else if ((dx > THRESHOLD || vx > 600) && curUi > 0) {
        // Swipe right → prev user
        const prevStories = storiesByUser[userIds[curUi - 1]] ?? [];
        const targetSi = prevStories.length - 1;
        slideX.value = withTiming(W, { duration: SLIDE_MS, easing: Easing.out(Easing.cubic) }, done => {
          if (done) {
            slideX.value = 0;
            runOnJS(commitUser)(curUi - 1, targetSi);
          }
        });
      } else {
        // Snap back
        slideX.value = withSpring(0, { damping: 22, stiffness: 250, mass: 0.5 });
        runOnJS(resumeTimer)();
      }
    });

  // ── Animated style for the active card ───────────────────────────────────────
  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <GestureHandlerRootView style={st.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={st.stage}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[st.slot, cardAnim]}>
            <StoryCard
              userId={userIds[ui]}
              storyIndex={si}
              progress={progress}
              onNext={goNext}
              onPrev={goPrev}
              onHoldStart={pauseTimer}
              onHoldEnd={resumeTimer}
            />
          </Animated.View>
        </GestureDetector>

        <TouchableOpacity style={st.close} onPress={() => navigation.goBack()}>
          <X color="#fff" size={28} />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  root:  { flex: 1, backgroundColor: '#000' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  slot:  { width: W, height: CARD_H, borderRadius: 12, overflow: 'hidden' },
  close: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 36,
    right: 16,
    zIndex: 100,
    padding: 8,
  },
});

const card = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#111' },
  img:     { ...(StyleSheet.absoluteFill as object) },
  overlay: { flex: 1, paddingTop: Platform.OS === 'ios' ? 54 : 36, justifyContent: 'space-between' },
  header:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginTop: 8 },
  avatar:  { width: 38, height: 38, borderRadius: 19, marginRight: 10, borderWidth: 1.5, borderColor: '#fff' },
  name:    { color: '#fff', fontWeight: 'bold', fontSize: 14, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  time:    { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
  taps:    { flex: 1, flexDirection: 'row' },
  tapL:    { flex: 35 },
  tapR:    { flex: 65 },
  footer:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: Platform.OS === 'ios' ? 36 : 20 },
  replyWrap: { flex: 1, height: 44, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 16, justifyContent: 'center' },
  replyInput:{ color: '#fff', fontSize: 14 },
  icon:    { marginLeft: 14 },
});

const pb = StyleSheet.create({
  row:   { flexDirection: 'row', paddingHorizontal: 10, gap: 4, marginBottom: 4 },
  track: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  fill:  { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  full:  { width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  empty: { width: '0%' },
});
