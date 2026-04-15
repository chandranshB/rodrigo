import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { mockEvents } from '../data/mockDatabase';
import { Megaphone, CalendarBlank, CaretRight, Clock, ShieldCheck, PushPin, WarningCircle, Trophy, Sparkle } from 'phosphor-react-native';
import LinearGradient from 'react-native-linear-gradient';

const getUpdateConfig = (type: string) => {
  switch (type.toLowerCase()) {
    case 'fest': return { color: '#00D09C', icon: Sparkle, bg: 'rgba(0, 208, 156, 0.15)' };
    case 'competition': return { color: '#4CC9F0', icon: Trophy, bg: 'rgba(76, 201, 240, 0.15)' };
    case 'alert': return { color: '#FF4500', icon: WarningCircle, bg: 'rgba(255, 69, 0, 0.15)' };
    default: return { color: '#6C63FF', icon: PushPin, bg: 'rgba(108, 99, 255, 0.15)' };
  }
};

const OfficialHeader = () => (
  <View style={styles.listHeader}>
    <LinearGradient
      colors={['rgba(108, 99, 255, 0.25)', 'rgba(63, 55, 201, 0.05)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.noticeBanner}
    >
      <View style={styles.bannerIconWrapper}>
        <ShieldCheck size={28} color={theme.colors.primary} weight="fill" />
      </View>
      <View style={styles.bannerTextContent}>
        <Text style={styles.noticeBannerText}>Verified Administration</Text>
        <Text style={styles.noticeBannerSub}>Authorized communications channel.</Text>
      </View>
    </LinearGradient>
    <Text style={styles.sectionTitle}>Latest Bulletins</Text>
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
          <View>
            <Text style={styles.headerTitle}>Updates</Text>
            <Text style={styles.headerSubtitle}>Official campus news</Text>
          </View>
          <View style={styles.headerIconContainer}>
            <Megaphone color={theme.colors.primary} size={28} weight="duotone" />
          </View>
        </View>

        <FlatList
          data={officialNotices}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={OfficialHeader}
          renderItem={({ item }) => {
            const config = getUpdateConfig(item.type);
            const IconComponent = config.icon;
            
            return (
              <TouchableOpacity style={styles.noticeCard} activeOpacity={0.75}>
                <View style={[styles.typeIndicator, { backgroundColor: config.color }]} />
                <View style={styles.cardContent}>
                  
                  <View style={styles.cardHeader}>
                    <View style={styles.headerLeftTags}>
                      <View style={[styles.iconWrapper, { backgroundColor: config.bg }]}>
                        <IconComponent size={16} color={config.color} weight="fill" />
                      </View>
                      <View style={styles.tagWrapper}>
                         <Text style={[styles.tagText, { color: config.color }]}>{item.type.toUpperCase()}</Text>
                      </View>
                    </View>
                    
                    {item.auraBonus && (
                      <View style={styles.auraBonus}>
                        <Sparkle size={12} color="#00D09C" weight="fill" />
                        <Text style={styles.auraBonusText}>+{item.auraBonus} Aura</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.noticeTitle}>{item.title}</Text>
                  <Text style={styles.noticeDescription} numberOfLines={3}>{item.description}</Text>
                  
                  <View style={styles.noticeFooter}>
                    <View style={styles.footerItem}>
                      <Clock size={14} color={theme.colors.text.muted} weight="bold" />
                      <Text style={styles.footerText}>{item.date}</Text>
                    </View>
                    <View style={styles.footerItem}>
                      <CalendarBlank size={14} color={theme.colors.text.muted} weight="bold" />
                      <Text style={styles.footerText}>{item.organizer}</Text>
                    </View>
                  </View>

                </View>
              </TouchableOpacity>
            );
          }}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: theme.typography.weight.bold,
  },
  headerSubtitle: {
    color: theme.colors.text.muted,
    fontSize: 14,
    marginTop: 4,
  },
  headerIconContainer: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    padding: 10,
    borderRadius: 20,
  },
  listHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  bannerIconWrapper: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    padding: 10,
    borderRadius: 14,
    marginRight: 16,
  },
  bannerTextContent: {
    flex: 1,
  },
  noticeBannerText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noticeBannerSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  sectionTitle: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  noticeCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  typeIndicator: {
    width: 4,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeftTags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  tagWrapper: {},
  tagText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  auraBonus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 208, 156, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.3)',
  },
  auraBonusText: {
    color: '#00D09C',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  noticeTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  noticeDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  noticeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 0,
  },
});
