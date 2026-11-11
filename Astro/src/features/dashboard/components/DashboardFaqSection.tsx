import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  Plus,
  Minus,
  MessageCircle,
  Headphones,
  Sparkles,
} from 'lucide-react-native';

interface FaqItem {
  q: string;
  a: string;
}

export const DashboardFaqSection: React.FC = () => {
  const navigation = useNavigation<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First one open by default

  const faqs: FaqItem[] = [
    {
      q: isHindi
        ? 'गर्भ संस्कार क्या है और इसे कब शुरू करना चाहिए?'
        : 'What is Garbh Sanskar and when should I start?',
      a: isHindi
        ? 'गर्भ संस्कार गर्भ में पल रहे शिशु को सकारात्मक संस्कार, ज्ञान और स्वास्थ्य देने का प्राचीन वैदिक विज्ञान है। इसे गर्भाधान (प्लानिंग) से या गर्भावस्था के किसी भी माह से शुरू किया जा सकता है। शिशु के कान 16वें सप्ताह से सुनने लगते हैं और 20वें सप्ताह से मस्तिष्क में यादें दर्ज होना शुरू हो जाती हैं।'
        : 'Garbh Sanskar is the ancient Vedic science of educating and nurturing your baby inside the womb. You can start from planning or any gestational month. Fetal hearing develops by week 16 and neural memory actively records from week 20 onward.',
    },
    {
      q: isHindi
        ? 'दैनिक क्रियाओं से शिशु के मस्तिष्क विकास (IQ/EQ) में क्या लाभ होता है?'
        : 'How do daily Vedic activities boost baby’s IQ and EQ?',
      a: isHindi
        ? 'वैज्ञानिक अध्ययनों से सिद्ध है कि 432Hz शास्त्रीय राग, सकारात्मक श्लोक और मां की शांत आवाज शिशु के न्यूरोन्स के बीच सम्बंधों को मजबूत करती है। इससे कॉर्टिसोल (तनाव हार्मोन) घटता है, जिससे शिशु शांत, बुद्धिमान और भावनात्मक रूप से परिपक्व जन्म लेता है।'
        : 'Scientific neuro-fetal studies prove that prenatal sound therapy (432Hz Raagas), shloka vibrations, and positive maternal thoughts stimulate dendritic connections in baby’s cortex, nurturing an emotionally balanced and intellectually sharp child.',
    },
    {
      q: isHindi
        ? 'यदि मैंने पहली तिमाही में कोर्स शुरू नहीं किया, तो क्या अब देर हो गई है?'
        : 'What if I missed starting in the first trimester?',
      a: isHindi
        ? 'बिल्कुल नहीं! शिशु का मस्तिष्क विकास दूसरी और तीसरी तिमाही (4 से 9वें माह) में सर्वाधिक तीव्र होता है। हमारा ऐप आपके वर्तमान माह के अनुसार दैनिक दिनचर्या और लाइव सत्रों को स्वतः अनुकूलित कर देता है।'
        : 'Not at all! Fetal sensory and emotional receptivity peaks during the 2nd and 3rd trimesters (months 4 to 9). Our system dynamically tailors your daily Vedic schedule, diet charts, and doctor calls to your exact remaining weeks.',
    },
    {
      q: isHindi
        ? 'लाइव डॉक्टर मास्टरक्लासेज कैसे आयोजित की जाती हैं?'
        : 'How are live doctor masterclasses conducted?',
      a: isHindi
        ? 'हर सप्ताह वरिष्ठ स्त्री रोग विशेषज्ञों, आयुर्वेदिक वैद्यों और योग आचार्यों द्वारा लाइव इंटरेक्टिव सत्र आयोजित होते हैं। आप लाइव प्रश्न पूछ सकती हैं और सभी सत्रों की रिकॉर्डिंग कभी भी देख सकती हैं।'
        : 'Classes are held live every weekend via interactive Zoom sessions led by MD Ayurvedic Gynaecologists, Prenatal Yoga Masters, and Garbh Sanskar Gurus. You can ask questions directly and watch HD recordings anytime.',
    },
    {
      q: isHindi
        ? 'क्या पति (पिता) भी गर्भ संस्कार में भाग ले सकते हैं?'
        : 'Can the father/husband participate in daily sessions?',
      a: isHindi
        ? 'हाँ, अवश्य! पिता की गहरी आवाज गर्भाशय के जल में बहुत स्पष्ट सुनाई देती है। गर्भ संवाद में पिता के लिए विशेष वार्ता सत्र दिए गए हैं ताकि दोनों माता-पिता जन्म से पहले ही शिशु से गहरा आत्मिक संबंध बना सकें।'
        : 'Yes, absolutely! The father’s low-frequency voice resonates deeply inside the amniotic fluid. Our Garbh Samvad scripts feature dedicated father-baby bonding prompts so both parents nurture the child together.',
    },
    {
      q: isHindi
        ? 'क्या भुगतान सुरक्षित है और क्या आसान किस्तें उपलब्ध हैं?'
        : 'Is payment safe and are easy installment options available?',
      a: isHindi
        ? 'हाँ, सभी भुगतान Razorpay के 256-बिट बैंक एन्क्रिप्शन द्वारा 100% सुरक्षित हैं। आप UPI, कार्ड्स या नेटबैंकिंग द्वारा भुगतान कर सकती हैं तथा 3 किस्तों में आसान डाउनपेमेंट सुविधा भी उपलब्ध है।'
        : 'Yes, 100% PCI-DSS compliant via Razorpay with 256-bit SSL encryption. We accept UPI, GPay, PhonePe, Cards, and offer easy 3-part monthly installment downpayment plans.',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <HelpCircle size={20} color="#BE123C" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>
            {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
          </Text>
          <Text style={styles.sectionSub}>
            {isHindi
              ? 'गर्भ संस्कार व मातृत्व यात्रा से जुड़े सामान्य प्रश्न'
              : 'Everything you need to know about Garbh Sanskar & AstroBaby'}
          </Text>
        </View>
      </View>

      {/* Accordion FAQ List */}
      <View style={styles.accordionContainer}>
        {faqs.map((faq, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <View key={index} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.questionRow}
                onPress={() => setExpandedIndex(isExpanded ? null : index)}
                activeOpacity={0.8}
              >
                <Text style={styles.questionText}>{faq.q}</Text>
                <View style={styles.plusBox}>
                  {isExpanded ? (
                    <Minus size={16} color="#0F172A" strokeWidth={2.4} />
                  ) : (
                    <Plus size={16} color="#0F172A" strokeWidth={2.4} />
                  )}
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.answerBox}>
                  <Text style={styles.answerText}>{faq.a}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Need Help Counselor Contact Banner */}
      <View style={styles.counselorCard}>
        <View style={styles.counselorLeft}>
          <View style={styles.counselorAvatarRing}>
            <Headphones size={20} color="#BE123C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.counselorTitle}>
              {isHindi ? 'कोई और प्रश्न है?' : 'Still have questions?'}
            </Text>
            <Text style={styles.counselorSub}>
              {isHindi
                ? 'हमारी वरिष्ठ मातृत्व काउंसलर से निःशुल्क बात करें'
                : 'Chat with our senior maternal counselor for free guidance'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.chatCounselorBtn}
          onPress={() => navigation.navigate('SupportChat')}
          activeOpacity={0.85}
        >
          <MessageCircle size={15} color="#FFFFFF" />
          <Text style={styles.chatCounselorBtnText}>
            {isHindi ? 'काउंसलर से चैट करें' : 'Chat with Counselor'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  accordionContainer: {
    gap: 10,
    marginBottom: 16,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    paddingRight: 12,
    lineHeight: 20,
  },
  plusBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerBox: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  answerText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  counselorCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 14,
  },
  counselorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counselorAvatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FDA4AF',
  },
  counselorTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#881337',
  },
  counselorSub: {
    fontSize: 12,
    color: '#9F1239',
    marginTop: 1,
    lineHeight: 16,
  },
  chatCounselorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#BE123C',
    borderRadius: 14,
    paddingVertical: 12,
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  chatCounselorBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
