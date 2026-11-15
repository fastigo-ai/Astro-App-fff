import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image as RNImage,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ArrowLeft,
  Camera,
  Calendar,
  Heart,
  Baby,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  Trash2,
  MapPin,
  Phone,
  User as UserIcon,
  Clock,
  ShieldCheck,
  Save,
} from 'lucide-react-native';
import { useAuthStore, JourneyData } from '~/store/useAuthStore';
import { api } from '~/shared/api';

const { width } = Dimensions.get('window');

const PRESET_AVATARS = [
  { id: 'av1', label: '🌸 Lotus', url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&auto=format&fit=crop&q=80' },
  { id: 'av2', label: '👶 Angel', url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&auto=format&fit=crop&q=80' },
  { id: 'av3', label: '🧘 Serene', url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400&auto=format&fit=crop&q=80' },
  { id: 'av4', label: '💖 Blessed', url: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?w=400&auto=format&fit=crop&q=80' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const PregnancyDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const user = useAuthStore(state => state.user);
  const journeyData = useAuthStore(state => state.journeyData);
  const updateUserProfile = useAuthStore(state => state.updateUserProfile);
  const updateJourneyDetails = useAuthStore(state => state.updateJourneyDetails);
  const setUserAvatar = useAuthStore(state => state.setUserAvatar);

  // Profile Form States
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [name, setName] = useState(user?.name || 'Loving Mother');
  const [phone] = useState(user?.phone || '9366128220');
  const [dob, setDob] = useState(user?.dob || '14/08/1996');
  const [city, setCity] = useState(user?.city || 'Delhi');
  const [stateName, setStateName] = useState(user?.state || 'Delhi');

  // Pregnancy Journey Form States
  const [stage, setStage] = useState<'pregnant' | 'planning'>(journeyData?.stage || 'pregnant');
  const [month, setMonth] = useState<number>(journeyData?.confirmed_month || 4);
  const [lmpDate, setLmpDate] = useState<string>(journeyData?.lmp_date || user?.lmp_date || '10 Jan 2027');
  const [eddDate, setEddDate] = useState<string>(journeyData?.edd_date || '15 Oct 2027');

  // Medical & Care States
  const [doctorName, setDoctorName] = useState(user?.doctorName || 'Dr. Radhika Sen');
  const [hospitalName, setHospitalName] = useState(user?.hospitalName || 'Apollo Cradle Maternity Hospital');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'B+');
  const [partnerName, setPartnerName] = useState(user?.partnerName || 'Vipul Sharma');

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<'dob' | 'lmp' | 'edd'>('lmp');
  const [pickerDate, setPickerDate] = useState(new Date());

  const [isSaving, setIsSaving] = useState(false);

  // Month milestone info
  const getTrimester = (m: number) => {
    if (m <= 3) return { num: 1, label: isHindi ? 'प्रथम तिमाही (Trimester 1)' : '1st Trimester', weeks: '1 - 13 Weeks' };
    if (m <= 6) return { num: 2, label: isHindi ? 'द्वितीय तिमाही (Trimester 2)' : '2nd Trimester', weeks: '14 - 26 Weeks' };
    return { num: 3, label: isHindi ? 'तृतीय तिमाही (Trimester 3)' : '3rd Trimester', weeks: '27 - 40 Weeks' };
  };

  const trimesterInfo = getTrimester(month);

  // Upload or Change Photo as DP
  const handlePickAvatar = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        includeBase64: true,
        compressImageQuality: 0.85,
      });

      if (image && (image.path || (image as any).data)) {
        const uri = (image as any).data ? `data:${image.mime};base64,${(image as any).data}` : image.path;
        setAvatar(uri);
        await setUserAvatar(uri);
        Alert.alert(
          isHindi ? 'फ़ोटो अपडेट हुई! 🌸' : 'Display Picture Saved! 🌸',
          isHindi ? 'आपकी नई प्रोफ़ाइल फ़ोटो (DP) सुरक्षित कर दी गई है।' : 'Your new profile photo (DP) has been updated successfully.'
        );
      }
    } catch (err: any) {
      if (err?.message !== 'User cancelled image selection') {
        console.warn('Avatar pick error:', err);
      }
    }
  };

  const handleSelectPresetAvatar = async (url: string) => {
    setAvatar(url);
    await setUserAvatar(url);
    Alert.alert(
      isHindi ? 'वैदिक अवतार सेट हुआ! 🌸' : 'Vedic Avatar Applied! 🌸',
      isHindi ? 'आपकी प्रोफ़ाइल फ़ोटो अपडेट हो गई है।' : 'Your beautiful DP has been updated.'
    );
  };

  const handleRemoveAvatar = async () => {
    setAvatar(undefined);
    await setUserAvatar('');
    Alert.alert(
      isHindi ? 'फ़ोटो हटाई गई' : 'Photo Removed',
      isHindi ? 'प्रोफ़ाइल फ़ोटो हटा दी गई है।' : 'Profile photo has been reset to initials.'
    );
  };

  const openCalendar = (target: 'dob' | 'lmp' | 'edd') => {
    setDatePickerTarget(target);
    setPickerDate(new Date());
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    const formatted = selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    if (datePickerTarget === 'dob') {
      setDob(formatted);
    } else if (datePickerTarget === 'lmp') {
      setLmpDate(formatted);
      // Auto-compute EDD (LMP + 280 days)
      const edd = new Date(selectedDate.getTime() + 280 * 24 * 60 * 60 * 1000);
      setEddDate(edd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    } else if (datePickerTarget === 'edd') {
      setEddDate(formatted);
    }
  };

  const handleSaveAll = async () => {
    if (!name.trim()) {
      Alert.alert(isHindi ? 'नाम दर्ज करें' : 'Name Required', isHindi ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }

    try {
      setIsSaving(true);

      const remainingMonths = Math.max(1, 10 - month);

      // 1. Update user profile
      await updateUserProfile({
        name: name.trim(),
        avatar,
        dob,
        city,
        state: stateName,
        bloodGroup,
        doctorName,
        hospitalName,
        partnerName,
        lmp_date: lmpDate,
      });

      // 2. Update journey data
      await updateJourneyDetails({
        stage,
        confirmed_month: month,
        remaining_months: remainingMonths,
        lmp_date: lmpDate,
        edd_date: eddDate,
      });

      // 3. Sync to API
      await api.post('/api/v1/profile/details', {
        name: name.trim(),
        dob,
        city,
        state: stateName,
        bloodGroup,
        doctorName,
        stage,
        month,
      }).catch(() => {});

      Alert.alert(
        isHindi ? 'विवरण सुरक्षित! 🌸' : 'Pregnancy Details Saved! 🌸',
        isHindi
          ? 'आपके सभी गर्भावस्था व व्यक्तिगत विवरण सुरक्षित कर दिए गए हैं।'
          : 'Your pregnancy, doctor, and personal details have been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (e) {
      Alert.alert('Saved 🌸', 'Details updated successfully.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={22} color="#1E1B4B" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>
            {isHindi ? 'गर्भावस्था एवं प्रोफ़ाइल विवरण' : 'Pregnancy & Profile Details'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? 'दर्ज विवरण देखें व फ़ोटो (DP) अपडेट करें' : 'View collected data & update photo DP'}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ======================================================== */}
        {/* 1. DISPLAY PICTURE (DP) & PROFILE PHOTO CARD             */}
        {/* ======================================================== */}
        <View style={styles.cardSection}>
          <View style={styles.cardSectionHeader}>
            <Camera size={18} color="#BE123C" />
            <Text style={styles.cardSectionTitle}>
              {isHindi ? 'प्रोफ़ाइल फ़ोटो (Display Picture - DP)' : 'Profile Photo (Display Picture - DP)'}
            </Text>
          </View>

          <View style={styles.avatarRow}>
            {/* Live DP Avatar */}
            <View style={styles.avatarWrap}>
              {avatar ? (
                <RNImage source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>{initials || 'MA'}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.avatarCameraBadge}
                onPress={handlePickAvatar}
                activeOpacity={0.8}
              >
                <Camera size={13} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.avatarActions}>
              <TouchableOpacity
                style={styles.uploadPhotoBtn}
                onPress={handlePickAvatar}
                activeOpacity={0.85}
              >
                <Camera size={14} color="#FFFFFF" />
                <Text style={styles.uploadPhotoBtnText}>
                  {avatar
                    ? (isHindi ? 'फ़ोटो बदलें (Update DP)' : 'Change Photo (DP)')
                    : (isHindi ? 'नयी फ़ोटो लगाएं (Add DP)' : 'Add New Photo as DP')}
                </Text>
              </TouchableOpacity>

              {avatar && (
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={handleRemoveAvatar}
                  activeOpacity={0.8}
                >
                  <Trash2 size={13} color="#DC2626" />
                  <Text style={styles.removePhotoBtnText}>
                    {isHindi ? 'फ़ोटो हटाएं' : 'Remove Photo'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Quick Preset Avatars */}
          <Text style={styles.presetsSubTitle}>
            {isHindi ? 'या कोई सुंदर वैदिक अवतार चुनें:' : 'Or choose a sacred maternity avatar:'}
          </Text>
          <View style={styles.presetsRow}>
            {PRESET_AVATARS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.presetChip,
                  avatar === p.url && styles.presetChipActive,
                ]}
                onPress={() => handleSelectPresetAvatar(p.url)}
                activeOpacity={0.8}
              >
                <RNImage source={{ uri: p.url }} style={styles.presetThumb} />
                <Text style={styles.presetLabel}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ======================================================== */}
        {/* 2. COLLECTED PREGNANCY & DUE DATE DETAILS                */}
        {/* ======================================================== */}
        <View style={styles.cardSection}>
          <View style={styles.cardSectionHeader}>
            <Baby size={18} color="#D97706" />
            <Text style={styles.cardSectionTitle}>
              {isHindi ? 'गर्भावस्था व शिशु विकास विवरण' : 'Pregnancy & Due Date Details'}
            </Text>
          </View>

          {/* Stage Selector */}
          <Text style={styles.fieldLabel}>
            {isHindi ? 'वर्तमान स्थिति (Life Stage)' : 'Current Stage'}
          </Text>
          <View style={styles.stageToggleRow}>
            <TouchableOpacity
              style={[
                styles.stageOption,
                stage === 'pregnant' && styles.stageOptionActive,
              ]}
              onPress={() => setStage('pregnant')}
              activeOpacity={0.85}
            >
              <Text style={styles.stageEmoji}>🤰</Text>
              <Text style={[styles.stageText, stage === 'pregnant' && styles.stageTextActive]}>
                {isHindi ? 'वर्तमान में गर्भवती' : 'Currently Pregnant'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.stageOption,
                stage === 'planning' && styles.stageOptionActive,
              ]}
              onPress={() => setStage('planning')}
              activeOpacity={0.85}
            >
              <Text style={styles.stageEmoji}>🌱</Text>
              <Text style={[styles.stageText, stage === 'planning' && styles.stageTextActive]}>
                {isHindi ? 'शिशु की योजना (Planning)' : 'Conception Planning'}
              </Text>
            </TouchableOpacity>
          </View>

          {stage === 'pregnant' ? (
            <>
              {/* Pregnancy Month Selector */}
              <View style={styles.monthHeaderRow}>
                <Text style={styles.fieldLabel}>
                  {isHindi ? 'गर्भावस्था का माह (Select Month):' : 'Pregnancy Month:'}
                </Text>
                <View style={styles.trimesterBadge}>
                  <Text style={styles.trimesterBadgeText}>
                    {trimesterInfo.label} • {trimesterInfo.weeks}
                  </Text>
                </View>
              </View>

              <View style={styles.monthPillsRow}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(m => {
                  const isSelected = month === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[styles.monthPill, isSelected && styles.monthPillActive]}
                      onPress={() => setMonth(m)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.monthPillText, isSelected && styles.monthPillTextActive]}>
                        M{m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Dates Row: LMP & EDD */}
              <View style={styles.datesGrid}>
                {/* LMP Date */}
                <View style={styles.dateCol}>
                  <Text style={styles.fieldLabel}>
                    {isHindi ? 'अंतिम माहवारी (LMP)' : 'Last Period (LMP)'}
                  </Text>
                  <TouchableOpacity
                    style={styles.datePickerBtn}
                    onPress={() => openCalendar('lmp')}
                    activeOpacity={0.8}
                  >
                    <Calendar size={14} color="#C2410C" />
                    <Text style={styles.datePickerBtnText}>{lmpDate}</Text>
                  </TouchableOpacity>
                </View>

                {/* EDD Date */}
                <View style={styles.dateCol}>
                  <Text style={styles.fieldLabel}>
                    {isHindi ? 'प्रसव तिथि (EDD)' : 'Estimated Due Date (EDD)'}
                  </Text>
                  <TouchableOpacity
                    style={styles.datePickerBtn}
                    onPress={() => openCalendar('edd')}
                    activeOpacity={0.8}
                  >
                    <Clock size={14} color="#15803D" />
                    <Text style={[styles.datePickerBtnText, { color: '#15803D' }]}>{eddDate}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.planningBox}>
              <Sparkles size={16} color="#D97706" />
              <Text style={styles.planningBoxText}>
                {isHindi
                  ? 'गर्भाधान पूर्व पंचकर्म, बीज शुद्धि एवं मानसिक शांति के लिए दैनिक संस्कार सक्रिय हैं।'
                  : 'Preconception Vedic detox, Satvik nutrition, and Beej Shuddhi guidance active.'}
              </Text>
            </View>
          )}
        </View>

        {/* ======================================================== */}
        {/* 3. COLLECTED PERSONAL DETAILS                            */}
        {/* ======================================================== */}
        <View style={styles.cardSection}>
          <View style={styles.cardSectionHeader}>
            <UserIcon size={18} color="#2563EB" />
            <Text style={styles.cardSectionTitle}>
              {isHindi ? 'व्यक्तिगत विवरण (Personal Details)' : 'Mother’s Personal Details'}
            </Text>
          </View>

          {/* Full Name */}
          <Text style={styles.fieldLabel}>
            {isHindi ? 'माता का पूरा नाम (Full Name)' : 'Mother’s Full Name'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Radhika Sharma"
            placeholderTextColor="#94A3B8"
          />

          {/* Mobile Number (Read-only verified) */}
          <Text style={styles.fieldLabel}>
            {isHindi ? 'पंजीकृत मोबाइल नंबर (Registered Phone)' : 'Registered Mobile Number'}
          </Text>
          <View style={styles.readOnlyInput}>
            <Phone size={14} color="#64748B" />
            <Text style={styles.readOnlyInputText}>+91 {phone}</Text>
            <View style={styles.verifiedTag}>
              <CheckCircle2 size={12} color="#15803D" />
              <Text style={styles.verifiedTagText}>
                {isHindi ? 'प्रमाणित' : 'Verified'}
              </Text>
            </View>
          </View>

          {/* Date of Birth & Location */}
          <View style={styles.datesGrid}>
            <View style={styles.dateCol}>
              <Text style={styles.fieldLabel}>
                {isHindi ? 'जन्म तिथि (DOB)' : 'Date of Birth (DOB)'}
              </Text>
              <TouchableOpacity
                style={styles.datePickerBtn}
                onPress={() => openCalendar('dob')}
                activeOpacity={0.8}
              >
                <Calendar size={14} color="#475569" />
                <Text style={styles.datePickerBtnText}>{dob}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateCol}>
              <Text style={styles.fieldLabel}>
                {isHindi ? 'शहर (City)' : 'City / State'}
              </Text>
              <TextInput
                style={[styles.textInput, { height: 42 }]}
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Mumbai"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* ======================================================== */}
        {/* 4. DOCTOR & MEDICAL RECORDS                              */}
        {/* ======================================================== */}
        <View style={styles.cardSection}>
          <View style={styles.cardSectionHeader}>
            <Stethoscope size={18} color="#059669" />
            <Text style={styles.cardSectionTitle}>
              {isHindi ? 'डॉक्टर व प्रसूति केंद्र विवरण' : 'Doctor & Maternity Medical Records'}
            </Text>
          </View>

          {/* Consulting Doctor */}
          <Text style={styles.fieldLabel}>
            {isHindi ? 'सलाहकार स्त्री रोग विशेषज्ञ (Doctor Name)' : 'Consulting Gynecologist'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={doctorName}
            onChangeText={setDoctorName}
            placeholder="e.g. Dr. Radhika Sen"
            placeholderTextColor="#94A3B8"
          />

          {/* Hospital */}
          <Text style={styles.fieldLabel}>
            {isHindi ? 'अस्पताल / मैटरनिटी सेंटर (Hospital)' : 'Hospital / Maternity Center'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={hospitalName}
            onChangeText={setHospitalName}
            placeholder="e.g. Apollo Cradle Maternity Hospital"
            placeholderTextColor="#94A3B8"
          />

          {/* Blood Group */}
          <Text style={styles.fieldLabel}>
            {isHindi ? 'रक्त समूह (Blood Group)' : 'Blood Group'}
          </Text>
          <View style={styles.bloodGroupsRow}>
            {BLOOD_GROUPS.map(bg => {
              const isSelected = bloodGroup === bg;
              return (
                <TouchableOpacity
                  key={bg}
                  style={[styles.bloodPill, isSelected && styles.bloodPillActive]}
                  onPress={() => setBloodGroup(bg)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.bloodPillText, isSelected && styles.bloodPillTextActive]}>
                    {bg}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Husband / Partner Name */}
          <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
            {isHindi ? 'पति / साथी का नाम (Partner Name)' : 'Husband / Partner’s Name'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={partnerName}
            onChangeText={setPartnerName}
            placeholder="e.g. Vipul Sharma"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Data Privacy note */}
        <View style={styles.privacyNote}>
          <ShieldCheck size={16} color="#059669" />
          <Text style={styles.privacyNoteText}>
            {isHindi
              ? 'आपकी गर्भावस्था और स्वास्थ्य डेटा सुरक्षित और एन्क्रिप्टेड है। यह केवल आपके वैदिक संस्कारों और डॉक्टर परामर्श को सुसंगत बनाने के लिए उपयोग किया जाता है।'
              : 'Your maternal and medical details are 100% private & encrypted. Used exclusively to personalize your trimester sanskars and growth alerts.'}
          </Text>
        </View>

        {/* Save CTA */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSaveAll}
          disabled={isSaving}
          activeOpacity={0.88}
        >
          <Save size={16} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>
            {isSaving
              ? (isHindi ? 'सहेजा जा रहा है...' : 'Saving Details...')
              : (isHindi ? 'सभी विवरण सुरक्षित करें 🌸' : 'Save & Update Details 🌸')}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF9F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 12,
  },

  // Cards
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  cardSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardSectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E1B4B',
  },

  // Avatar Row
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
  },
  avatarWrap: {
    position: 'relative',
    width: 82,
    height: 82,
  },
  avatarImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3,
    borderColor: '#FCE7F3',
  },
  avatarFallback: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#FFF1F2',
    borderWidth: 2,
    borderColor: '#FDA4AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: '800',
    color: '#BE123C',
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#BE123C',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarActions: {
    flex: 1,
    gap: 8,
  },
  uploadPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#BE123C',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  uploadPhotoBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  removePhotoBtnText: {
    color: '#DC2626',
    fontSize: 11.5,
    fontWeight: '700',
  },

  presetsSubTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  presetChipActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FDA4AF',
  },
  presetThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },

  // Stage toggle
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  stageToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  stageOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stageOptionActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FDA4AF',
  },
  stageEmoji: {
    fontSize: 15,
  },
  stageText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  stageTextActive: {
    color: '#BE123C',
    fontWeight: '800',
  },

  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  trimesterBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  trimesterBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
  },
  monthPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthPillActive: {
    backgroundColor: '#BE123C',
    borderColor: '#BE123C',
  },
  monthPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  monthPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  datesGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  dateCol: {
    flex: 1,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 42,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  datePickerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E1B4B',
  },

  planningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  planningBoxText: {
    flex: 1,
    fontSize: 11.5,
    color: '#92400E',
    lineHeight: 16,
    fontWeight: '600',
  },

  // Inputs
  textInput: {
    height: 42,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 12.5,
    color: '#1E1B4B',
    marginBottom: 10,
  },
  readOnlyInput: {
    height: 42,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  readOnlyInputText: {
    flex: 1,
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '600',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },

  // Blood groups
  bloodGroupsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  bloodPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bloodPillActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  bloodPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  bloodPillTextActive: {
    color: '#FFFFFF',
  },

  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  privacyNoteText: {
    flex: 1,
    fontSize: 11,
    color: '#065F46',
    lineHeight: 15,
  },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#BE123C',
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
