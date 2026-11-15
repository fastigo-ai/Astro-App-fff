import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { create } from 'zustand';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertState {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AlertButton[];
  showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: '',
  message: '',
  buttons: [],
  showAlert: (title, message = '', buttons = [{ text: 'OK' }]) => {
    set({
      visible: true,
      title,
      message,
      buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }],
    });
  },
  hideAlert: () => set({ visible: false }),
}));

// Global hook to replace raw Android/iOS system dialog with our minimal lean UI
export const initCustomAlert = () => {
  Alert.alert = ((title: string, message?: string, buttons?: any[], _options?: any) => {
    const formattedButtons: AlertButton[] =
      buttons && buttons.length > 0
        ? buttons.map((b) => ({
            text: b?.text || 'OK',
            onPress: b?.onPress,
            style: b?.style,
          }))
        : [{ text: 'OK' }];
    useAlertStore.getState().showAlert(title, message, formattedButtons);
  }) as any;
};

export const CustomAlertDialog: React.FC = () => {
  const { visible, title, message, buttons, hideAlert } = useAlertStore();

  if (!visible) return null;

  const isDestructive = buttons.some((b) => b.style === 'destructive');
  const isCelebratory =
    title.includes('🌸') ||
    title.includes('Recorded') ||
    title.includes('Saved') ||
    title.includes('Completed') ||
    title.includes('Beautiful') ||
    title.includes('Thank You') ||
    title.includes('Brilliant');

  const handleButtonPress = (btn: AlertButton) => {
    hideAlert();
    if (btn.onPress) {
      btn.onPress();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={hideAlert}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialogCard}>
          {/* Subtle Decorative Icon Badge */}
          <View
            style={[
              styles.iconCircle,
              isDestructive
                ? styles.iconDestructive
                : isCelebratory
                ? styles.iconCelebratory
                : styles.iconDefault,
            ]}
          >
            {isDestructive ? (
              <AlertCircle size={26} color="#DC2626" />
            ) : isCelebratory ? (
              <CheckCircle2 size={26} color="#059669" />
            ) : (
              <Sparkles size={24} color="#D97706" />
            )}
          </View>

          {/* Dialog Title */}
          <Text style={styles.dialogTitle}>{title}</Text>

          {/* Dialog Message */}
          {Boolean(message) && <Text style={styles.dialogMessage}>{message}</Text>}

          {/* Dialog Actions / Buttons */}
          <View
            style={[
              styles.buttonRow,
              buttons.length > 2 && styles.buttonCol,
            ]}
          >
            {buttons.map((btn, index) => {
              const isCancel = btn.style === 'cancel';
              const isDanger = btn.style === 'destructive';

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dialogBtn,
                    buttons.length === 2 && styles.dialogBtnHalf,
                    isCancel
                      ? styles.cancelBtn
                      : isDanger
                      ? styles.dangerBtn
                      : styles.primaryBtn,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleButtonPress(btn)}
                >
                  <Text
                    style={[
                      styles.btnText,
                      isCancel
                        ? styles.cancelBtnText
                        : isDanger
                        ? styles.dangerBtnText
                        : styles.primaryBtnText,
                    ]}
                  >
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  dialogCard: {
    width: Math.min(340, width - 48),
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconCelebratory: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  iconDestructive: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  iconDefault: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  dialogTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  dialogMessage: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    justifyContent: 'center',
  },
  buttonCol: {
    flexDirection: 'column',
    width: '100%',
  },
  dialogBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBtnHalf: {
    flex: 1,
  },
  btnText: {
    fontSize: 14.5,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: '#1E1B4B', // High-trust Indian royal navy
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 14.5,
    fontWeight: '700',
  },
  dangerBtn: {
    backgroundColor: '#DC2626',
  },
  dangerBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
});
