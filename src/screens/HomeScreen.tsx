import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { StoryRing } from '../components/StoryRing';
import { PostCard } from '../components/PostCard';
import { mockPosts, mockStories, mockUsers } from '../data/mockDatabase';
import { Bell, MagnifyingGlass } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

const HomeHeader = () => {
  const navigation = useNavigation<any>();

  // Deduplicate: one ring per user, in order of first appearance
  const storyUsers = mockStories.reduce<string[]>((acc, s) => {
    if (!acc.includes(s.userId)) acc.push(s.userId);
    return acc;
  }, []);

  const hasUnread = (userId: string) =>
    mockStories.some(s => s.userId === userId && !s.viewed);

  return (
    <View style={styles.storiesSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
      >
        <StoryRing
          avatar={mockUsers.u1.avatar}
          username="Your Story"
          hasUnread={false}
          onPress={() => {}}
        />
        {storyUsers.map((userId, index) => (
          <StoryRing
            key={userId}
            avatar={mockUsers[userId].avatar}
            username={mockUsers[userId].username}
            hasUnread={hasUnread(userId)}
            onPress={() => navigation.navigate('StoryViewer', {
              userIds: storyUsers,
              initialUserIndex: index,
            })}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Feed</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <MagnifyingGlass color={theme.colors.text.primary} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell color={theme.colors.text.primary} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Image source={{ uri: mockUsers.u1.avatar }} style={styles.profileAvatar} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={mockPosts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={HomeHeader}
          renderItem={({ item }) => (
            <PostCard
              id={item.id}
              user={mockUsers[item.userId]}
              mediaUrl={item.mediaUrl}
              caption={item.caption}
              auraCount={item.auraCount}
              timestamp={item.timestamp}
              commentsCount={item.commentsCount}
              userVoted={item.userVoted}
            />
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 16,
  },
  profileButton: {
    marginLeft: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 18,
    padding: 2,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 14,
  },
  storiesSection: {
    marginBottom: theme.spacing.lg,
  },
  storiesContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  listContent: {
    paddingBottom: 100,
  },
});
