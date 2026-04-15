import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { mockEvents, mockCommunities } from '../data/mockDatabase';
import { Calendar, ChevronRight, Info, Zap, Users, TrendingUp } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const ExploreHeader = () => (
  <View style={styles.listHeader}>
    {/* Community Discovery Section */}
    <Text style={styles.sectionTitle}>Trending Communities</Text>
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.communityScroll}
    >
      {mockCommunities.map((community) => (
        <TouchableOpacity key={community.id} style={styles.communityCard}>
          <Image source={{ uri: community.banner }} style={styles.communityBanner} />
          <View style={styles.communityInfo}>
            <View style={styles.communityIconContainer}>
              <Image source={{ uri: community.icon }} style={styles.communityIcon} />
            </View>
            <Text style={styles.communityName}>r/{community.slug}</Text>
            <Text style={styles.memberCount}>{community.memberCount} members</Text>
            <TouchableOpacity style={styles.joinBtn}>
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>

    <View style={styles.divider} />

    {/* Featured Event / Aura Boost */}
    <LinearGradient
      colors={['rgba(108, 99, 255, 0.2)', 'rgba(0, 0, 0, 0)']}
      style={styles.heroCard}
    >
      <View style={styles.heroHeader}>
        <TrendingUp size={20} color={theme.colors.primary} />
        <Text style={styles.heroTag}>Trending Event</Text>
      </View>
      <Text style={styles.heroTitle}>Aurora Fest 2026</Text>
      <Text style={styles.heroDescription}>
        The biggest inter-college cultural festival is live. Participate now to earn up to 500 Aura!
      </Text>
      <TouchableOpacity style={styles.heroBtn}>
        <Text style={styles.heroBtnText}>View Details</Text>
      </TouchableOpacity>
    </LinearGradient>

    <Text style={styles.sectionTitle}>Official Updates</Text>
  </View>
);

const getTypeColor = (type: string) => {
  switch (type) {
    case 'fest': return theme.colors.secondary;
    case 'competition': return theme.colors.primary;
    case 'announcement': return '#FFA500';
    default: return theme.colors.accent;
  }
};

export const UpdatesScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Explore</Text>
            <Text style={styles.headerSubtitle}>Discover communities & events</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <Users color={theme.colors.text.primary} size={20} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={mockEvents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ExploreHeader}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.eventCard}>
              <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  {item.auraBonus && (
                    <View style={styles.auraBonus}>
                      <Zap size={10} color={theme.colors.accent} fill={theme.colors.accent} />
                      <Text style={styles.auraBonusText}>+{item.auraBonus}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.eventDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.eventFooter}>
                  <View style={styles.eventInfo}>
                    <Calendar size={12} color={theme.colors.text.muted} />
                    <Text style={styles.eventInfoText}>{item.date}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Info size={12} color={theme.colors.text.muted} />
                    <Text style={styles.eventInfoText}>{item.organizer}</Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={20} color={theme.colors.text.muted} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
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
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    color: theme.colors.text.primary,
    fontSize: 28,
    fontWeight: theme.typography.weight.bold,
  },
  headerSubtitle: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.size.sm,
  },
  searchBtn: {
    backgroundColor: theme.colors.surface,
    padding: 10,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listHeader: {
    paddingTop: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.bold,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  communityScroll: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  communityCard: {
    width: 200,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  communityBanner: {
    width: '100%',
    height: 60,
  },
  communityInfo: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  communityIconContainer: {
    marginTop: -30,
    padding: 3,
    backgroundColor: theme.colors.surface,
    borderRadius: 25,
  },
  communityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  communityName: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.sm,
    marginTop: 4,
  },
  memberCount: {
    color: theme.colors.text.muted,
    fontSize: 10,
    marginBottom: 8,
  },
  joinBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    width: '100%',
    alignItems: 'center',
  },
  joinBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: theme.typography.weight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
  },
  heroCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.xl,
    marginHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroTag: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: 6,
  },
  heroTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    marginBottom: theme.spacing.xs,
  },
  heroDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.sm,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  heroBtn: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },
  heroBtnText: {
    color: '#FFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.sm,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.bold,
    marginRight: theme.spacing.sm,
  },
  auraBonus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  auraBonusText: {
    color: theme.colors.accent,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  eventDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.sm,
    marginBottom: theme.spacing.sm,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  eventInfoText: {
    color: theme.colors.text.muted,
    fontSize: 10,
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 80,
  },
});
