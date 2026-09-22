import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

// --- Dedicated Inline SVG Vector Icons ---
const ArrowLeftIcon = ({ size = 18, color = Colors.white }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const DollarSignIcon = ({ size = 18, color = Colors.accent }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </Svg>
);

const BuildingIcon = ({ size = 18, color = Colors.accent }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M6 22V2a2 2 0 012-2h8a2 2 0 012 2v20zM6 6h12M6 10h12M6 14h12M6 18h12" />
  </Svg>
);

const ShieldCheckIcon = ({ size = 18, color = Colors.accent }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

const TrendingUpIcon = ({ size = 18, color = Colors.accent }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M23 6l-9.5 9.5-5-5L1 18" />
    <Path d="M17 6h6v6" />
  </Svg>
);

const BellOffIcon = ({ size = 36, color = '#6EE7B7' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M13.73 21a2 2 0 01-3.46 0M18.63 13A17.89 17.89 0 0118 8M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14M1 1l22 22" />
  </Svg>
);

const initialNotifications = [
  {
    id: '1',
    title: 'Dividend Payout Received',
    description:
      'Your Q1 dividend of $120.00 from Riyadh Business Tower has been credited to your wallet.',
    time: '2 hours ago',
    unread: true,
    type: 'dividend',
  },
  {
    id: '2',
    title: 'New Property Dropped',
    description:
      'Dubai Marina Luxury Apartments is now open for fractional investment. Tap to view asset.',
    time: 'Yesterday',
    unread: true,
    type: 'property',
  },
  {
    id: '3',
    title: 'KYC Verified Successfully',
    description:
      'Your identity verification has been approved. You now have full access to trading.',
    time: '3 days ago',
    unread: false,
    type: 'kyc',
  },
  {
    id: '4',
    title: 'Secondary Market Trade Executed',
    description:
      'Your sell order for 2 shares of London Office Building was successfully filled.',
    time: '5 days ago',
    unread: false,
    type: 'trade',
  },
];

export const NotificationsScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, unread: false })));
  };

  const toggleReadStatus = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, unread: false } : item)),
    );
  };

  const filteredNotifications = notifications.filter(item =>
    filter === 'unread' ? item.unread : true,
  );

  const unreadCount = notifications.filter(item => item.unread).length;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'dividend':
        return <DollarSignIcon size={18} color={Colors.accent} />;
      case 'property':
        return <BuildingIcon size={18} color={Colors.accent} />;
      case 'kyc':
        return <ShieldCheckIcon size={18} color={Colors.accent} />;
      case 'trade':
        return <TrendingUpIcon size={18} color={Colors.accent} />;
      default:
        return <DollarSignIcon size={18} color={Colors.accent} />;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <ArrowLeftIcon size={18} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.8}>
          <Text style={styles.markReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs Row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}
          >
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'unread' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('unread')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'unread' && styles.filterTextActive,
            ]}
          >
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <BellOffIcon size={32} color="#6EE7B7" />
            </View>
            <Text style={styles.emptyTitle}>All Caught Up</Text>
            <Text style={styles.emptySubtitle}>
              You have no unread notifications at the moment. Check back later
              for updates.
            </Text>
          </View>
        ) : (
          filteredNotifications.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.notificationCard,
                item.unread && styles.notificationCardUnread,
              ]}
              activeOpacity={0.85}
              onPress={() => toggleReadStatus(item.id)}
            >
              <View style={styles.notificationThumbPlaceholder}>
                {renderIcon(item.type)}
              </View>
              <View style={styles.notificationInfo}>
                <View style={styles.notificationHeaderRow}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  {item.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationDesc}>{item.description}</Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03100B', // Deep emerald obsidian background tone
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.06)',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  headerTitle: {
    color: '#F0FDF4',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  markReadText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#061A12',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  filterTabActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  filterText: {
    color: '#6EE7B7',
    opacity: 0.7,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#34D399',
    opacity: 1,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 4,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#061A12',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.12)',
    marginBottom: 12,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationCardUnread: {
    borderColor: 'rgba(212, 175, 55, 0.35)', // Luxury gold accent ring for unread items
    backgroundColor: '#082017',
  },
  notificationThumbPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#09291D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
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
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  notificationDesc: {
    color: '#A7F3D0',
    opacity: 0.75,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  notificationTime: {
    color: '#6EE7B7',
    opacity: 0.5,
    fontSize: 11,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#061A12',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#F0FDF4',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
