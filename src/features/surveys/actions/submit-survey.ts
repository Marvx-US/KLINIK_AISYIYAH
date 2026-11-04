'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { SurveySubmissionSchema } from '../schemas/survey-schema';
import type { ActionResponse } from '@/types';

export async function submitSurvey(rawInput: unknown): Promise<ActionResponse<{ id: number }>> {
  const parsed = SurveySubmissionSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Mohon periksa kembali isian formulir survei Anda.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const survey = await db.surveyResponse.create({
      data: {
        respondentName: data.respondentName,
        contactNumber: data.contactNumber,
        gender: data.gender,
        age: data.age,
        education: data.education,
        occupation: data.occupation,
        occupationOther: data.occupationOther || null,
        serviceReceived: data.serviceReceived,
        q1: data.q1,
        q2: data.q2,
        q3: data.q3,
        q4: data.q4,
        q5: data.q5,
        q6: data.q6,
        q7: data.q7,
        q8: data.q8,
        q9: data.q9,
        feedback: data.feedback || null,
      },
      select: { id: true },
    });

    revalidatePath('/admin/surveys');

    return {
      success: true,
      message: 'Terima kasih atas partisipasi dan penilaian Anda untuk Klinik Pratama Aisyiyah.',
      data: { id: survey.id },
    };
  } catch (error) {
    console.error('[SUBMIT_SURVEY_ERROR]:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan sistem saat menyimpan survei. Silakan coba sesaat lagi.',
    };
  }
}

