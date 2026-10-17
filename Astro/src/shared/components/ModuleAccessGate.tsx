import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';
import { PROGRAMS_DATA } from '~/features/course/data/programsData';

interface ModuleAccessGateProps {
  moduleId: string; // e.g. 'kicks', 'bump', 'samvad', 'mood', 'activities', 'doctor_chat'
  programId?: string; // e.g. 'garbh_sanskar'
  featureName: string;
  description?: string;
  children: React.ReactNode;
}

export const ModuleAccessGate: React.FC<ModuleAccessGateProps> = ({
  moduleId,
  programId = 'garbh_sanskar',
  featureName,
  description,
  children,
}) => {
  const navigation = useNavigation<any>();
  const isModuleUnlocked = useAuthStore((state) => state.isModuleUnlocked);

  const unlocked = isModuleUnlocked(moduleId);

  if (unlocked) {
    return <>{children}</>;
  }

  const program = PROGRAMS_DATA[programId] || PROGRAMS_DATA['garbh_sanskar'];

  return (
    <View style={styles.gateContainer}>
      <View style={styles.card}>
        <View style={styles.lockBadge}>
          <Lock size={28} color="#D97706" />
        </View>

        <Text style={styles.title}>{featureName} is Locked</Text>
        <Text style={styles.subtitle}>
          {description || `This module is an exclusive feature of the ${program.title} package scheme.`}
        </Text>

        <View style={styles.benefitsBox}>
          <View style={styles.benefitRow}>
            <Sparkles size={16} color="#EC4899" />
            <Text style={styles.benefitText}>Included in {program.title} scheme</Text>
          </View>
          <View style={styles.benefitRow}>
            <ShieldCheck size={16} color="#16A34A" />
            <Text style={styles.benefitText}>Unlimited 24/7 doctor verified access</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.unlockButton, { backgroundColor: program.color }]}
          onPress={() => navigation.navigate('Course', { courseId: program.id })}
        >
          <Text style={styles.unlockButtonText}>
            Unlock with {program.title} (From ₹{program.tiers[0]?.calculatedPrice || 1499})
          </Text>
          <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.allProgramsLink}
          onPress={() => navigation.navigate('AllPrograms')}
        >
          <Text style={styles.allProgramsLinkText}>Explore All Subscription Schemes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gateContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    width: '100%',
  },
  lockBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  benefitsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 20,
    gap: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginLeft: 8,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  allProgramsLink: {
    marginTop: 14,
    paddingVertical: 6,
  },
  allProgramsLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EC4899',
  },
});
