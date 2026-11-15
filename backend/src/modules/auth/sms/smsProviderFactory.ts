import { ISmsProvider } from './smsProvider.interface';
import { mockSmsProvider } from './mockSmsProvider';
import { twilioSmsProvider } from './twilioSmsProvider';

export function getSmsProvider(): ISmsProvider {
  const forceMock = process.env.SMS_PROVIDER === 'mock';
  const hasTwilioCreds =
    Boolean(process.env.TWILIO_ACCOUNT_SID) &&
    Boolean(process.env.TWILIO_AUTH_TOKEN) &&
    Boolean(process.env.TWILIO_SERVICE_SID || process.env.TWILIO_PHONE_NUMBER);

  if (!forceMock && hasTwilioCreds) {
    console.log('[SMS Provider Factory] Using Twilio SMS Provider');
    return twilioSmsProvider;
  }

  console.log('[SMS Provider Factory] Using Mock SMS Provider (Development/Bypass mode)');
  return mockSmsProvider;
}

export const smsProvider: ISmsProvider = getSmsProvider();
