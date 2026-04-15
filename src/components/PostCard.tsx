import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { theme } from '../theme/theme';
import { ChatCircle as MessageCircle, ShareNetwork as Share2, DotsThree as MoreHorizontal, ArrowFatUp as ArrowBigUp, ArrowFatDown as ArrowBigDown } from 'phosphor-react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { CommentSheet } from './CommentSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface PostCardProps {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    aura: number;
    isVerified?: boolean;
  };
  mediaUrl: string;
  caption: string;
  auraCount: number;
  timestamp: string;
  commentsCount: number;
  userVoted?: 'up' | 'down' | null;
}

export const PostCard: React.FC<PostCardProps> = ({
  id,
  user,
  mediaUrl,
  caption,
  auraCount,
  timestamp,
  commentsCount,
  userVoted,
}) => {
  const [showComments, setShowComments] = useState(false);
  const upvoteScale = useSharedValue(1);
  const downvoteScale = useSharedValue(1);

  const upvoteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: upvoteScale.value }],
  }));

  const downvoteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: downvoteScale.value }],
  }));

  const handleVote = (type: 'up' | 'down') => {
    if (type === 'up') {
      upvoteScale.value = withSpring(1.4, {}, () => {
        upvoteScale.value = withSpring(1);
      });
    } else {
      downvoteScale.value = withSpring(1.4, {}, () => {
        downvoteScale.value = withSpring(1);
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.nameContainer}>
            <View style={styles.usernameRow}>
              <Text style={styles.name}>{user.name}</Text>
              {user.isVerified && <View style={styles.verifyDot} />}
            </View>
            <Text style={styles.username}>@{user.username}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MoreHorizontal color={theme.colors.text.muted} size={20} />
        </TouchableOpacity>
      </View>

      {/* Media */}
      <View style={styles.mediaContainer}>
        <Image source={{ uri: mediaUrl }} style={styles.media} resizeMode="cover" />
      </View>

      {/* Interactions */}
      <View style={styles.interactions}>
        <View style={styles.leftActions}>
          <View style={styles.voteContainer}>
            <Animated.View style={upvoteStyle}>
              <TouchableOpacity onPress={() => handleVote('up')}>
                <ArrowBigUp
                  size={24}
                  color={userVoted === 'up' ? theme.colors.accent : theme.colors.text.primary}
                  weight={userVoted === 'up' ? "fill" : "regular"}
                />
              </TouchableOpacity>
            </Animated.View>
            <Text style={[styles.voteCount, userVoted === 'up' && styles.upvotedText, userVoted === 'down' && styles.downvotedText]}>
              {auraCount}
            </Text>
            <Animated.View style={downvoteStyle}>
              <TouchableOpacity onPress={() => handleVote('down')}>
                <ArrowBigDown
                  size={24}
                  color={userVoted === 'down' ? '#FF4500' : theme.colors.text.primary}
                  weight={userVoted === 'down' ? "fill" : "regular"}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={() => setShowComments(true)}>
            <MessageCircle size={22} color={theme.colors.text.primary} />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={22} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.caption}>
          <Text style={styles.captionUsername}>{user.username} </Text>
          {caption}
        </Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>

      {/* Comments Sheet Modal */}
      <Modal
        visible={showComments}
        animationType="none"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <GestureHandlerRootView style={styles.flex1}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalCloseArea} 
              activeOpacity={1} 
              onPress={() => setShowComments(false)} 
            />
            <CommentSheet targetId={id} onClose={() => setShowComments(false)} />
          </View>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
    backgroundColor: '#333',
  },
  nameContainer: {
    justifyContent: 'center',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.sm,
  },
  verifyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginLeft: 4,
  },
  username: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.size.xs,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  interactions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.xs,
    marginRight: theme.spacing.md,
  },
  voteCount: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    marginHorizontal: theme.spacing.xs,
    minWidth: 24,
    textAlign: 'center',
  },
  upvotedText: {
    color: theme.colors.accent,
  },
  downvotedText: {
    color: '#FF4500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  actionText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.sm,
    marginLeft: 6,
    fontWeight: theme.typography.weight.medium,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  caption: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.sm,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: theme.typography.weight.bold,
  },
  timestamp: {
    color: theme.colors.text.muted,
    fontSize: 10,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCloseArea: {
    flex: 1,
  },
});
