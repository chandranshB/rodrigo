import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme/theme';

interface StoryRingProps {
  avatar: string;
  username: string;
  hasUnread: boolean;
  onPress: () => void;
}

export const StoryRing: React.FC<StoryRingProps> = ({ avatar, username, hasUnread, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.ringWrapper}>
        <LinearGradient
          colors={hasUnread ? theme.colors.gradient.story : ['#333', '#333']}
          style={styles.gradient}
        >
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
          </View>
        </LinearGradient>
      </View>
      <Text style={[styles.username, !hasUnread && styles.viewedText]} numberOfLines={1}>
        {username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    width: 72,
  },
  ringWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    padding: 2.5,
  },
  avatarWrapper: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: theme.colors.background,
    padding: 2,
  },
  avatar: {
    flex: 1,
    borderRadius: 30,
  },
  username: {
    color: theme.colors.text.primary,
    fontSize: 11,
    textAlign: 'center',
  },
  viewedText: {
    color: theme.colors.text.muted,
  },
});
