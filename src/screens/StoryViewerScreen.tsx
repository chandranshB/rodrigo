import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Image, StyleSheet, Dimensions, Text,
  TouchableOpacity, StatusBar, TextInput,
  KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring,
  Easing, runOnJS, cancelAnimation,
  interpolate, Extrapolation, SharedValue
} from 'react-native-reanimated';
import { mockUsers, mockStories } from '../data/mockDatabase';
import { X, Heart, PaperPlaneRight as Send } from 'phosphor-react-native';

const { width: W, height: H } = Dimensions.get('window');
const CARD_H = Math.min(H, (W * 16) / 9);
const DURATION = 5000;
const SWIPE_THRESHOLD = 50;
const SLIDE_DURATION = 260;

// Built once at module level — never changes
const storiesByUser: Record<string, typeof mockStories> = {};
mockStories.forEach(s => {
  if (!storiesByUser[s.userId]) storiesByUser[s.userId] = [];
  storiesByUser[s.userId].push(s);
});

// ─── Presentational card ──────────────────────────────────────────────────────
interface CardProps {
  userId: string;
  storyIndex: number;
  progressValue: SharedValue<number>;
  onNext: () => void;
  onPrev: () => void;
  onPauseStart: () => void;
  onPauseEnd: () => void;
}

const StoryCard: React.FC<CardProps> = ({
  userId, storyIndex, progressValue,
  onNext, onPrev, onPauseStart, onPauseEnd,
}) => {
  const user = mockUsers[userId];
  const stories = storiesByUser[userId] ?? [];
  const story = stories[storyIndex] ?? stories[0];

  const barStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  if (!story || !user) return null;

  return (
    <View style={c.container}>
      <Image source={{ uri: story.mediaUrl }} style={c.media} resizeMode="cover" />
      <View style={c.overlay}>
        <View style={c.bars}>
          {stories.map((_, i) => (
            <View key={i} style={c.track}>
              <Animated.View
                style={[c.fill, i === storyIndex ? barStyle : (i < storyIndex ? c.fillComplete : c.fillEmpty)]}
              />
            </View>
          ))}
        </View>
        <View style={c.header}>
          <Image source={{ uri: user.avatar }} style={c.avatar} />
          <View>
            <Text style={c.username}>{user.username}</Text>
            <Text style={c.time}>{story.timestamp}</Text>
          </View>
        </View>
        <View style={c.tapArea}>
          <Pressable style={c.tap} onPress={onPrev} onLongPress={onPauseStart} onPressOut={onPauseEnd} />
          <Pressable style={c.tap} onPress={onNext} onLongPress={onPauseStart} onPressOut={onPauseEnd} />
        </View>
        <View style={c.footer}>
          <View style={c.replyBox}>
            <TextInput
              placeholder={`Reply to ${user.username}...`}
              placeholderTextColor="rgba(255,255,255,0.55)"
              style={c.replyInput}
              onFocus={onPauseStart}
              onBlur={onPauseEnd}
            />
          </View>
          <TouchableOpacity style={c.icon}><Heart color="#FFF" size={24} /></TouchableOpacity>
          <TouchableOpacity style={c.icon}><Send color="#FFF" size={24} /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ─── Universal Card Animation Engine ───────────────────────────────────────
  
const CardSlot = ({ index, children, slideX }: { index: number, children: React.ReactNode, slideX: SharedValue<number> }) => {
  const style = useAnimatedStyle(() => {
    const offset = (index * W) + slideX.value;
    
    if (offset < 0) {
      return {
        opacity: 1,
        transform: [{ translateX: offset }],
        zIndex: 10,
      };
    } else {
      return {
         opacity: interpolate(offset, [0, W * 0.3], [1, 0], Extrapolation.CLAMP),
         transform: [{ translateX: interpolate(offset, [0, W], [0, W * 0.25], Extrapolation.CLAMP) }],
         zIndex: 0,
      };
    }
  });
  
  return <Animated.View style={[s.slot, style]}>{children}</Animated.View>;
};

// ─── Main screen ──────────────────────────────────────────────────────────────
export const StoryViewerScreen = ({ route, navigation }: any) => {
  const { userIds, initialUserIndex } = route.params as {
    userIds: string[];
    initialUserIndex: number;
  };

  const [userIndex, setUserIndex] = useState(initialUserIndex);
  const [storyIndex, setStoryIndex] = useState(0);

  const progress = useSharedValue(0);
  const slideX   = useSharedValue(initialUserIndex * -W);
  const slideContext = useSharedValue(initialUserIndex * -W);
  const dummyProg = useSharedValue(0);

  // Always-current refs — safe to read from worklets and stale closures
  const uiSV       = useSharedValue(initialUserIndex);
  const siSV       = useSharedValue(0);
  const busySV     = useSharedValue(false);
  const pausedRef  = useRef(false);

  // ─── commitUser: the ONE place that updates React state after a transition ──
  // Defined first so everything below can reference it safely.
  const commitUser = useCallback((newUi: number, newSi: number) => {
    progress.value = 0;
    busySV.value = false;
    pausedRef.current = false;
    uiSV.value = newUi;
    siSV.value = newSi;
    setUserIndex(newUi);
    setStoryIndex(newSi);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Stable ref so worklets can always call the latest version
  const commitUserRef = useRef(commitUser);
  useEffect(() => { commitUserRef.current = commitUser; }, [commitUser]);

  // ─── Timer ──────────────────────────────────────────────────────────────────

  const startTimer = useCallback((fromZero = true) => {
    cancelAnimation(progress);
    if (fromZero) progress.value = 0;
    const remaining = DURATION * (1 - progress.value);
    progress.value = withTiming(1, { duration: remaining, easing: Easing.linear }, (done) => {
      if (done) runOnJS(onTimerEndRef.current)();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startTimerRef = useRef(startTimer);
  useEffect(() => { startTimerRef.current = startTimer; }, [startTimer]);

  const pauseTimer = useCallback(() => {
    if (pausedRef.current) return;
    pausedRef.current = true;
    cancelAnimation(progress);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resumeTimer = useCallback(() => {
    // If a pan gesture is currently translating the screen, ignore anomalous resumes from Pressable
    if (Math.abs(slideX.value % W) > 5) return; 
    if (!pausedRef.current) return;
    pausedRef.current = false;
    startTimerRef.current(false);
  }, [slideX]);

  // ─── Navigation ─────────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    if (busySV.value) return;
    const ui = uiSV.value;
    const si = siSV.value;
    const stories = storiesByUser[userIds[ui]] ?? [];
    cancelAnimation(progress);

    if (si < stories.length - 1) {
      progress.value = 0;
      setStoryIndex(si + 1);
    } else if (ui < userIds.length - 1) {
      busySV.value = true;
      const targetUi = ui + 1;
      slideX.value = withTiming(-targetUi * W, { duration: SLIDE_DURATION, easing: Easing.out(Easing.cubic) }, (done) => {
        if (done) runOnJS(commitUserRef.current)(targetUi, 0);
      });
    } else {
      navigation.goBack();
    }
  }, [userIds, navigation]); // eslint-disable-line react-hooks/exhaustive-deps

  const goPrev = useCallback(() => {
    if (busySV.value) return;
    const ui = uiSV.value;
    const si = siSV.value;
    cancelAnimation(progress);

    if (si > 0) {
      progress.value = 0;
      setStoryIndex(si - 1);
    } else if (ui > 0) {
      busySV.value = true;
      const targetUi = ui - 1;
      const prevStories = storiesByUser[userIds[targetUi]] ?? [];
      const targetSi = prevStories.length - 1;
      slideX.value = withTiming(-targetUi * W, { duration: SLIDE_DURATION, easing: Easing.out(Easing.cubic) }, (done) => {
        if (done) runOnJS(commitUserRef.current)(targetUi, targetSi);
      });
    } else {
      startTimerRef.current(true);
    }
  }, [userIds]); // eslint-disable-line react-hooks/exhaustive-deps

  // onTimerEnd needs goNext — define after goNext, store in ref
  const onTimerEnd = useCallback(() => { goNext(); }, [goNext]);
  const onTimerEndRef = useRef(onTimerEnd);
  useEffect(() => { onTimerEndRef.current = onTimerEnd; }, [onTimerEnd]);

  // Restart timer on story/user change
  useEffect(() => {
    if (pausedRef.current) return;
    startTimerRef.current(true);
    return () => cancelAnimation(progress);
  }, [storyIndex, userIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Swipe gesture — pure worklet, single runOnJS at end ────────────────────

  // Capture stable refs for use inside worklet
  const commitUserWorklet = useCallback((newUi: number, newSi: number) => {
    commitUserRef.current(newUi, newSi);
  }, []);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onBegin(() => {
      'worklet';
      cancelAnimation(slideX);
      slideContext.value = slideX.value;
      runOnJS(pauseTimer)();
    })
    .onUpdate((e) => {
      'worklet';
      const targetX = slideContext.value + e.translationX;
      
      // Calculate absolute boundaries: 0 (first user) to -(N-1)*W (last user)
      const minX = -(userIds.length - 1) * W;
      const maxX = 0;
      
      let resistanceX = targetX;
      if (targetX > maxX) {
         resistanceX = maxX + (targetX - maxX) * 0.15;
      } else if (targetX < minX) {
         resistanceX = minX + (targetX - minX) * 0.15;
      }
      
      slideX.value = resistanceX;
    })
    .onEnd((e) => {
      'worklet';
      if (busySV.value) return;

      const ui = uiSV.value; // Precise current UI 
      const currentUiX = -ui * W;
      const dx = slideX.value - currentUiX; // Relative displacement from current slot
      const vx = e.velocityX;

      if ((dx < -SWIPE_THRESHOLD || vx < -500) && ui < userIds.length - 1) {
        busySV.value = true;
        const targetUi = ui + 1;
        slideX.value = withTiming(-targetUi * W, { duration: SLIDE_DURATION, easing: Easing.out(Easing.cubic) }, (done) => {
          if (done) runOnJS(commitUserWorklet)(targetUi, 0);
        });
      } else if ((dx > SWIPE_THRESHOLD || vx > 500) && ui > 0) {
        busySV.value = true;
        const targetUi = ui - 1;
        const prevStories = storiesByUser[userIds[targetUi]] ?? [];
        const targetSi = prevStories.length - 1;
        slideX.value = withTiming(-targetUi * W, { duration: SLIDE_DURATION, easing: Easing.out(Easing.cubic) }, (done) => {
          if (done) runOnJS(commitUserWorklet)(targetUi, targetSi);
        });
      } else {
        slideX.value = withSpring(currentUiX, { damping: 24, stiffness: 300, mass: 0.6 }, (done) => {
          if (done) runOnJS(resumeTimer)();
        });
      }
    });

  const prevUserId = userIds[userIndex - 1] ?? null;
  const nextUserId = userIds[userIndex + 1] ?? null;

  return (
    <GestureHandlerRootView style={s.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.root}>
        <View style={s.stage}>

          {prevUserId && (
            <CardSlot index={userIndex - 1} slideX={slideX}>
              <StoryCard userId={prevUserId} storyIndex={0} progressValue={dummyProg}
                onNext={goNext} onPrev={goPrev} onPauseStart={pauseTimer} onPauseEnd={resumeTimer} />
            </CardSlot>
          )}

          {nextUserId && (
            <CardSlot index={userIndex + 1} slideX={slideX}>
              <StoryCard userId={nextUserId} storyIndex={0} progressValue={dummyProg}
                onNext={goNext} onPrev={goPrev} onPauseStart={pauseTimer} onPauseEnd={resumeTimer} />
            </CardSlot>
          )}

          <GestureDetector gesture={panGesture}>
            <CardSlot index={userIndex} slideX={slideX}>
              <StoryCard
                userId={userIds[userIndex]}
                storyIndex={storyIndex}
                progressValue={progress}
                onNext={goNext}
                onPrev={goPrev}
                onPauseStart={pauseTimer}
                onPauseEnd={resumeTimer}
              />
            </CardSlot>
          </GestureDetector>

          <TouchableOpacity style={s.close} onPress={() => navigation.goBack()}>
            <X color="#FFF" size={28} />
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: '#000' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  slot:  { position: 'absolute', width: W, height: CARD_H, borderRadius: 12, overflow: 'hidden' },
  close: { position: 'absolute', top: Platform.OS === 'ios' ? 54 : 36, right: 16, zIndex: 100, padding: 6 },
});

const c = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  media:     { width: '100%', height: '100%', position: 'absolute' },
  overlay:   { flex: 1, paddingTop: Platform.OS === 'ios' ? 54 : 36, justifyContent: 'space-between' },
  bars:      { flexDirection: 'row', paddingHorizontal: 10, gap: 4 },
  track:     { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  fill:      { height: '100%', backgroundColor: '#FFF', borderRadius: 2 },
  fillComplete: { width: '100%' },
  fillEmpty:    { width: '0%' },
  header:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginTop: 10 },
  avatar:    { width: 38, height: 38, borderRadius: 19, marginRight: 10, borderWidth: 1.5, borderColor: '#FFF' },
  username:  { color: '#FFF', fontWeight: 'bold', fontSize: 14, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  time:      { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
  tapArea:   { flex: 1, flexDirection: 'row' },
  tap:       { flex: 1 },
  footer:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: Platform.OS === 'ios' ? 36 : 20 },
  replyBox:  { flex: 1, height: 44, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 16, justifyContent: 'center' },
  replyInput:{ color: '#FFF', fontSize: 14 },
  icon:      { marginLeft: 14 },
});
