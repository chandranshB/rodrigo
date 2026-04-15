import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { mockEvents } from '../data/mockDatabase';
import { CalendarBlank, Clock, PushPin, WarningCircle, Trophy, Sparkle } from 'phosphor-react-native';
import LinearGradient from 'react-native-linear-gradient';

const getUpdateConfig = (type: string) => {
  switch (type.toLowerCase()) {
    case 'fest': return { color: '#00D09C', icon: Sparkle, bg: 'rgba(0, 208, 156, 0.15)' };
    case 'competition': return { color: '#4CC9F0', icon: Trophy, bg: 'rgba(76, 201, 240, 0.15)' };
    case 'alert': return { color: '#FF4500', icon: WarningCircle, bg: 'rgba(255, 69, 0, 0.15)' };
    default: return { color: '#6C63FF', icon: PushPin, bg: 'rgba(108, 99, 255, 0.15)' };
  }
};

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.mainTitle}>Chronicle</Text>
    <Text style={styles.subTitle}>Official administration logs.</Text>
  </View>
);

export const UpdatesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const officialNotices = mockEvents.filter(e => e.isOfficial);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        <FlatList
          data={officialNotices}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={Header}
          contentContainerStyle={[styles.listContent, { paddingBottom: 80 + insets.bottom }]}
          renderItem={({ item, index }) => {
            const config = getUpdateConfig(item.type);
            const IconComponent = config.icon;
            const isLast = index === officialNotices.length - 1;
            
            return (
              <View style={styles.timelineRow}>
                {/* Timeline Guide (Left Side) */}
                <View style={styles.timelineGuide}>
                  <View style={[styles.timelineNode, { borderColor: config.color, shadowColor: config.color }]}>
                    <View style={[styles.timelineNodeInner, { backgroundColor: config.color }]} />
                  </View>
                  {!isLast && <View style={[styles.timelineLine, { borderColor: 'rgba(255,255,255,0.1)' }]} />}
                </View>

                {/* Timeline Content Card (Right Side) */}
                <View style={styles.timelineContent}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  
                  <TouchableOpacity style={styles.glassCard} activeOpacity={0.75}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
                      style={styles.cardGradient}
                    >
                      <View style={styles.cardHeader}>
                        <View style={styles.headerLeftTags}>
                          <View style={[styles.iconWrapper, { backgroundColor: config.bg }]}>
                            <IconComponent size={14} color={config.color} weight="fill" />
                          </View>
                          <Text style={[styles.tagText, { color: config.color }]}>
                            {item.type.toUpperCase()}
                          </Text>
                        </View>
                        
                        {item.auraBonus && (
                          <View style={styles.auraBonus}>
                            <Sparkle size={10} color="#00D09C" weight="fill" />
                            <Text style={styles.auraBonusText}>+{item.auraBonus}</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.noticeTitle}>{item.title}</Text>
                      <Text style={styles.noticeDescription} numberOfLines={3}>{item.description}</Text>
                      
                      <View style={styles.noticeFooter}>
                        <View style={styles.footerItem}>
                          <CalendarBlank size={12} color="rgba(255,255,255,0.4)" weight="bold" />
                          <Text style={styles.footerText}>{item.organizer}</Text>
                        </View>
                        <View style={styles.footerItem}>
                           <Clock size={12} color="rgba(255,255,255,0.4)" weight="bold" />
                           <Text style={styles.footerText}>Just now</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09090B', // Even darker for contrast
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 40,
    paddingLeft: 10,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineGuide: {
    width: 30,
    alignItems: 'center',
  },
  timelineNode: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    backgroundColor: '#09090B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    zIndex: 2,
    marginTop: 2,
  },
  timelineNodeInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginVertical: 4,
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 30,
  },
  dateText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  glassCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardGradient: {
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
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  auraBonus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 208, 156, 0.3)',
  },
  auraBonusText: {
    color: '#00D09C',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  noticeTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  noticeDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  noticeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    marginLeft: 6,
    fontWeight: '600',
  },
});
