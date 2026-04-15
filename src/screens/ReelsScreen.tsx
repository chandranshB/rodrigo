import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, StatusBar, Modal } from 'react-native';
import { theme } from '../theme/theme';
import { mockReels, mockUsers } from '../data/mockDatabase';
import { Music, MessageCircle, Share2, MoreVertical, ArrowBigUp, ArrowBigDown, Zap } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withDelay } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { CommentSheet } from '../components/CommentSheet';

const { width, height: screenHeight } = Dimensions.get('window');

const ReelItem = ({ item, isVisible }: { item: any, isVisible: boolean }) => {
  const user = mockUsers[item.userId];
  const insets = useSafeAreaInsets();
  const [showComments, setShowComments] = useState(false);
  
  // Interaction Animations
  const upvoteScale = useSharedValue(1);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const upvoteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: upvoteScale.value }],
  }));

  const heartOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  const handleUpvote = () => {
    upvoteScale.value = withSequence(
      withSpring(1.5),
      withSpring(1)
    );
  };

  const onDoubleTap = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      handleUpvote();
      heartScale.value = withSequence(
        withSpring(1.5),
        withDelay(500, withSpring(0))
      );
      heartOpacity.value = withSequence(
        withSpring(1),
        withDelay(500, withSpring(0))
      );
    }
  };

  return (
    <View style={[styles.reelContainer, { height: screenHeight }]}>
      <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
        <View style={StyleSheet.absoluteFill}>
          <Image source={{ uri: item.mediaUrl }} style={styles.media} resizeMode="cover" />
          
          {/* Double Tap Heart Overlay */}
          <Animated.View style={[styles.heartOverlay, heartOverlayStyle]}>
            <Zap size={80} color={theme.colors.accent} fill={theme.colors.accent} />
          </Animated.View>

          {/* Overlay Content */}
          <View style={[styles.overlay, { paddingBottom: 60 + insets.bottom }]}>
            <View style={styles.rightActions}>
              <Animated.View style={upvoteStyle}>
                <TouchableOpacity style={styles.actionItem} onPress={handleUpvote}>
                  <ArrowBigUp size={36} color={theme.colors.accent} fill={theme.colors.accent} />
                  <Text style={styles.actionText}>{item.auraCount}</Text>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity style={styles.actionItem}>
                <ArrowBigDown size={36} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={() => setShowComments(true)}>
                <MessageCircle size={32} color="#FFF" />
                <Text style={styles.actionText}>{item.commentsCount}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem}>
                <Share2 size={30} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem}>
                <MoreVertical size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomInfo}>
              <View style={styles.userRow}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <Text style={styles.username}>{user.username}</Text>
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
              <View style={styles.musicRow}>
                <Music size={14} color="#FFF" />
                <Text style={styles.musicName}>{item.musicName}</Text>
              </View>
            </View>
          </View>
        </View>
      </TapGestureHandler>

      {/* Comments Sheet Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalCloseArea} 
            activeOpacity={1} 
            onPress={() => setShowComments(false)} 
          />
          <CommentSheet targetId={item.id} onClose={() => setShowComments(false)} />
        </View>
      </Modal>
    </View>
  );
};

export const ReelsScreen: React.FC = () => {
  const [viewableItems, setViewableItems] = useState<any>([]);
  
  const onViewableItemsChanged = useRef(({ viewableItems: vs }: any) => {
    setViewableItems(vs);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        data={mockReels}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ReelItem 
            item={item} 
            isVisible={viewableItems.some((v: any) => v.index === index)} 
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        // Professional Scrolling Optimizations
        disableIntervalMomentum={true} // Crucial for one-at-a-time feel
        windowSize={3}
        maxToRenderPerBatch={1}
        initialNumToRender={1}
        removeClippedSubviews={true}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      
      <View style={styles.reelsHeader}>
        <Text style={styles.headerTitle}>Reels</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelContainer: {
    width: width,
  },
  media: {
    width: width,
    height: '100%',
  },
  heartOverlay: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-end',
  },
  reelsHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 10,
  },
  rightActions: {
    position: 'absolute',
    right: 15,
    bottom: 120,
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: 22,
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 5,
  },
  bottomInfo: {
    paddingHorizontal: 15,
    width: '85%',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#FFF',
    marginRight: 12,
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 5,
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.2,
    borderColor: '#FFF',
  },
  followText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  caption: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 5,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicName: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 5,
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
