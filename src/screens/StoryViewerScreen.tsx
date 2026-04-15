import React, { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, StatusBar, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { theme } from '../theme/theme';
import { mockUsers, mockStories } from '../data/mockDatabase';
import { X, MoreVertical, Send, Heart } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS, cancelAnimation } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export const StoryViewerScreen = ({ route, navigation }: any) => {
  const { userId } = route.params;
  const user = mockUsers[userId];
  const userStories = mockStories.filter(s => s.userId === userId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progress = useSharedValue(0);
  const duration = 5000;

  const nextStory = () => {
    if (currentIndex < userStories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      progress.value = 0;
    } else {
      navigation.goBack();
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      progress.value = 0;
    } else {
      // If at first story, restart it
      progress.value = 0;
      startAnimation();
    }
  };

  const startAnimation = () => {
    progress.value = withTiming(1, {
      duration: duration * (1 - progress.value),
      easing: Easing.linear,
    }, (finished) => {
      if (finished) {
        runOnJS(nextStory)();
      }
    });
  };

  const pauseAnimation = () => {
    cancelAnimation(progress);
    setIsPaused(true);
  };

  const resumeAnimation = () => {
    setIsPaused(false);
    startAnimation();
  };

  useEffect(() => {
    progress.value = 0;
    startAnimation();
    return () => cancelAnimation(progress);
  }, [currentIndex]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const story = userStories[currentIndex];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar hidden />
      
      {/* Background Image */}
      <Image source={{ uri: story.mediaUrl }} style={styles.media} resizeMode="cover" />
      
      {/* Navigation & Interaction Layer */}
      <View style={styles.overlay}>
        {/* Progress Bars */}
        <View style={styles.progressContainer}>
          {userStories.map((_, index) => (
            <View key={index} style={styles.progressBarBackground}>
              <Animated.View 
                style={[
                  styles.progressBar, 
                  index === currentIndex ? progressStyle : (index < currentIndex ? { width: '100%' } : { width: '0%' })
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

        {/* Tap areas for navigation */}
        <View style={styles.contentArea}>
          <Pressable 
            style={styles.tapSide} 
            onPress={prevStory}
            onLongPress={pauseAnimation}
            onPressOut={() => isPaused && resumeAnimation()}
          />
          <Pressable 
            style={styles.tapSide} 
            onPress={nextStory}
            onLongPress={pauseAnimation}
            onPressOut={() => isPaused && resumeAnimation()}
          />
        </View>

        {/* Footer Reply Section */}
        <View style={styles.footer}>
          <View style={styles.replyInputContainer}>
            <TextInput
              placeholder="Send message"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.replyInput}
              onFocus={pauseAnimation}
              onBlur={resumeAnimation}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  media: {
    width: width,
    height: height,
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
    height: 3,
  },
  progressBarBackground: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  closeBtn: {
    padding: 5,
  },
  contentArea: {
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
    backgroundColor: 'transparent',
  },
  replyInputContainer: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  replyInput: {
    color: '#FFF',
    fontSize: 15,
  },
  footerIcon: {
    marginLeft: 18,
  },
});
