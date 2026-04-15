import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { mockEvents } from '../data/mockDatabase';
import { Megaphone, Calendar, ChevronRight, Clock, ShieldCheck } from 'lucide-react-native';

const OfficialHeader = () => (
  <View style={styles.listHeader}>
    <View style={styles.noticeBanner}>
      <ShieldCheck size={20} color={theme.colors.primary} />
      <Text style={styles.noticeBannerText}>Verified Institutional Channel</Text>
    </View>
    <Text style={styles.sectionTitle}>Current Bulletins</Text>
  </View>
);

export const UpdatesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const officialNotices = mockEvents.filter(e => e.isOfficial);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Updates</Text>
          <Megaphone color={theme.colors.primary} size={24} />
        </View>

        <FlatList
          data={officialNotices}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={OfficialHeader}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.noticeCard}>
              <View style={styles.noticeTypeBadge}>
                <Text style={styles.noticeTypeText}>{item.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.noticeTitle}>{item.title}</Text>
              <Text style={styles.noticeDescription}>{item.description}</Text>
              
              <View style={styles.noticeFooter}>
                <View style={styles.footerItem}>
                  <Clock size={14} color={theme.colors.text.muted} />
                  <Text style={styles.footerText}>{item.date}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Calendar size={14} color={theme.colors.text.muted} />
                  <Text style={styles.footerText}>{item.organizer}</Text>
                </View>
                <ChevronRight size={18} color={theme.colors.text.muted} style={styles.chevron} />
              </View>
            </TouchableOpacity>
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
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    color: theme.colors.text.primary,
    fontSize: 24,
    fontWeight: theme.typography.weight.bold,
  },
  listHeader: {
    padding: theme.spacing.md,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    padding: 12,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  noticeBannerText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noticeCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  noticeTypeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  noticeTypeText: {
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: 'bold',
  },
  noticeTitle: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noticeDescription: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  noticeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  footerText: {
    color: theme.colors.text.muted,
    fontSize: 12,
    marginLeft: 6,
  },
  chevron: {
    marginLeft: 'auto',
  },
  listContent: {
    paddingTop: 10,
  },
});
