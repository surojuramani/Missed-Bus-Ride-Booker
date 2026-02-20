import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  CheckCircle,
  MapPin,
  Bus,
  Car,
  Star,
  Clock,
  Navigation,
  Home,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useBooking } from '@/context/BookingContext';

const colors = Colors.dark;
const { width } = Dimensions.get('window');

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const {
    pickup,
    busInfo,
    selectedRide,
    selectedDriver,
    selectedPayment,
    totalPrice,
    distance,
    resetBooking,
  } = useBooking();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim, fadeAnim, slideAnim, pulseAnim]);

  const handleGoHome = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetBooking();
    router.replace('/');
  }, [resetBooking, router]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.successSection}>
        <View style={styles.checkContainer}>
          <Animated.View
            style={[
              styles.checkPulse,
              {
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.checkCircle,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <CheckCircle size={48} color={colors.black} />
          </Animated.View>
        </View>
        <Animated.Text style={[styles.successTitle, { opacity: fadeAnim }]}>
          Ride Booked!
        </Animated.Text>
        <Animated.Text style={[styles.successSubtitle, { opacity: fadeAnim }]}>
          Your driver is on the way
        </Animated.Text>
      </View>

      <Animated.View
        style={[
          styles.detailsCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>
              {selectedDriver?.avatar ?? '??'}
            </Text>
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>
              {selectedDriver?.name ?? 'Driver'}
            </Text>
            <View style={styles.ratingRow}>
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text style={styles.driverRating}>
                {selectedDriver?.rating ?? '-'}
              </Text>
            </View>
          </View>
          <View style={styles.etaContainer}>
            <Clock size={14} color={colors.accent} />
            <Text style={styles.etaText}>{selectedDriver?.eta ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.detailsDivider} />

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Car size={16} color={colors.accent} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Vehicle</Text>
            <Text style={styles.detailValue}>
              {selectedDriver?.vehicle ?? '-'} · {selectedDriver?.vehicleNumber ?? '-'}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MapPin size={16} color={colors.accent} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Pickup</Text>
            <Text style={styles.detailValue}>{pickup?.name ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Bus size={16} color={colors.warning} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Catch Bus</Text>
            <Text style={styles.detailValue}>
              {busInfo?.routeNumber ?? '-'} at {busInfo?.nextStop ?? '-'}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Navigation size={16} color={colors.textSecondary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailValue}>{distance} km</Text>
          </View>
        </View>

        <View style={styles.fareRow}>
          <View>
            <Text style={styles.fareLabel}>
              {selectedRide?.name ?? 'Ride'} · {selectedPayment?.name ?? 'Payment'}
            </Text>
            <Text style={styles.fareType}>
              {selectedPayment?.details ?? ''}
            </Text>
          </View>
          <Text style={styles.fareValue}>₹{totalPrice}</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={handleGoHome}
          activeOpacity={0.8}
          testID="go-home-btn"
        >
          <Home size={20} color={colors.black} />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  successSection: {
    alignItems: 'center' as const,
    paddingTop: 80,
    paddingBottom: 30,
  },
  checkContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 20,
  },
  checkPulse: {
    position: 'absolute' as const,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  successSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
  },
  detailsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  driverRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.accentLight,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  driverAvatarText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.accent,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  ratingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    marginTop: 2,
  },
  driverRating: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  etaContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  etaText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.accent,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 14,
    gap: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cardElevated,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginTop: 2,
  },
  fareRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.accentLight,
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
  },
  fareLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
  },
  fareType: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  fareValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: colors.accent,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  homeBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  homeBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.black,
  },
});