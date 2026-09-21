import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

const notificationsList = [
  {
    id: '1',
    title: 'Dividend Payout Received',
    description:
      'Your Q1 dividend of $120.00 from Riyadh Business Tower has been credited to your wallet.',
    time: '2 hours ago',
    unread: true,
    icon: '💰',
  },
  {
    id: '2',
    title: 'New Property Dropped',
    description:
      'Dubai Marina Luxury Apartments is now open for fractional investment. Tap to view asset.',
    time: 'Yesterday',
    unread: true,
    icon: '🏢',
  },
  {
    id: '3',
    title: 'KYC Verified Successfully',
    description:
      'Your identity verification has been approved. You now have full access to trading.',
    time: '3 days ago',
    unread: false,
    icon: '🛡️',
  },
  {
    id: '4',
    title: 'Secondary Market Trade Executed',
    description:
      'Your sell order for 2 shares of London Office Building was successfully filled.',
    time: '5 days ago',
    unread: false,
    icon: '📈',
  },
];

export const NotificationsScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notificationsList.map(item => (
          <View
            key={item.id}
            style={[
              styles.notificationCard,
              item.unread && styles.notificationCardUnread,
            ]}
          >
            <View style={styles.notificationThumbPlaceholder}>
              <Text style={styles.notificationThumbIcon}>{item.icon}</Text>
            </View>
            <View style={styles.notificationInfo}>
              <View style={styles.notificationHeaderRow}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                {item.unread && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notificationDesc}>{item.description}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  markReadText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 6,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    gap: 12,
    opacity: 0.75,
  },
  notificationCardUnread: {
    opacity: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)', // subtle accent highlight for unread
    backgroundColor: '#1E293B',
  },
  notificationThumbPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationThumbIcon: {
    fontSize: 18,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  notificationDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  notificationTime: {
    color: '#64748B',
    fontSize: 10,
  },
});
