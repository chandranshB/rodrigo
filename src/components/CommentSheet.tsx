import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { theme } from '../theme/theme';
import { mockComments, mockUsers } from '../data/mockDatabase';
import { PaperPlaneRight as Send, X, ArrowFatUp as ArrowBigUp } from 'phosphor-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.85;
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT * 0.5;

interface CommentSheetProps {
  targetId: string;
  onClose: () => void;
}

export const CommentSheet: React.FC<CommentSheetProps> = ({ targetId, onClose }) => {
  const translateY = useSharedValue(0);
  const contextY = useSharedValue(0);
  const filteredComments = mockComments.filter(c => c.targetId === targetId);

  const scrollTo = (destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, { damping: 20, stiffness: 90 });
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      contextY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + contextY.value;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd((event) => {
      if (translateY.value > -SCREEN_HEIGHT / 3 || event.velocityY > 500) {
        scrollTo(0);
        runOnJS(onClose)();
      } else if (translateY.value < -SCREEN_HEIGHT * 0.7) {
        scrollTo(MAX_TRANSLATE_Y);
      } else {
        scrollTo(MIN_TRANSLATE_Y);
      }
    });

  useEffect(() => {
    scrollTo(MIN_TRANSLATE_Y);
  }, []);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 10],
      Extrapolate.CLAMP
    );

    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={styles.sheetWrapper}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container, rBottomSheetStyle]}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredComments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const user = mockUsers[item.userId];
              if (!user) return null;
              return (
                <View style={styles.commentItem}>
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.username}>{user.username}</Text>
                      <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <View style={styles.commentFooter}>
                      <TouchableOpacity style={styles.replyBtn}>
                        <Text style={styles.replyText}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.voteContainer}>
                    <ArrowBigUp size={18} color={theme.colors.text.muted} />
                    <Text style={styles.voteCount}>{item.auraCount}</Text>
                  </View>
                </View>
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.inputArea}>
            <Image source={{ uri: mockUsers.u1.avatar }} style={styles.inputAvatar} />
            <TextInput
              placeholder="Add a comment..."
              placeholderTextColor={theme.colors.text.muted}
              style={styles.input}
              multiline
            />
            <TouchableOpacity style={styles.sendBtn}>
              <Send size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  container: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: theme.colors.surface,
    position: 'absolute',
    top: SCREEN_HEIGHT,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    paddingBottom: 250,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    color: theme.colors.text.primary,
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 8,
  },
  timestamp: {
    color: theme.colors.text.muted,
    fontSize: 11,
  },
  commentText: {
    color: theme.colors.text.primary,
    fontSize: 14,
    lineHeight: 20,
  },
  commentFooter: {
    flexDirection: 'row',
    marginTop: 8,
  },
  replyBtn: {
    marginRight: 15,
  },
  replyText: {
    color: theme.colors.text.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  voteContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 35,
  },
  voteCount: {
    color: theme.colors.text.muted,
    fontSize: 11,
    marginTop: 2,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  inputAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendBtn: {
    padding: 10,
  },
});
