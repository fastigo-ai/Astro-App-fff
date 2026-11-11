import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Video, Calendar, Clock, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const KrishnaLiveMasterclassBanner = () => {
  const navigation = useNavigation<NavigationProp>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const handleOpenLive = () => {
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('LiveSessions');
    } else {
      (navigation as any).navigate('LiveSessions');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9}
        onPress={handleOpenLive}
      >
        {/* Top Live Pulse Bar */}
        <View style={styles.topRow}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              {isHindi ? 'लाइव डॉक्टर क्लास' : 'LIVE DOCTOR MASTERCLASS'}
            </Text>
          </View>
          <View style={styles.timeTag}>
            <Calendar size={13} color="#C2410C" />
            <Text style={styles.timeTagText}>
              {isHindi ? 'शनिवार • प्रातः 11:00' : 'Saturday • 11:00 AM IST'}
            </Text>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.classTitle}>
          {isHindi 
            ? 'गर्भ संवाद एवं शिशु के मस्तिष्क विकास की वैदिक विधियां 🧠'
            : 'Garbh Samvad & Fetal Brain Stimulation with Raagas 🧠'}
        </Text>
        <Text style={styles.doctorName}>
          {isHindi ? '👩‍⚕️ डॉ. अनिता जोशी (आयुर्वेदिक स्त्री रोग विशेषज्ञ)' : '👩‍⚕️ Dr. Anita Joshi, MD (Ayurveda Gynaecologist)'}
        </Text>

        {/* Action Button */}
        <View style={styles.bottomRow}>
          <View style={styles.joinBtn}>
            <Video size={16} color="#FFFFFF" />
            <Text style={styles.joinBtnText}>
              {isHindi ? 'लाइव सत्र में जुड़ें (Zoom) ↗' : 'Join Zoom Masterclass ↗'}
            </Text>
          </View>
          <Text style={styles.attendeesText}>
            {isHindi ? '500+ माताएं पंजीकृत' : '500+ Moms Attending'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#FFFFFF', // Clean light maternal white
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#FCE7F3', // Soft pink border matching dashboard pillars
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED', // Soft warm amber pill
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeTagText: {
    fontSize: 11,
    color: '#C2410C',
    fontWeight: '700',
  },
  classTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#1F2937', // High contrast charcoal text
    lineHeight: 22,
    marginBottom: 5,
  },
  doctorName: {
    fontSize: 12.5,
    color: '#BE185D', // Warm rose doctor title
    fontWeight: '700',
    marginBottom: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF4D6D', // Vibrant signature maternal rose button
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 14,
    shadowColor: '#FF4D6D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  joinBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  attendeesText: {
    fontSize: 11.5,
    color: '#6B7280',
    fontWeight: '600',
  },
});
