import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { validateBangladeshiPhone } from '../utils/cart';
import { Phone, MessageCircle, ExternalLink, MapPin, Check, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, language } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = t('formErrorRequired');
    }
    if (!formData.phone.trim()) {
      errs.phone = t('formErrorRequired');
    } else if (!validateBangladeshiPhone(formData.phone)) {
      errs.phone = t('formErrorPhone');
    }
    if (!formData.message.trim()) {
      errs.message = t('formErrorRequired');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Local client-side simulation only as mandated by Section 11
      setSubmittedData({ ...formData });
      setErrors({});
    }
  };

  const handleTransferToWhatsApp = () => {
    if (!submittedData) return;
    const text = language === 'bn'
      ? `【 GROZ ইনকোয়ারি বার্তা 】\nনাম: ${submittedData.name}\nফোন: ${submittedData.phone}\nইমেইল: ${submittedData.email || 'দেওয়া হয়নি'}\n\nবার্তা:\n${submittedData.message}`
      : `【 GROZ INQUIRY DISPATCH 】\nName: ${submittedData.name}\nPhone: ${submittedData.phone}\nEmail: ${submittedData.email || 'N/A'}\n\nMessage:\n${submittedData.message}`;
    const url = `https://wa.me/8801604985164?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-groz-main text-groz-main min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors">
      {/* Header */}
      <div className="pb-10 border-b border-groz space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 bg-groz-red" />
          <span>Atelier Inquiries & Channels</span>
        </div>
        <h1 className="font-serif-editorial text-4xl sm:text-6xl font-bold uppercase tracking-tight text-groz-main">
          {t('contactTitle')}
        </h1>
        <p className="font-serif-editorial text-xl text-groz-muted max-w-2xl italic">
          {t('contactSubtitle')}
        </p>
      </div>

      <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b border-groz">
        {/* Left Column: Official Contact Cards & Direct Links */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xs uppercase font-mono-editorial tracking-[0.25em] text-groz-muted border-b border-groz pb-2">
            {t('contactChannelHeading')}
          </h2>

          <div className="space-y-4">
            {/* Atelier Physical Location */}
            <div className="p-5 border border-groz bg-groz-main space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>{t('atelierAddressLabel')}</span>
              </div>
              <div className="text-lg font-serif-editorial font-semibold text-groz-main">
                {t('atelierAddress')}
              </div>
              <div className="text-xs font-mono-editorial text-groz-muted">
                Maijdee Court &bull; Noakhali &bull; Bangladesh
              </div>
            </div>

            {/* Telephone Call Card */}
            <div className="p-5 border border-groz bg-groz-main space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-wider">
                <Phone className="w-4 h-4" />
                <span>{t('atelierPhoneLabel')}</span>
              </div>
              <div className="text-lg font-mono-editorial font-bold text-groz-main">
                01604985164
              </div>
              <a
                href="tel:+8801604985164"
                className="inline-flex items-center gap-2 px-4 py-2 bg-groz-surface hover:bg-groz-red hover:text-white border border-groz text-xs font-mono-editorial uppercase tracking-wider transition-colors"
              >
                <span>{t('openCallAction')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="p-5 border border-groz bg-groz-main space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red uppercase tracking-wider">
                <MessageCircle className="w-4 h-4" />
                <span>{t('atelierWhatsAppLabel')}</span>
              </div>
              <p className="text-xs font-mono-editorial text-groz-muted">
                Direct hotline with GROZ Maijdee Court atelier for specimen inquiries and appointments.
              </p>
              <a
                href="https://wa.me/8801604985164"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-groz-red text-white hover:bg-red-700 text-xs font-mono-editorial uppercase tracking-wider font-semibold transition-colors"
              >
                <span>{t('openWhatsAppAction')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Social Channels */}
            <div className="p-5 border border-groz bg-groz-main space-y-3">
              <div className="text-xs font-mono-editorial text-groz-red uppercase tracking-wider">
                Verified Social Channels
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href="https://www.facebook.com/share/1FCKwXKCGo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-groz hover:border-groz-red text-xs font-mono-editorial flex items-center justify-between group transition-colors"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3.5 h-3.5 text-groz-muted group-hover:text-groz-red" />
                </a>

                <a
                  href="https://www.instagram.com/grozofficial?stkn=bzB4NHc2YzhkZnEx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-groz hover:border-groz-red text-xs font-mono-editorial flex items-center justify-between group transition-colors"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5 text-groz-muted group-hover:text-groz-red" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Translated Contact Form with Real-time Validation */}
        <div className="lg:col-span-7 border border-groz bg-groz-main p-6 sm:p-10 space-y-6">
          <div className="space-y-2 border-b border-groz pb-4">
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold uppercase text-groz-main">
              {t('formHeading')}
            </h2>
            <p className="font-serif-editorial text-sm text-groz-muted">
              {t('formSubheading')}
            </p>
          </div>

          {/* Submission Notice Banner */}
          {submittedData && (
            <div className="p-5 border border-groz-red bg-groz-surface space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-editorial text-groz-red font-semibold uppercase">
                <Check className="w-4 h-4 text-green-500" />
                <span>{t('formSubmittedNotice')}</span>
              </div>
              <div className="p-3 bg-groz-main border border-groz text-xs font-mono-editorial space-y-1 text-groz-main">
                <div><strong>Name:</strong> {submittedData.name}</div>
                <div><strong>Phone:</strong> {submittedData.phone}</div>
                {submittedData.email && <div><strong>Email:</strong> {submittedData.email}</div>}
                <div className="pt-2 border-t border-groz text-groz-muted">
                  <strong>Message:</strong> {submittedData.message}
                </div>
              </div>

              <button
                type="button"
                onClick={handleTransferToWhatsApp}
                className="w-full py-3 px-4 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('formTransferWhatsApp')}</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                {t('formNameLabel')}
              </label>
              <input
                id="contact-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('formNamePlaceholder')}
                className={`w-full p-3 bg-groz-main border text-xs font-mono-editorial text-groz-main focus:outline-none ${
                  errors.name ? 'border-groz-red' : 'border-groz focus:border-groz-red'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] font-mono-editorial text-groz-red">{errors.name}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-1.5">
              <label htmlFor="contact-phone" className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                {t('formPhoneLabel')}
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('formPhonePlaceholder')}
                className={`w-full p-3 bg-groz-main border text-xs font-mono-editorial text-groz-main focus:outline-none ${
                  errors.phone ? 'border-groz-red' : 'border-groz focus:border-groz-red'
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] font-mono-editorial text-groz-red">{errors.phone}</p>
              )}
            </div>

            {/* Email Field (Optional) */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                {t('formEmailLabel')}
              </label>
              <input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('formEmailPlaceholder')}
                className="w-full p-3 bg-groz-main border border-groz text-xs font-mono-editorial text-groz-main focus:outline-none focus:border-groz-red"
              />
            </div>

            {/* Message Field */}
            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="text-xs font-mono-editorial uppercase text-groz-main block font-medium">
                {t('formMessageLabel')}
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('formMessagePlaceholder')}
                className={`w-full p-3 bg-groz-main border text-xs font-mono-editorial text-groz-main focus:outline-none ${
                  errors.message ? 'border-groz-red' : 'border-groz focus:border-groz-red'
                }`}
              />
              {errors.message && (
                <p className="text-[11px] font-mono-editorial text-groz-red">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-groz-red hover:bg-red-700 text-white font-mono-editorial text-xs uppercase tracking-[0.2em] font-semibold transition-colors focus:outline-none"
            >
              {t('formSubmit')}
            </button>

            {/* Notice regarding local handling */}
            <div className="p-3 bg-groz-surface border border-groz text-[11px] font-mono-editorial text-groz-muted flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-groz-red shrink-0 mt-0.5" />
              <span>{t('formNoticeLocal')}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
