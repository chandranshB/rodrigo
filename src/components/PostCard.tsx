import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { theme } from '../theme/theme';
import { ArrowUp, ArrowDown, ChatTeardrop, ShareNetwork, BookmarkSimple, DotsThree } from 'phosphor-react-native';
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
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(userVoted || null);
  
  // Calculate display count
  let displayAura = auraCount;
  if (userVoted === 'up') displayAura -= 1; // Assuming initial auraCount includes the upvote if userVoted === 'up'
  else if (userVoted === 'down') displayAura += 1;
  
  if (voteStatus === 'up') displayAura += 1;
  else if (voteStatus === 'down') displayAura -= 1;

  const upvoteScale = useSharedValue(1);
  const downvoteScale = useSharedValue(1);

  const upvoteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: upvoteScale.value }],
  }));

  const downvoteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: downvoteScale.value }],
  }));

  const handleVote = (type: 'up' | 'down') => {
    const springConfig = { damping: 15, stiffness: 300 };
    
    if (type === 'up') {
      if (voteStatus === 'up') setVoteStatus(null);
      else setVoteStatus('up');
      
      upvoteScale.value = withSpring(1.3, springConfig, () => {
        upvoteScale.value = withSpring(1, springConfig);
      });
    } else {
      if (voteStatus === 'down') setVoteStatus(null);
      else setVoteStatus('down');
      
      downvoteScale.value = withSpring(1.3, springConfig, () => {
        downvoteScale.value = withSpring(1, springConfig);
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
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>@{user.username}</Text>
              {user.isVerified && <View style={styles.verifyDot} />}
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <DotsThree color={theme.colors.text.secondary} size={24} weight="bold" />
        </TouchableOpacity>
      </View>

      {/* Media */}
      <View style={styles.mediaContainer}>
        <Image source={{ uri: mediaUrl }} style={styles.media} resizeMode="cover" />
      </View>

      {/* Interactions */}
      <View style={styles.interactions}>
        <View style={styles.leftActions}>
          
          <View style={styles.votePill}>
            <Animated.View style={upvoteStyle}>
              <TouchableOpacity onPress={() => handleVote('up')} style={styles.voteButton}>
                <ArrowUp
                  size={20}
                  color={voteStatus === 'up' ? theme.colors.accent : theme.colors.text.primary}
                  weight={voteStatus === 'up' ? "bold" : "regular"}
                />
              </TouchableOpacity>
            </Animated.View>
            
            <Text style={[
              styles.voteCount, 
              voteStatus === 'up' && styles.voteCountUp,
              voteStatus === 'down' && styles.voteCountDown
            ]}>
              {displayAura}
            </Text>
            
            <Animated.View style={downvoteStyle}>
              <TouchableOpacity onPress={() => handleVote('down')} style={styles.voteButton}>
                <ArrowDown
                  size={20}
                  color={voteStatus === 'down' ? '#FF3A44' : theme.colors.text.primary}
                  weight={voteStatus === 'down' ? "bold" : "regular"}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          <TouchableOpacity style={styles.actionIcon} onPress={() => setShowComments(true)}>
            <ChatTeardrop size={22} color={theme.colors.text.primary} weight="duotone" />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionIconOnly}>
            <ShareNetwork size={22} color={theme.colors.text.primary} weight="duotone" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionIconOnly}>
          <BookmarkSimple size={22} color={theme.colors.text.primary} weight="duotone" />
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
    marginBottom: theme.spacing.xl,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
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
    width: 44,
    height: 44,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: theme.colors.surfaceLight,
  },
  nameContainer: {
    justifyContent: 'center',
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  verifyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
    marginLeft: 6,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  username: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  moreButton: {
    padding: 8,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 12,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.background,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  interactions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 24,
    marginRight: 12,
  },
  voteButton: {
    padding: 6,
  },
  voteCount: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 4,
    minWidth: 20,
    textAlign: 'center',
  },
  voteCountUp: {
    color: theme.colors.accent,
  },
  voteCountDown: {
    color: '#FF3A44',
  },
  actionIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  actionIconActive: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconOnly: {
    padding: 8,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 20,
    marginRight: 8,
  },
  actionText: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionTextActive: {
    color: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  caption: {
    color: theme.colors.text.primary,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  captionUsername: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  timestamp: {
    color: theme.colors.text.muted,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCloseArea: {
    flex: 1,
  },
});
