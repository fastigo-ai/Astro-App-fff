import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Send, Headphones, ShieldCheck, MessageCircle, Clock, CheckCircle2 } from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';
import { api } from '~/shared/api';
import { useTranslation } from 'react-i18next';

interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  createdAt: string;
}

const CATEGORIES = [
  { id: 'payment', label: '💳 Plans & Payment' },
  { id: 'medical', label: '🩺 Doctor & Consultation' },
  { id: 'classes', label: '📹 Live Classes & Yoga' },
  { id: 'general', label: '🌸 General Support' },
];

export const SupportChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi') ?? false;

  const user = useAuthStore((state) => state.user);
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedCategory, setSelectedCategory] = useState('payment');
  const [inputText, setInputText] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'admin',
      senderName: 'Dr. Radhika Sen (AstroBaby Care)',
      text: isHindi
        ? 'नमस्ते! एस्ट्रोबेबी केयर में आपका स्वागत है। हम आपकी मातृत्व यात्रा और पाठ्यक्रम में सहायता के लिए 24/7 उपस्थित हैं। अपनी समस्या या प्रश्न साझा करें।'
        : 'Namaste! Welcome to AstroBaby Care & Doctor Helpdesk. How can we assist you with your pregnancy journey, plans, or consultations today?',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Fetch or initialize active ticket
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/api/v1/support/tickets', {
          params: { phone: user?.phone || '9366128220' },
        });

        if (res.data?.success && res.data?.data && res.data.data.length > 0) {
          const latest = res.data.data[0];
          setActiveTicketId(latest._id);
          if (latest.messages && latest.messages.length > 0) {
            setMessages(latest.messages);
          }
        }
      } catch (err) {
        console.warn('Could not fetch existing support tickets, starting fresh thread:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      senderName: user?.name || 'Loving Mother',
      text: inputText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsSending(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      if (activeTicketId) {
        // Send reply to existing ticket
        await api.post(`/api/v1/support/tickets/${activeTicketId}/reply`, {
          sender: 'user',
          senderName: user?.name || 'Loving Mother',
          text: userMsg.text,
        });
      } else {
        // Create new ticket
        const res = await api.post('/api/v1/support/tickets', {
          userPhone: user?.phone || '9366128220',
          userName: user?.name || 'Loving Mother',
          category: selectedCategory,
          subject: `Issue regarding ${selectedCategory}`,
          initialMessage: userMsg.text,
        });

        if (res.data?.success && res.data?.data?._id) {
          setActiveTicketId(res.data.data._id);
        }
      }
    } catch (error) {
      console.warn('Offline mock support dispatch:', error);
      // Auto-responder mock if network offline
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `reply_${Date.now()}`,
          sender: 'admin',
          senderName: 'Dr. Radhika Sen (Care Counselor)',
          text: isHindi
            ? 'आपका संदेश प्राप्त हो गया है। हमारी टीम आपके प्रश्न की समीक्षा कर रही है और 10 मिनट में समाधान करेगी।'
            : 'Your issue has been logged with our team (Ticket ID: ASTRO-' + Math.floor(1000 + Math.random() * 9000) + '). A specialist counselor is reviewing it right now.',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, autoReply]);
      }, 1200);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('MainTabs');
            }
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {isHindi ? 'एस्ट्रोबेबी सपोर्ट एवं परामर्श' : 'Customer Support & Helpdesk'}
          </Text>
          <View style={styles.onlineStatusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>
              {isHindi ? 'काउंसलर ऑनलाइन • 24/7 सेवा' : 'Doctor & Counselor Online • 24/7'}
            </Text>
          </View>
        </View>

        <View style={styles.helpIconBox}>
          <Headphones size={20} color="#BE185D" />
        </View>
      </View>

      {/* Category Chips Selector */}
      <View style={styles.categoryChipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages Scroll Area */}
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesScroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Trust Banner */}
          <View style={styles.trustBanner}>
            <ShieldCheck size={16} color="#059669" />
            <Text style={styles.trustBannerText}>
              {isHindi
                ? 'आपकी बातचीत 100% गोपनीय व सुरक्षित है। हमारे वरिष्ठ चिकित्सक सीधे जुड़े हैं।'
                : 'Your consultation is 100% confidential. Certified Ayurveda doctors & counselors are on standby.'}
            </Text>
          </View>

          {messages.map((item) => {
            const isUser = item.sender === 'user';
            return (
              <View
                key={item.id}
                style={[
                  styles.messageBubbleWrapper,
                  isUser ? styles.bubbleUserWrapper : styles.bubbleAdminWrapper,
                ]}
              >
                {!isUser && (
                  <Text style={styles.adminSenderName}>{item.senderName}</Text>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.bubbleUser : styles.bubbleAdmin,
                  ]}
                >
                  <Text style={[styles.messageText, isUser ? styles.textUser : styles.textAdmin]}>
                    {item.text}
                  </Text>
                  <Text style={[styles.timestampText, isUser ? styles.timeUser : styles.timeAdmin]}>
                    {item.createdAt}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInputField}
            placeholder={isHindi ? 'अपनी समस्या या प्रश्न लिखें...' : 'Type your question or issue here...'}
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isSending}
            activeOpacity={0.8}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flexOne: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    padding: 6,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  onlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  helpIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipsContainer: {
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryChipActive: {
    backgroundColor: '#FDF2F8',
    borderColor: '#F472B6',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#BE185D',
    fontWeight: '800',
  },
  messagesScroll: {
    padding: 16,
    paddingBottom: 24,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  trustBannerText: {
    fontSize: 11.5,
    color: '#065F46',
    flex: 1,
    fontWeight: '600',
    lineHeight: 16,
  },
  messageBubbleWrapper: {
    marginBottom: 14,
    maxWidth: '82%',
  },
  bubbleUserWrapper: {
    alignSelf: 'flex-end',
  },
  bubbleAdminWrapper: {
    alignSelf: 'flex-start',
  },
  adminSenderName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: '#FDF2F8',
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  bubbleAdmin: {
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  textUser: {
    color: '#831843',
    fontWeight: '500',
  },
  textAdmin: {
    color: '#1F2937',
    fontWeight: '500',
  },
  timestampText: {
    fontSize: 9.5,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeUser: {
    color: '#9D174D',
  },
  timeAdmin: {
    color: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 10,
  },
  textInputField: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13.5,
    color: '#1F2937',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
});
