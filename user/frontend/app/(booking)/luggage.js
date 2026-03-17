import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Image, SafeAreaView, Platform, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router'; // ADDED PARAM HOOK

export default function LuggageDetails() {
  const router = useRouter();
  const flightParams = useLocalSearchParams(); // CATCHING PREVIOUS DATA
  
  const [bagCount, setBagCount] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState(['checkin']);
  const [selectedWeight, setSelectedWeight] = useState('10-20 kg');
  const [photos, setPhotos] = useState([]);

  const toggleType = (id) => {
    setSelectedTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const takePhoto = async (indexToReplace = null) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false, 
        quality: 0.8,
      });

      if (!result.canceled) {
        const newUri = result.assets[0].uri;
        if (indexToReplace !== null) {
          const updatedPhotos = [...photos];
          updatedPhotos[indexToReplace] = newUri;
          setPhotos(updatedPhotos);
        } else {
          setPhotos([...photos, newUri]);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerAction}>
          <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Pickup</Text>
        <View style={styles.headerAction} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.stepperRow}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCompleted]}>
              <Ionicons name="checkmark" size={16} color="#FFF" />
            </View>
            <Text style={styles.stepLabelActive}>Flight Info</Text>
          </View>
          <View style={[styles.stepLine, { backgroundColor: '#10B981' }]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCurrent]}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={styles.stepLabelActive}>Luggage</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumGray}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Pickup</Text>
          </View>
        </View>

        <View style={styles.infoBanner}>
          <View style={styles.orangeIconCircle}><Ionicons name="cube" size={20} color="#FFF" /></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Luggage Details</Text>
            <Text style={styles.infoSub}>Tell us about your baggage for a smooth pickup</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.innerLabel}>How many bags?</Text>
          <View style={styles.counterMainRow}>
            <TouchableOpacity onPress={() => setBagCount(Math.max(1, bagCount - 1))} style={styles.counterSquareBtn}>
              <Ionicons name="remove" size={24} color="#1A1C1E" />
            </TouchableOpacity>
            <View style={styles.counterDisplay}>
              <Text style={styles.counterBigNum}>{bagCount}</Text>
              <Text style={styles.counterSubText}>bag</Text>
            </View>
            <TouchableOpacity onPress={() => setBagCount(bagCount + 1)} style={styles.counterSquareBtnAdd}>
              <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Luggage Type (Select all that apply)</Text>
        <View style={styles.gridContainer}>
          {[
            { id: 'cabin', label: 'Cabin', sub: 'Up to 7kg', icon: '🎒' },
            { id: 'checkin', label: 'Check-in', sub: 'Up to 23kg', icon: '🧳' },
            { id: 'oversized', label: 'Oversized', sub: 'Heavy items', icon: '📦' },
            { id: 'fragile', label: 'Fragile', sub: 'Handle with care', icon: '⚠️' }
          ].map((item) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => toggleType(item.id)}
              style={[styles.gridItem, selectedTypes.includes(item.id) && styles.gridItemActive]}
            >
              <Text style={{fontSize: 24, marginBottom: 8}}>{item.icon}</Text>
              <Text style={[styles.gridLabel, selectedTypes.includes(item.id) && styles.gridLabelActive]}>{item.label}</Text>
              <Text style={styles.gridSub}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Total Weight (approx.)</Text>
        <View style={styles.weightGrid}>
          {['Under 10 kg', '10-20 kg', '20-30 kg', 'Over 30 kg'].map((weight) => (
            <TouchableOpacity 
              key={weight}
              onPress={() => setSelectedWeight(weight)}
              style={[styles.weightBtn, selectedWeight === weight && styles.weightBtnActive]}
            >
              <Text style={[styles.weightText, selectedWeight === weight && styles.weightTextActive]}>{weight}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Photo Proof (Optional)</Text>
        <View style={styles.sectionCard}>
          {photos.length === 0 ? (
            <TouchableOpacity style={styles.uploadBox} onPress={() => takePhoto()}>
              <Ionicons name="camera-outline" size={32} color="#D1D5DB" />
              <Text style={styles.uploadText}>Capture Bag Photos</Text>
              <Text style={styles.uploadSubText}>Keep the full bag in view</Text>
            </TouchableOpacity>
          ) : (
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                {photos.map((uri, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri }} style={styles.previewImg} resizeMode="cover" />
                    <TouchableOpacity style={styles.retakeOverlay} onPress={() => takePhoto(index)}>
                      <Ionicons name="refresh" size={14} color="#FFF" />
                      <Text style={styles.retakeText}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => setPhotos(photos.filter((_, i) => i !== index))}>
                      <Ionicons name="close-circle" size={20} color="#FF3B2F" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addMoreBtn} onPress={() => takePhoto()}>
                  <Ionicons name="add" size={30} color="#D1D5DB" />
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </View>

        {/* UPDATED ACTION: Passing BOTH Flight and Luggage data to Pickup */}
        <TouchableOpacity 
  style={styles.nextBtn} 
  onPress={() => router.push({
    // Added the parentheses here to correctly target the (booking) group
    pathname: '/(booking)/pickup', 
    params: {
      ...flightParams, // Airline, Flight, Route, Time
      bags: bagCount,
      weight: selectedWeight,
      luggageTypes: selectedTypes.join(', ')
    }
  })}
>
  <LinearGradient 
    colors={['#FF5F5F', '#FF8C00']} 
    start={{x:0, y:0}} 
    end={{x:1, y:0}} 
    style={styles.gradient}
  >
    <Text style={styles.nextBtnText}>Continue to Pickup Details</Text>
  </LinearGradient>
</TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, paddingBottom: 15, alignItems: 'center' },
  headerAction: { width: 40 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1C1E' },
  scrollContent: { paddingHorizontal: 20 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  stepCompleted: { backgroundColor: '#10B981' },
  stepCurrent: { backgroundColor: '#FF3B2F' },
  stepNum: { color: '#FFF', fontWeight: 'bold' },
  stepNumGray: { color: '#9CA3AF', fontWeight: 'bold' },
  stepLabelActive: { fontSize: 11, color: '#1A1C1E', marginTop: 4, fontWeight: '700' },
  stepLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  stepLine: { width: 50, height: 2, backgroundColor: '#E5E7EB', marginHorizontal: 10, marginTop: -15 },
  infoBanner: { backgroundColor: '#FFF5F0', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#FFE4D6' },
  orangeIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF8C00', justifyContent: 'center', alignItems: 'center' },
  infoTextContainer: { marginLeft: 12, flex: 1 },
  infoTitle: { fontWeight: '800', fontSize: 16, color: '#1A1C1E' },
  infoSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 12, color: '#1A1C1E', marginTop: 10 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  innerLabel: { fontSize: 15, fontWeight: '700', color: '#1A1C1E', marginBottom: 15 },
  counterMainRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F3F4F6', borderRadius: 16, padding: 8 },
  counterSquareBtn: { width: 48, height: 48, backgroundColor: '#FFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  counterSquareBtnAdd: { width: 48, height: 48, backgroundColor: '#FF5F5F', borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  counterDisplay: { alignItems: 'center' },
  counterBigNum: { fontSize: 24, fontWeight: '800', color: '#1A1C1E' },
  counterSubText: { fontSize: 12, color: '#9CA3AF', marginTop: -4 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 15 },
  gridItem: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', elevation: 2 },
  gridItemActive: { borderColor: '#FF3B2F', backgroundColor: '#FFF9F9' },
  gridLabel: { fontSize: 14, fontWeight: '700', color: '#4B5563' },
  gridLabelActive: { color: '#FF3B2F' },
  gridSub: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  weightGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  weightBtn: { width: '48%', height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: 10, backgroundColor: '#FFF' },
  weightBtnActive: { borderColor: '#FF3B2F', backgroundColor: '#FFF9F9' },
  weightText: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  weightTextActive: { color: '#FF3B2F' },
  uploadBox: { padding: 20, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 16, alignItems: 'center' },
  uploadText: { marginTop: 8, fontSize: 14, fontWeight: '700', color: '#4B5563' },
  uploadSubText: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  gallery: { marginTop: 5 },
  photoContainer: { marginRight: 15, position: 'relative', paddingVertical: 10 },
  previewImg: { width: 120, height: 120, borderRadius: 12 },
  deleteBtn: { position: 'absolute', top: 0, right: -5, backgroundColor: '#FFF', borderRadius: 10 },
  retakeOverlay: { position: 'absolute', bottom: 10, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, paddingVertical: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  retakeText: { color: '#FFF', fontSize: 11, fontWeight: '700', marginLeft: 5 },
  addMoreBtn: { width: 120, height: 120, borderRadius: 12, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  nextBtn: { marginTop: 10 },
  gradient: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});