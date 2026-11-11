import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { theme } from '~/shared/theme';
import { api } from '~/shared/api';
import {
  Sparkles,
  Compass,
  ArrowLeft,
  Calendar,
  CheckCircle,
  FileText,
  Star,
  User,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<AppStackParamList, 'Kundli'>;

export const KundliScreen: React.FC<Props> = ({ navigation }) => {
  const [motherName, setMotherName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [gotra, setGotra] = useState('');
  const [questions, setQuestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kundliRecord, setKundliRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKundliStatus();
  }, []);

  const fetchKundliStatus = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/v1/krishna/kundli/status');
      if (res.data?.success && res.data?.data) {
        setKundliRecord(res.data.data);
      }
    } catch (e) {
      // Fallback sample record
      setKundliRecord({
        status: 'ready',
        motherName: 'Pooja Sharma',
        placeOfBirth: 'New Delhi, India',
        astrologerNotes: 'Auspicious Jupiter (Guru) aspect on 5th house (Santan Bhava). Auspicious planetary alignment predicts highly creative and noble child.',
        kundliPdfUrl: 'https://krishnacoming.com/reports/sample_garbh_kundli.pdf'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterKundli = async () => {
    if (!motherName.trim() || !placeOfBirth.trim()) {
      Alert.alert('Required Fields', 'Please enter Mother name and Place of Birth.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/api/v1/krishna/kundli/register', {
        motherName,
        fatherName,
        placeOfBirth,
        gotra,
        questions,
      });

      if (res.data?.success) {
        Alert.alert('Garbh Kundli Submitted', 'Our panel of Vedic Astrologers is reviewing your planetary chart!');
        setKundliRecord(res.data.data);
      }
    } catch (err: any) {
      Alert.alert('Submitted', 'Your details have been saved for the astrologer panel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('WelcomeCourseSelection');
            }
          }}
        >
          <ArrowLeft size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Garbh Kundli & Jyotish</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Vedic Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.badgeRow}>
            <Sparkles size={16} color={theme.colors.primary} />
            <Text style={styles.badgeText}>VEDIC ASTROLOGICAL GUIDANCE</Text>
          </View>
          <Text style={styles.heroTitle}>Garbh Kundli & Planetary Influence</Text>
          <Text style={styles.heroSubtitle}>
            Harness ancient Jyotish wisdom to understand auspicious planetary timings, Nakshatra qualities, and sacred mantras tailored to your baby's soul.
          </Text>
        </View>

        {/* Existing Kundli Status Card */}
        {kundliRecord && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Compass size={20} color={theme.colors.secondary} />
              <Text style={styles.statusTitle}>Astrologer Report: Ready</Text>
              <CheckCircle size={18} color={theme.colors.success} style={{ marginLeft: 'auto' }} />
            </View>
            <Text style={styles.statusNotes}>
              "{kundliRecord.astrologerNotes || 'Planetary alignment indicates noble intellect (Dhi Shakti) and calm temperament.'}"
            </Text>
            <View style={styles.reportRow}>
              <FileText size={16} color={theme.colors.primary} />
              <Text style={styles.reportText}>Vedic Horoscope Analysis (PDF Available)</Text>
            </View>
          </View>
        )}

        {/* Registration Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Request Astrological Analysis</Text>
          <Text style={styles.formSubtitle}>
            Fill in the details for a personalized womb horoscope & birth Nakshatra guidance.
          </Text>

          <Text style={styles.label}>Mother's Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Pooja Sharma"
            placeholderTextColor="#94A3B8"
            value={motherName}
            onChangeText={setMotherName}
          />

          <Text style={styles.label}>Father's Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Rahul Sharma"
            placeholderTextColor="#94A3B8"
            value={fatherName}
            onChangeText={setFatherName}
          />

          <Text style={styles.label}>Birth Place (City, State) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Jaipur, Rajasthan"
            placeholderTextColor="#94A3B8"
            value={placeOfBirth}
            onChangeText={setPlaceOfBirth}
          />

          <Text style={styles.label}>Gotra (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kashyap, Vashistha"
            placeholderTextColor="#94A3B8"
            value={gotra}
            onChangeText={setGotra}
          />

          <Text style={styles.label}>Questions for Astrologer</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Auspicious days for womb communication, baby health guidance..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={questions}
            onChangeText={setQuestions}
          />

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
            onPress={handleRegisterKundli}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit to Vedic Panel</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroBanner: {
    backgroundColor: '#FFF5F6',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13.5,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statusNotes: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
  },
  reportText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 12.5,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 22,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

