import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { StoryRing } from '../components/StoryRing';
import { PostCard } from '../components/PostCard';
import { mockPosts, mockStories, mockUsers } from '../data/mockDatabase';
import { Camera, PaperPlaneRight as Send } from 'phosphor-react-native';
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
    <View>
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
      <View style={styles.divider} />
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
          <TouchableOpacity>
            <Camera color={theme.colors.text.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.logo}>RODRIGO</Text>
          <TouchableOpacity>
            <Send color={theme.colors.text.primary} size={24} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={mockPosts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={HomeHeader}
          renderItem={({ item }) => (
            <View style={styles.postWrapper}>
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
            </View>
          )}

          contentContainerStyle={[styles.listContent, { paddingBottom: 80 + insets.bottom }]}
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  logo: {
    color: theme.colors.text.primary,
    fontSize: 20,
    fontWeight: theme.typography.weight.bold,
    letterSpacing: 4,
  },
  storiesContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  listContent: {
    paddingBottom: 80,
  },
  postWrapper: {
    paddingHorizontal: theme.spacing.sm,
  },
});
