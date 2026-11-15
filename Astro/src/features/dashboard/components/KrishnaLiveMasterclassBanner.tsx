import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Video, Calendar } from 'lucide-react-native';
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
        {/* Top Badges Row: Live Status & Schedule */}
        <View style={styles.topRow}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              {isHindi ? 'लाइव क्लास' : 'LIVE MASTERCLASS'}
            </Text>
          </View>

          <View style={styles.timeTag}>
            <Calendar size={13} color="#92400E" />
            <Text style={styles.timeTagText}>
              {isHindi ? 'शनिवार • प्रातः 11:00' : 'Saturday • 11:00 AM IST'}
            </Text>
          </View>
        </View>

        {/* Masterclass Title */}
        <Text style={styles.classTitle}>
          {isHindi
            ? 'गर्भ संवाद एवं शिशु के मस्तिष्क विकास की वैदिक विधियां 🧠'
            : 'Garbh Samvad & Fetal Brain Stimulation with Raagas 🧠'}
        </Text>

        {/* Doctor Credential Line */}
        <Text style={styles.doctorName}>
          {isHindi
            ? '👩‍⚕️ डॉ. अनिता जोशी • आयुर्वेदिक स्त्री रोग विशेषज्ञ'
            : '👩‍⚕️ Dr. Anita Joshi • MD (Ayurveda Gynaecologist)'}
        </Text>

        {/* Bottom CTA Row */}
        <View style={styles.bottomRow}>
          <View style={styles.joinBtn}>
            <Video size={15} color="#FFFFFF" />
            <Text style={styles.joinBtnText}>
              {isHindi ? 'सत्र में जुड़ें (Zoom) ↗' : 'Join Zoom Masterclass ↗'}
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
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
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
    backgroundColor: '#DC2626',
  },
  liveText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B91C1C',
    letterSpacing: 0.5,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeTagText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '700',
  },
  classTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 6,
  },
  doctorName: {
    fontSize: 12.5,
    color: '#047857',
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
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  joinBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  attendeesText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
});
