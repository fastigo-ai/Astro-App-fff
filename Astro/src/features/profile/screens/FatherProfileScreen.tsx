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
  UserCheck,
  Droplet,
  Save,
  Phone,
  Mail,
  Briefcase,
  Sparkles,
  HeartHandshake,
} from 'lucide-react-native';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

type Props = NativeStackScreenProps<AppStackParamList, 'FatherProfile'>;

export const FatherProfileScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const fatherDetails = useAuthStore((state) => state.fatherDetails);
  const updateFatherDetails = useAuthStore((state) => state.updateFatherDetails);
  const fetchFamilyDetails = useAuthStore((state) => state.fetchFamilyDetails);

  const [name, setName] = useState(fatherDetails?.name || user?.partnerName || 'Vipul Sharma');
  const [phone, setPhone] = useState(fatherDetails?.phone || '+91 98765 12345');
  const [email, setEmail] = useState(fatherDetails?.email || 'partner@astrobaby.in');
  const [dob, setDob] = useState(fatherDetails?.dob || '22/11/1993');
  const [bloodGroup, setBloodGroup] = useState(fatherDetails?.bloodGroup || 'O+');
  const [occupation, setOccupation] = useState(fatherDetails?.occupation || 'Engineer / Professional');
  const [notes, setNotes] = useState(fatherDetails?.notes || 'Participates in evening Garbh Samvad and chanting');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFamilyDetails();
  }, []);

  useEffect(() => {
    if (fatherDetails) {
      if (fatherDetails.name) setName(fatherDetails.name);
      if (fatherDetails.phone) setPhone(fatherDetails.phone);
      if (fatherDetails.email) setEmail(fatherDetails.email);
      if (fatherDetails.dob) setDob(fatherDetails.dob);
      if (fatherDetails.bloodGroup) setBloodGroup(fatherDetails.bloodGroup);
      if (fatherDetails.occupation) setOccupation(fatherDetails.occupation);
      if (fatherDetails.notes) setNotes(fatherDetails.notes);
    }
  }, [fatherDetails]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter Husband / Father name.');
      return;
    }
    try {
      setIsSaving(true);
      await updateFatherDetails({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        dob: dob.trim(),
        bloodGroup,
        occupation: occupation.trim(),
        notes: notes.trim(),
      });
      Alert.alert('Saved 💙', 'Husband / Father details have been updated successfully.');
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
        <Text style={styles.headerTitle}>Details of Husband / Father</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.badgeRow}>
            <HeartHandshake size={16} color="#0284C7" />
            <Text style={styles.badgeText}>PATERNAL BONDING & PARTNER PROFILE</Text>
          </View>
          <Text style={styles.bannerTitle}>Father's Personal Records</Text>
          <Text style={styles.bannerText}>
            The father's positive mindset and voice resonance during Garbh Samvad foster emotional security and brain development for your baby.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Husband / Father Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Vipul Sharma"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Mobile Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="e.g. +91 98765 12345"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="e.g. partner@example.com"
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

          <Text style={styles.label}>Occupation / Profession</Text>
          <TextInput
            style={styles.input}
            value={occupation}
            onChangeText={setOccupation}
            placeholder="e.g. Architect, Consultant, Business"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Daily Vedic Habits & Notes for Baby</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
            placeholder="e.g. Reads stories, chants Gayatri mantra, evening meditation..."
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Save size={18} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Husband / Father Details</Text>
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
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E0F2FE',
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
    color: '#0284C7',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 6,
  },
  bannerText: {
    fontSize: 13,
    color: '#0C4A6E',
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
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
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
    backgroundColor: '#0284C7',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 24,
    shadowColor: '#0284C7',
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
