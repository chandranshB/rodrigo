import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { mockUsers, mockPosts } from '../data/mockDatabase';
import LinearGradient from 'react-native-linear-gradient';
import { AuraBadge } from '../components/AuraBadge';
import { Gear as Settings, PencilSimple as Edit2, GridFour as Grid, BookmarkSimple as Bookmark, Tag } from 'phosphor-react-native';

const { width } = Dimensions.get('window');

const THEMES = [
  ['#6C63FF', '#3F37C9'],
  ['#FF6584', '#F72585'],
  ['#00D09C', '#4CC9F0'],
  ['#F72585', '#7209B7'],
  ['#4361EE', '#4CC9F0'],
];

export const ProfileScreen: React.FC = () => {
  const user = mockUsers.u1;
  const [currentTheme, setCurrentTheme] = useState(user.profileTheme || THEMES[0]);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={currentTheme[0]} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}>
          {/* Profile Header with Gradient */}
          <LinearGradient colors={currentTheme} style={styles.headerGradient}>
            <View style={styles.headerTopActions}>
              <TouchableOpacity style={styles.iconBtn}>
                <Settings color="#FFF" size={24} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfoContainer}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <TouchableOpacity style={styles.editAvatarBtn}>
                  <Edit2 color="#FFF" size={14} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.username}>@{user.username}</Text>
              
              <View style={styles.auraContainer}>
                <AuraBadge score={user.aura} />
              </View>
            </View>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.bio}>{user.bio}</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1.2k</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>452</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>

            {/* Theme Selector */}
            <Text style={styles.sectionTitle}>Customise Theme</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeSelector}>
              {THEMES.map((t, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => setCurrentTheme(t)}
                  style={[
                    styles.themeOption,
                    currentTheme[0] === t[0] && styles.activeThemeOption
                  ]}
                >
                  <LinearGradient colors={t} style={styles.themeCircle} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Grid size={20} color={theme.colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Bookmark size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Tag size={20} color={theme.colors.text.muted} />
              </TouchableOpacity>
            </View>

            {/* Grid of Posts */}
            <View style={styles.postsGrid}>
              {mockPosts.concat(mockPosts).map((post, index) => (
                <Image 
                  key={index} 
                  source={{ uri: post.mediaUrl }} 
                  style={styles.gridImage} 
                />
              ))}
            </View>
          </View>
        </ScrollView>
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
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTopActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    marginBottom: 10,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },
  profileInfoContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: {
    color: '#FFF',
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
  },
  username: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: theme.typography.size.sm,
    marginBottom: theme.spacing.sm,
  },
  auraContainer: {
    marginTop: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.md,
  },
  bio: {
    color: theme.colors.text.primary,
    textAlign: 'center',
    fontSize: theme.typography.size.sm,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.bold,
  },
  statLabel: {
    color: theme.colors.text.muted,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    fontWeight: theme.typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  themeSelector: {
    marginBottom: theme.spacing.xl,
  },
  themeOption: {
    marginRight: theme.spacing.md,
    padding: 3,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThemeOption: {
    borderColor: theme.colors.primary,
  },
  themeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridImage: {
    width: width / 3 - 2,
    height: width / 3 - 2,
    margin: 1,
    backgroundColor: theme.colors.surface,
  },
});
