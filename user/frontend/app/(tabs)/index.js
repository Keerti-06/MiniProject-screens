import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, StatusBar, Platform 
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Added this

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  const [greeting, setGreeting] = useState("Good Morning");
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    // 1. Update Greeting based on time
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 16) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // 2. Load Name from Storage OR Navigation Params
    const loadName = async () => {
      try {
        // First priority: Check if a name was passed in navigation
        if (params?.userName) {
          setDisplayName(params.userName);
          // Save it so it persists on refresh
          await AsyncStorage.setItem("userName", params.userName);
        } else {
          // Second priority: Check if we have a saved name in storage
          const savedName = await AsyncStorage.getItem("userName");
          if (savedName) {
            setDisplayName(savedName);
          }
        }
      } catch (e) {
        console.log("Error loading name:", e);
      }
    };

    loadName();
  }, [params?.userName]); 

  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        
        {/* TOP ORANGE HEADER */}
        <LinearGradient 
          colors={['#FF4B2B', '#FF8C00']} 
          style={styles.headerGradient}
        >
          <SafeAreaView>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.greetingText}>{greeting}, {displayName} 👋</Text>
                <Text style={styles.subGreeting}>Your luggage service at your fingertips</Text>
              </View>
              <View style={styles.profileCircle}>
                <Text style={styles.profileInitial}>{displayInitial}</Text>
              </View>
            </View>

            {/* STATS ROW */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="package-variant" size={20} color="#FFF" />
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Deliveries</Text>
              </View>
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="star" size={20} color="#FFF" />
                <Text style={styles.statNumber}>4.9</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="clock-fast" size={20} color="#FFF" />
                <Text style={styles.statNumber}>30min</Text>
                <Text style={styles.statLabel}>Avg Time</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* CONTENT BODY */}
        <View style={styles.contentBody}>
          
          {/* HERO CARD */}
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => router.push('/(booking)/flight')} 
            style={styles.heroWrapper}
          >
            <LinearGradient colors={['#1A1C1E', '#2D3436']} style={styles.heroCard}>
              <View style={styles.popularTag}>
                <MaterialCommunityIcons name="fire" size={14} color="#FFF" />
                <Text style={styles.popularText}>POPULAR</Text>
              </View>

              <Text style={styles.heroTitle}>Book a Pickup</Text>
              <Text style={styles.heroSub}>
                Secure, fast, and reliable luggage transfer to any destination.
              </Text>
              
              <View style={styles.bookNowBtn}>
                <LinearGradient 
                  colors={['#FF4B2B', '#FF8C00']} 
                  start={{x:0, y:0}} end={{x:1, y:0}}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnText}>Book Now</Text>
                  <Feather name="arrow-right" size={18} color="#FFF" />
                </LinearGradient>
              </View>

              <MaterialCommunityIcons 
                name="package-variant-closed" 
                size={90} 
                color="rgba(255,255,255,0.03)" 
                style={styles.bgIcon} 
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* ACTIVE BOOKING */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Booking</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activeCard}>
            <View style={styles.cardTop}>
              <View style={styles.clockIconBg}>
                <Feather name="clock" size={24} color="#FFF" />
              </View>

              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>Order #SL2938</Text>
                <Text style={styles.orderRoute}>
                  Connaught Place — IGI Airport
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>In Transit</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '65%' }]} />
              </View>

              <View style={styles.progressLabels}>
                <Text style={styles.arrivalText}>Arriving in 25 mins</Text>
                <Text style={styles.percentText}>65%</Text>
              </View>
            </View>
          </View>

          {/* WHY CHOOSE US */}
          <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
            Why Choose Us?
          </Text>

          <View style={styles.featureRow}>
            <FeatureItem icon="shield-check" label="Secure" color="#EEF2FF" iconColor="#4F46E5" />
            <FeatureItem icon="map-marker-radius" label="Live Track" color="#ECFDF5" iconColor="#10B981" />
            <FeatureItem icon="airplane" label="Airline Safe" color="#F5F3FF" iconColor="#8B5CF6" />
            <FeatureItem icon="camera" label="Photo Proof" color="#FFF7ED" iconColor="#F59E0B" />
          </View>

          {/* RECENT ACTIVITY */}
          <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
            Recent Activity
          </Text>

          <View style={styles.recentCard}>
            <RecentItem id="#SL2901" date="Feb 20, 2026" />
            <View style={styles.divider} />
            <RecentItem id="#SL2845" date="Feb 15, 2026" />
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Sub Components ---------- */

function FeatureItem({ icon, label, color, iconColor }) {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIconBox, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

function RecentItem({ id, date }) {
  return (
    <View style={styles.recentRow}>
      <View>
        <Text style={styles.recentId}>{id}</Text>
        <Text style={styles.recentDate}>{date}</Text>
      </View>

      <View style={styles.deliveredBadge}>
        <Text style={styles.deliveredText}>Delivered</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerGradient: { 
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 25,
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20
  },
  greetingText: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  subGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileInitial: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 20
  },
  statBox: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center'
  },
  statNumber: { color: '#FFF', fontSize: 16, fontWeight: '800', marginTop: 4 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600' },
  contentBody: { paddingHorizontal: 20 },
  heroWrapper: { width: '100%', marginTop: 20, alignSelf: 'center' },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  popularTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12
  },
  popularText: { color: '#FFF', fontSize: 10, fontWeight: '900', marginLeft: 4 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 8, lineHeight: 18, width: '80%' },
  bookNowBtn: { marginTop: 20, width: 160 },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 15
  },
  btnText: { color: '#FFF', fontWeight: '800', marginRight: 8 },
  bgIcon: { position: 'absolute', right: -10, bottom: -10 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1C1E' },
  viewAll: { fontSize: 14, color: '#FF3B30', fontWeight: '700' },
  activeCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 2 },
  clockIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center'
  },
  orderInfo: { flex: 1, marginLeft: 15 },
  orderId: { fontSize: 16, fontWeight: '800', color: '#1A1C1E' },
  orderRoute: { fontSize: 12, color: '#8E8E93' },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  statusText: { color: '#10B981', fontSize: 11, fontWeight: '800' },
  progressContainer: { marginTop: 15 },
  progressBarBg: { height: 6, backgroundColor: '#F2F2F7', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: '#10B981', borderRadius: 3 },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  arrivalText: { fontSize: 12, color: '#8E8E93', fontWeight: '600' },
  percentText: { fontSize: 12, color: '#10B981', fontWeight: '800' },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  featureItem: { alignItems: 'center', width: '22%' },
  featureIconBox: {
    width: 55,
    height: 55,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  featureLabel: { fontSize: 11, color: '#4B5563', fontWeight: '700' },
  recentCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 15,
    marginBottom: 20
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  recentId: { fontSize: 14, fontWeight: '700', color: '#1A1C1E' },
  recentDate: { fontSize: 11, color: '#9CA3AF' },
  deliveredBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10
  },
  deliveredText: { fontSize: 11, color: '#6B7280', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 }
});