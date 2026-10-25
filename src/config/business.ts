import { PaymentMethod, PaymentInfo } from '../types';

export const BUSINESS_CONFIG = {
  brandName: 'GROZ',
  taglineEn: 'Form. Precision. Presence.',
  taglineBn: 'আকার। নিখুঁততা। উপস্থিতি।',
  locationEn: 'Maijdee Court, Noakhali, Bangladesh',
  locationBn: 'মাইজদী কোর্ট, নোয়াখালী, বাংলাদেশ',
  phone: '01604985164',
  phoneFormatted: '+880 1604 985164',
  phoneTel: '+8801604985164',
  whatsappNumber: '+8801604985164',
  whatsappBaseUrl: 'https://wa.me/8801604985164',
  facebookUrl: 'https://www.facebook.com/share/1FCKwXKCGo/',
  instagramUrl: 'https://www.instagram.com/grozofficial?stkn=bzB4NHc2YzhkZnEx',
  
  // Delivery Rates
  delivery: {
    insideNoakhaliBDT: 60,
    outsideNoakhaliBDT: 120,
    estimatedDaysInside: '1-2 Days (Maijdee Court Express)',
    estimatedDaysOutside: '2-4 Days (Curated Courier)',
  },

  // Payment Methods
  paymentMethods: [
    {
      id: 'bkash' as PaymentMethod,
      name: 'bKash',
      number: '01604985164',
      accountType: 'Personal',
      brandColor: '#e2136e',
      instructionEn: 'Send Money (Personal) to the number above, then enter the Transaction ID below.',
      instructionBn: 'উপরের নম্বরে সেন্ড মানি করুন (পার্সোনাল), এরপর নিচে ট্রানজ্যাকশন আইডি লিখুন।',
    },
    {
      id: 'nagad' as PaymentMethod,
      name: 'Nagad',
      number: '01814026318',
      accountType: 'Personal',
      brandColor: '#f7941d',
      instructionEn: 'Send Money to this Nagad account, then enter your TrxID below.',
      instructionBn: 'এই নগদ নম্বরে সেন্ড মানি করুন, তারপর নিচে ট্রানজ্যাকশন আইডি প্রদান করুন।',
    },
    {
      id: 'upay' as PaymentMethod,
      name: 'Upay',
      number: '01814026318',
      accountType: 'Personal',
      brandColor: '#008444',
      instructionEn: 'Send Money via Upay app/USSD to this number and input the reference/TrxID.',
      instructionBn: 'উপায় অ্যাপ বা ইউএসএসডি মাধ্যমে সেন্ড মানি করে ট্রানজ্যাকশন আইডি লিখুন।',
    },
    {
      id: 'rocket' as PaymentMethod,
      name: 'Rocket',
      number: '01604985164',
      accountType: 'Personal',
      brandColor: '#8c2d8c',
      instructionEn: 'Send Money via DBBL Rocket to this 11-digit mobile wallet number.',
      instructionBn: 'রকেট পার্সোনাল নম্বরে সেন্ড মানি করে ট্রানজ্যাকশন আইডি লিখুন।',
    },
  ],
};
