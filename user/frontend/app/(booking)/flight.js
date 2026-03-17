import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, SafeAreaView, Platform, StatusBar, Modal, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';

const INDIAN_CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Goa"];

export default function FlightDetails() {
  const router = useRouter();
  
  // Form States
  const [selectedAirline, setSelectedAirline] = useState('Indigo');
  const [flightNumber, setFlightNumber] = useState('');
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  
  // Date/Time States
  const [depDate, setDepDate] = useState(new Date());
  const [arrDate, setArrDate] = useState(new Date());
  const [showDepPicker, setShowDepPicker] = useState(false);
  const [showArrPicker, setShowArrPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date'); 

  // Search Modal States
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState(''); 

  const filteredCities = INDIAN_CITIES.filter(city => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCityPicker = (field) => {
    setActiveField(field);
    setSearchQuery('');
    setModalVisible(true);
  };

  const selectDateOrTime = (field, mode) => {
    setPickerMode(mode);
    field === 'dep' ? setShowDepPicker(true) : setShowArrPicker(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1A1C1E" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Flight Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Unified Stepper Progress */}
        <View style={styles.stepperRow}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCurrent]}><Text style={styles.stepNum}>1</Text></View>
            <Text style={styles.stepLabelActive}>Flight Info</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle}><Text style={styles.stepNumInactive}>2</Text></View>
            <Text style={styles.stepLabel}>Luggage</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle}><Text style={styles.stepNumInactive}>3</Text></View>
            <Text style={styles.stepLabel}>Pickup</Text>
          </View>
        </View>

        <View style={styles.infoBanner}>
          <View style={styles.blueIconCircle}><Ionicons name="airplane" size={20} color="#FFF" /></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Flight Information</Text>
            <Text style={styles.infoSub}>Help us serve you better by sharing your flight details</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Select Airline</Text>
        <View style={styles.airlineGrid}>
          {['Indigo', 'Air India', 'SpiceJet', 'Akasa', 'Vistara', 'Other'].map((item) => (
            <TouchableOpacity key={item} onPress={() => setSelectedAirline(item)}
              style={[styles.airlineCard, selectedAirline === item && styles.airlineCardSelected]}>
              <Text style={[styles.airlineText, selectedAirline === item && styles.airlineTextSelected]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Flight Number</Text>
          <TextInput 
            style={styles.textInput} 
            placeholder="E.G., AI 101" 
            value={flightNumber}
            onChangeText={setFlightNumber}
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Route Details</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openCityPicker('dep')}>
            <Ionicons name="location-outline" size={20} color="#FF3B2F" />
            <Text style={[styles.inputText, !departureCity && {color: '#9CA3AF'}]}>
              {departureCity || "Departure City"}
            </Text>
          </TouchableOpacity>

          <View style={styles.swapContainer}>
             <View style={styles.swapCircle}><Ionicons name="swap-vertical" size={18} color="#FF3B2F" /></View>
          </View>

          <TouchableOpacity style={styles.dropdownInput} onPress={() => openCityPicker('arr')}>
            <Ionicons name="airplane-outline" size={20} color="#FF3B2F" />
            <Text style={[styles.inputText, !arrivalCity && {color: '#9CA3AF'}]}>
              {arrivalCity || "Arrival City"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Departure Date & Time</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.dropdownInput, {flex: 1, marginRight: 8}]} onPress={() => selectDateOrTime('dep', 'date')}>
              <Ionicons name="calendar-outline" size={18} color="#FF3B2F" />
              <Text style={styles.dateTimeText}>{depDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dropdownInput, {flex: 0.8}]} onPress={() => selectDateOrTime('dep', 'time')}>
              <Ionicons name="time-outline" size={18} color="#FF3B2F" />
              <Text style={styles.dateTimeText}>{depDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Arrival Date & Time</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.dropdownInput, {flex: 1, marginRight: 8}]} onPress={() => selectDateOrTime('arr', 'date')}>
              <Ionicons name="calendar-outline" size={18} color="#FF3B2F" />
              <Text style={styles.dateTimeText}>{arrDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dropdownInput, {flex: 0.8}]} onPress={() => selectDateOrTime('arr', 'time')}>
              <Ionicons name="time-outline" size={18} color="#FF3B2F" />
              <Text style={styles.dateTimeText}>{arrDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* UPDATED ACTION: Passing data to Luggage */}
        <TouchableOpacity 
  style={styles.nextBtn} 
  onPress={() => router.push({
    // Added the parentheses here to match your folder structure
    pathname: '/(booking)/luggage', 
    params: {
      airline: selectedAirline,
      flightNum: flightNumber,
      depCity: departureCity,
      arrCity: arrivalCity,
      depTime: depDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  })}
>
  <LinearGradient 
    colors={['#FF5F5F', '#FF8C00']} 
    start={{x:0, y:0}} 
    end={{x:1, y:0}} 
    style={styles.gradient}
  >
    <Text style={styles.nextBtnText}>Continue to Luggage Details</Text>
  </LinearGradient>
</TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>

      {showDepPicker && <DateTimePicker value={depDate} mode={pickerMode} onChange={(e, d) => {setShowDepPicker(false); if(d) setDepDate(d);}} />}
      {showArrPicker && <DateTimePicker value={arrDate} mode={pickerMode} onChange={(e, d) => {setShowArrPicker(false); if(d) setArrDate(d);}} />}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput style={styles.searchInput} placeholder="Search City..." value={searchQuery} onChangeText={setSearchQuery} autoFocus />
            <FlatList data={filteredCities} renderItem={({item}) => (
              <TouchableOpacity style={styles.cityItem} onPress={() => { activeField === 'dep' ? setDepartureCity(item) : setArrivalCity(item); setModalVisible(false); }}>
                <Text style={styles.cityText}>{item}</Text>
              </TouchableOpacity>
            )} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, paddingBottom: 10, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  stepCurrent: { backgroundColor: '#FF3B2F' },
  stepNum: { color: '#FFF', fontWeight: 'bold' },
  stepNumInactive: { color: '#9CA3AF', fontWeight: 'bold' },
  stepLabelActive: { fontSize: 11, color: '#1A1C1E', marginTop: 4, fontWeight: '700' },
  stepLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  stepLine: { width: 50, height: 2, backgroundColor: '#E5E7EB', marginHorizontal: 10, marginTop: -15 },
  infoBanner: { backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#D0DBFF' },
  blueIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  infoTextContainer: { marginLeft: 12, flex: 1 },
  infoTitle: { fontWeight: '800', fontSize: 16, color: '#1E3A8A' },
  infoSub: { fontSize: 12, color: '#3B82F6', marginTop: 2 },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 12, color: '#4B5563' },
  airlineGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  airlineCard: { width: '31%', paddingVertical: 12, backgroundColor: '#FFF', borderRadius: 12, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  airlineCardSelected: { borderColor: '#FF3B2F', backgroundColor: '#FFF9F9' },
  airlineText: { fontSize: 12, fontWeight: '600' },
  airlineTextSelected: { color: '#FF3B2F' },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 15 },
  textInput: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12, fontSize: 15, fontWeight: '600' },
  dropdownInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 12 },
  inputText: { marginLeft: 10, fontSize: 14, fontWeight: '600' },
  dateTimeText: { marginLeft: 8, fontSize: 13, fontWeight: '600', color: '#1A1C1E' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  swapContainer: { alignItems: 'center', marginVertical: -8, zIndex: 1 },
  swapCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  nextBtn: { marginTop: 10 },
  gradient: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', height: '70%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  searchInput: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12, marginBottom: 15 },
  cityItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  cityText: { fontSize: 16, fontWeight: '600' }
});