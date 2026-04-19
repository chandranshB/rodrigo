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
          colors={(hasUnread ? theme.colors.gradient.premium : [theme.colors.surfaceLight, theme.colors.surfaceLight]) as string[]}
          style={styles.gradient}
          start={{x: 0.0, y: 0.0}}
          end={{x: 1.0, y: 1.0}}
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
    marginRight: theme.spacing.lg,
    width: 80,
  },
  ringWrapper: {
    width: 76,
    height: 76,
    borderRadius: 24, // Squircle shape
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    padding: 3, // Thicker border
  },
  avatarWrapper: {
    flex: 1,
    borderRadius: 21,
    backgroundColor: theme.colors.background,
    padding: 3,
  },
  avatar: {
    flex: 1,
    borderRadius: 18,
  },
  username: {
    color: theme.colors.text.primary,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  viewedText: {
    color: theme.colors.text.secondary,
    fontWeight: '400',
  },
});
