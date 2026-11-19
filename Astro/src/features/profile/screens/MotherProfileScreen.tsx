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
import { useAuthStore } from '~/store/useAuthStore';
import {
  ArrowLeft,
  Heart,
  Droplet,
  Save,
  Phone,
  Briefcase,
  AlertTriangle,
  Sparkles,
} from 'lucide-react-native';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

type Props = NativeStackScreenProps<AppStackParamList, 'MotherProfile'>;

export const MotherProfileScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const motherDetails = useAuthStore((state) => state.motherDetails);
  const updateMotherDetails = useAuthStore((state) => state.updateMotherDetails);
  const fetchFamilyDetails = useAuthStore((state) => state.fetchFamilyDetails);

  const [name, setName] = useState(motherDetails?.name || user?.name || 'Loving Mother');
  const [dob, setDob] = useState(motherDetails?.dob || user?.dob || '14/08/1996');
  const [bloodGroup, setBloodGroup] = useState(motherDetails?.bloodGroup || user?.bloodGroup || 'B+');
  const [height, setHeight] = useState(motherDetails?.height || '5 ft 4 in');
  const [weight, setWeight] = useState(motherDetails?.weight || '58 kg');
  const [occupation, setOccupation] = useState(motherDetails?.occupation || 'Professional');
  const [emergencyContact, setEmergencyContact] = useState(motherDetails?.emergencyContact || '+91 98765 43210');
  const [medicalHistory, setMedicalHistory] = useState(motherDetails?.medicalHistory || 'None');
  const [allergies, setAllergies] = useState(motherDetails?.allergies || 'None');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFamilyDetails();
  }, []);

  useEffect(() => {
    if (motherDetails) {
      if (motherDetails.name) setName(motherDetails.name);
      if (motherDetails.dob) setDob(motherDetails.dob);
      if (motherDetails.bloodGroup) setBloodGroup(motherDetails.bloodGroup);
      if (motherDetails.height) setHeight(motherDetails.height);
      if (motherDetails.weight) setWeight(motherDetails.weight);
      if (motherDetails.occupation) setOccupation(motherDetails.occupation);
      if (motherDetails.emergencyContact) setEmergencyContact(motherDetails.emergencyContact);
      if (motherDetails.medicalHistory) setMedicalHistory(motherDetails.medicalHistory);
      if (motherDetails.allergies) setAllergies(motherDetails.allergies);
    }
  }, [motherDetails]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter the Mother’s name.');
      return;
    }
    try {
      setIsSaving(true);
      await updateMotherDetails({
        name: name.trim(),
        dob: dob.trim(),
        bloodGroup,
        height: height.trim(),
        weight: weight.trim(),
        occupation: occupation.trim(),
        emergencyContact: emergencyContact.trim(),
        medicalHistory: medicalHistory.trim(),
        allergies: allergies.trim(),
      });
      Alert.alert('Saved 🌸', 'Pregnant Woman details have been updated successfully.');
    } catch (e) {
      Alert.alert('Notice', 'Details saved locally.');
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
        <Text style={styles.headerTitle}>Details of Pregnant Woman</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.badgeRow}>
            <Heart size={16} color="#EC4899" fill="#EC4899" />
            <Text style={styles.badgeText}>MATERNAL HEALTH & VEDIC PROFILE</Text>
          </View>
          <Text style={styles.bannerTitle}>Mother's Personal Records</Text>
          <Text style={styles.bannerText}>
            Personalized health details help harmonize daily Garbh Sanskar kriyas, diet recommendations, and astrological timing.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Aaditi Sharma"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Date of Birth / Age</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Blood Group</Text>
          <View style={styles.chipsRow}>
            {BLOOD_GROUPS.map((bg) => (
              <TouchableOpacity
                key={bg}
                style={[styles.bloodChip, bloodGroup === bg && styles.bloodChipActive]}
                onPress={() => setBloodGroup(bg)}
              >
                <Text style={[styles.bloodChipText, bloodGroup === bg && styles.bloodChipTextActive]}>
                  {bg}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Height</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="e.g. 5 ft 4 in"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Weight (Pre-pregnancy)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="e.g. 58 kg"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <Text style={styles.label}>Occupation / Daily Routine</Text>
          <TextInput
            style={styles.input}
            value={occupation}
            onChangeText={setOccupation}
            placeholder="e.g. Software Engineer / Homemaker"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Emergency Contact Number</Text>
          <TextInput
            style={styles.input}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            keyboardType="phone-pad"
            placeholder="e.g. +91 98765 43210"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Medical History / Known Symptoms</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={medicalHistory}
            onChangeText={setMedicalHistory}
            multiline
            numberOfLines={2}
            placeholder="e.g. Thyroid, Morning Sickness, Normal BP..."
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Allergies</Text>
          <TextInput
            style={styles.input}
            value={allergies}
            onChangeText={setAllergies}
            placeholder="e.g. Peanuts, Penicillin or None"
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Save size={18} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Mother Details</Text>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: '#FDF2F8',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FCE7F3',
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
    color: '#DB2777',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#831843',
    marginBottom: 6,
  },
  bannerText: {
    fontSize: 13,
    color: '#9D174D',
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
  row: {
    flexDirection: 'row',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  bloodChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  bloodChipActive: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  bloodChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  bloodChipTextActive: {
    color: '#FFFFFF',
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
    backgroundColor: '#EC4899',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 24,
    shadowColor: '#EC4899',
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
