'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  HeartHandshake,
  User,
  Star,
  Sparkles,
} from 'lucide-react';
import {
  GENDER_OPTIONS,
  EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS,
  SERVICE_OPTIONS,
  SURVEY_QUESTIONS,
} from '../constants';
import { submitSurvey } from '../actions/submit-survey';
import type { SurveySubmissionInput } from '../schemas/survey-schema';

export default function SurveyFormView() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<SurveySubmissionInput>>({
    gender: 'L',
    education: 'SMA',
    occupation: 'SWASTA',
    serviceReceived: 'Poli Umum',
    q1: 4,
    q2: 4,
    q3: 4,
    q4: 4,
    q5: 4,
    q6: 4,
    q7: 4,
    q8: 4,
    q9: 4,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleTextChange = (field: keyof SurveySubmissionInput, val: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi profil dasar sebelum ke Step 2
    const errors: Record<string, string[]> = {};
    if (!formData.respondentName || formData.respondentName.trim().length < 2) {
      errors.respondentName = ['Nama minimal 2 karakter'];
    }
    if (!formData.contactNumber || formData.contactNumber.trim().length < 8) {
      errors.contactNumber = ['Nomor kontak minimal 8 digit'];
    }
    if (!formData.age || formData.age < 10 || formData.age > 120) {
      errors.age = ['Umur valid antara 10 - 120 tahun'];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await submitSurvey(formData);
    setIsSubmitting(false);

    if (!res.success) {
      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
        // Kembali ke step 1 jika error ada di field profil
        if (res.fieldErrors.respondentName || res.fieldErrors.contactNumber || res.fieldErrors.age) {
          setCurrentStep(1);
        }
      }
      setErrorMessage(res.message);
      return;
    }

    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-border-fine text-center shadow-sm max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-dark mb-3">
          Terima Kasih Banyak!
        </h2>
        <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-8">
          Penilaian dan masukan Anda sangat berharga bagi kami untuk senantiasa meningkatkan standar mutu pelayanan di <span className="font-bold text-text-dark">Klinik Pratama Aisyiyah Pangkajene</span>.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSuccess(false);
            setCurrentStep(1);
            setFormData({
              gender: 'L',
              education: 'SMA',
              occupation: 'SWASTA',
              serviceReceived: 'Poli Umum',
              q1: 4,
              q2: 4,
              q3: 4,
              q4: 4,
              q5: 4,
              q6: 4,
              q7: 4,
              q8: 4,
              q9: 4,
            });
          }}
          className="px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all cursor-pointer"
        >
          Kirim Tanggapan Baru
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar Indicator */}
      <div className="mb-8 bg-white p-4 rounded-2xl border border-border-fine shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              currentStep === 1
                ? 'bg-primary text-white'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {currentStep === 2 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
          </div>
          <div>
            <p className="text-xs font-bold text-text-dark">Bagian I</p>
            <p className="text-[11px] text-text-muted">Profil Responden</p>
          </div>
        </div>

        <div className="h-0.5 w-12 sm:w-24 bg-border-fine mx-2" />

        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              currentStep === 2
                ? 'bg-primary text-white'
                : 'bg-bg-snow text-text-muted border border-border-fine'
            }`}
          >
            2
          </div>
          <div>
            <p className="text-xs font-bold text-text-dark">Bagian II</p>
            <p className="text-[11px] text-text-muted">9 Unsur Mutu Pelayanan</p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmit}>
        <AnimatePresence mode="wait">
          {currentStep === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-border-fine shadow-xs space-y-6"
            >
              <div className="border-b border-border-fine pb-4">
                <h2 className="font-heading font-extrabold text-xl text-text-dark flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Bagian I: Profil Responden
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Identitas Anda akan dirahasiakan dan digunakan semata-mata untuk tindak lanjut peningkatan mutu layanan.
                </p>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.respondentName || ''}
                  onChange={(e) => handleTextChange('respondentName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow/40 text-text-dark text-sm focus:outline-none focus:border-primary transition-all"
                />
                {fieldErrors.respondentName && (
                  <p className="text-red-600 text-xs mt-1.5">{fieldErrors.respondentName[0]}</p>
                )}
              </div>

              {/* No Kontak / WA */}
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={formData.contactNumber || ''}
                  onChange={(e) => handleTextChange('contactNumber', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow/40 text-text-dark text-sm focus:outline-none focus:border-primary transition-all"
                />
                <p className="text-[11px] text-text-muted mt-1">
                  Kontak ini memudahkan kami jika ada keluhan yang perlu segera kami tangani.
                </p>
                {fieldErrors.contactNumber && (
                  <p className="text-red-600 text-xs mt-1.5">{fieldErrors.contactNumber[0]}</p>
                )}
              </div>

              {/* Gender & Usia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {GENDER_OPTIONS.map((g) => (
                      <label
                        key={g.value}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-bold text-sm transition-all ${
                          formData.gender === g.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border-fine bg-white text-text-muted hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g.value}
                          checked={formData.gender === g.value}
                          onChange={() => handleTextChange('gender', g.value)}
                          className="sr-only"
                        />
                        <span>{g.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                    Usia (Tahun) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="120"
                    required
                    placeholder="Contoh: 28"
                    value={formData.age || ''}
                    onChange={(e) => handleTextChange('age', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow/40 text-text-dark text-sm focus:outline-none focus:border-primary transition-all"
                  />
                  {fieldErrors.age && (
                    <p className="text-red-600 text-xs mt-1.5">{fieldErrors.age[0]}</p>
                  )}
                </div>
              </div>

              {/* Pendidikan & Pekerjaan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                    Pendidikan Terakhir <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.education}
                    onChange={(e) => handleTextChange('education', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow/40 text-text-dark text-sm focus:outline-none focus:border-primary transition-all"
                  >
                    {EDUCATION_OPTIONS.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                    Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.occupation}
                    onChange={(e) => handleTextChange('occupation', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow/40 text-text-dark text-sm focus:outline-none focus:border-primary transition-all"
                  >
                    {OCCUPATION_OPTIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.occupation === 'LAINNYA' && (
                <div>
                  <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                    Sebutkan Pekerjaan Anda
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ibu Rumah Tangga / Mahasiswa"
                    value={formData.occupationOther || ''}
                    onChange={(e) => handleTextChange('occupationOther', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow/40 text-text-dark text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              )}

              {/* Layanan yang Diterima */}
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                  Jenis Layanan yang Diterima <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.serviceReceived}
                  onChange={(e) => handleTextChange('serviceReceived', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow/40 text-text-dark text-sm focus:outline-none focus:border-primary transition-all"
                >
                  {SERVICE_OPTIONS.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary-dark transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>Lanjut ke Penilaian (9 Pertanyaan)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-border-fine shadow-xs space-y-8"
            >
              <div className="border-b border-border-fine pb-4">
                <h2 className="font-heading font-extrabold text-xl text-text-dark flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Bagian II: Pendapat Responden Tentang Pelayanan
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Pilihlah salah satu jawaban yang paling mencerminkan pengalaman Anda selama berkunjung.
                </p>
              </div>

              {SURVEY_QUESTIONS.map((q, idx) => {
                const currentVal = formData[q.id] || 4;
                return (
                  <div key={q.id} className="p-5 sm:p-6 rounded-2xl bg-bg-snow/40 border border-border-fine/60 space-y-4">
                    <p className="font-heading font-bold text-sm sm:text-base text-text-dark leading-snug">
                      <span className="text-primary mr-1.5 font-extrabold">{idx + 1}.</span> {q.title}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt) => (
                        <label
                          key={opt.score}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            currentVal === opt.score
                              ? 'border-primary bg-primary text-white font-bold shadow-xs'
                              : 'border-border-fine bg-white text-text-dark hover:border-primary/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.score}
                            checked={currentVal === opt.score}
                            onChange={() => handleTextChange(q.id, opt.score)}
                            className="sr-only"
                          />
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                              currentVal === opt.score
                                ? 'bg-white text-primary'
                                : 'bg-bg-snow text-text-muted border border-border-fine'
                            }`}
                          >
                            {opt.score}
                          </span>
                          <span className="leading-tight">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Feedback Saran / Masukan */}
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Saran / Masukan untuk Peningkatan Layanan (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan kritik atau saran Anda agar kami bisa terus berbenah..."
                  value={formData.feedback || ''}
                  onChange={(e) => handleTextChange('feedback', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border-fine bg-bg-snow/40 text-text-dark text-sm focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-border-fine">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border-fine bg-white text-text-dark text-xs font-bold hover:bg-bg-snow transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Profil</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary-dark disabled:opacity-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-4 h-4" />
                      <span>Kirim Survei Kepuasan</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

