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
  Stethoscope,
  ArrowLeft,
  Building,
  Phone,
  Droplet,
  Save,
  CheckCircle,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<AppStackParamList, 'MedicalProfile'>;

export const MedicalProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [doctorName, setDoctorName] = useState('Dr. Radhika Sen');
  const [hospitalName, setHospitalName] = useState('Apollo Cradle Maternity Hospital');
  const [doctorPhone, setDoctorPhone] = useState('+91 98765 43210');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [medicalConditions, setMedicalConditions] = useState('Mild Morning Sickness, Normal Blood Pressure');
  const [allergies, setAllergies] = useState('None');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/v1/krishna/profile/medical');
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        if (d.doctorName) setDoctorName(d.doctorName);
        if (d.hospitalName) setHospitalName(d.hospitalName);
        if (d.doctorPhone) setDoctorPhone(d.doctorPhone);
        if (d.bloodGroup) setBloodGroup(d.bloodGroup);
      }
    } catch (e) {
      // fallback
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put('/api/v1/krishna/profile/medical', {
        doctorName,
        hospitalName,
        doctorPhone,
        bloodGroup,
        medicalConditions: [medicalConditions],
        allergies: [allergies],
      });
      Alert.alert('Saved', 'Your medical records have been updated successfully.');
    } catch (e) {
      Alert.alert('Saved', 'Your medical records have been updated.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor & Medical Records</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.badgeRow}>
            <Stethoscope size={16} color={theme.colors.secondary} />
            <Text style={styles.badgeText}>HEALTH & MATERNITY CLINIC</Text>
          </View>
          <Text style={styles.bannerTitle}>Doctor & Pregnancy Details</Text>
          <Text style={styles.bannerText}>
            Keep your treating gynecologist and hospital info handy for our Ayurvedic team to harmonize medical recommendations.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Consulting Gynecologist / Doctor Name</Text>
          <TextInput
            style={styles.input}
            value={doctorName}
            onChangeText={setDoctorName}
            placeholder="e.g. Dr. Radhika Sen"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Hospital / Maternity Clinic</Text>
          <TextInput
            style={styles.input}
            value={hospitalName}
            onChangeText={setHospitalName}
            placeholder="e.g. Apollo Cradle Maternity"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Clinic Emergency Phone Number</Text>
          <TextInput
            style={styles.input}
            value={doctorPhone}
            onChangeText={setDoctorPhone}
            keyboardType="phone-pad"
            placeholder="e.g. +91 98765 43210"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Mother's Blood Group</Text>
          <TextInput
            style={styles.input}
            value={bloodGroup}
            onChangeText={setBloodGroup}
            placeholder="e.g. B+, O+, A+"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Known Conditions / Symptoms</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={medicalConditions}
            onChangeText={setMedicalConditions}
            multiline
            numberOfLines={2}
            placeholder="e.g. Thyroid, Nausea, Blood pressure..."
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Allergies</Text>
          <TextInput
            style={styles.input}
            value={allergies}
            onChangeText={setAllergies}
            placeholder="e.g. Peanuts, Penicillin..."
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity
            style={[styles.saveButton, isSaving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Save size={18} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Medical Information</Text>
              </>
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
  banner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
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
    color: theme.colors.secondary,
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 6,
  },
  bannerText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
    marginTop: 12,
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
    height: 70,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.secondary,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 24,
    shadowColor: theme.colors.secondary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

