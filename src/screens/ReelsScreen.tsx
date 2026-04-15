import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, StatusBar, Modal } from 'react-native';
import { theme } from '../theme/theme';
import { mockReels, mockUsers } from '../data/mockDatabase';
import { MusicNotes as Music, ChatCircle as MessageCircle, ShareNetwork as Share2, DotsThreeVertical as MoreVertical, ArrowFatUp as ArrowBigUp, ArrowFatDown as ArrowBigDown, Lightning as Zap } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withDelay } from 'react-native-reanimated';
import { TapGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { CommentSheet } from '../components/CommentSheet';

const { width, height: screenHeight } = Dimensions.get('window');

const ReelItem = React.memo(({ item, _isVisible }: { item: any, _isVisible: boolean }) => {
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
    const springConfig = { damping: 15, stiffness: 300 };
    upvoteScale.value = withSequence(
      withSpring(1.5, springConfig),
      withSpring(1, springConfig)
    );
  };

  const onDoubleTap = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      handleUpvote();
      const springConfig = { damping: 20, stiffness: 300 };
      heartScale.value = withSequence(
        withSpring(1.5, springConfig),
        withDelay(500, withSpring(0, springConfig))
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
          <Animated.View style={[styles.heartOverlay, heartOverlayStyle]} pointerEvents="none">
            <Zap size={80} color={theme.colors.accent} weight="fill" />
          </Animated.View>

          {/* Overlay Content */}
          <View style={[styles.overlay, { paddingBottom: 75 + insets.bottom }]} pointerEvents="box-none">
            <View style={[styles.rightActions, { bottom: 90 + insets.bottom }]} pointerEvents="box-none">
              <Animated.View style={upvoteStyle}>
                <TouchableOpacity style={styles.actionItem} onPress={handleUpvote} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.7}>
                  <ArrowBigUp size={32} color={theme.colors.accent} weight="fill" />
                  <Text style={styles.actionText}>{item.auraCount}</Text>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity style={styles.actionItem} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.7}>
                <ArrowBigDown size={32} color="#FFF" weight="duotone" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={() => setShowComments(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.7}>
                <MessageCircle size={32} color="#FFF" weight="duotone" />
                <Text style={styles.actionText}>{item.commentsCount}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.7}>
                <Share2 size={32} color="#FFF" weight="duotone" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.7}>
                <MoreVertical size={28} color="#FFF" weight="bold" />
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
        animationType="fade"
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
            <CommentSheet targetId={item.id} onClose={() => setShowComments(false)} />
          </View>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
});

export const ReelsScreen: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  
  const onViewableItemsChanged = useRef(({ viewableItems: vs }: any) => {
    if (vs.length > 0) {
      setActiveItemId(vs[0].item.id);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const keyExtractor = useCallback((item: any) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: screenHeight,
    offset: screenHeight * index,
    index,
  }), []);

  const renderItem = useCallback(({ item }: any) => (
    <ReelItem 
      item={item} 
      _isVisible={activeItemId === item.id} 
    />
  ), [activeItemId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        data={mockReels}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
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
  flex1: {
    flex: 1,
  },
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
    ...StyleSheet.absoluteFill as any,
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
