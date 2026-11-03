export const SETTING_KEYS = {
  ABOUT_IMAGE_URL: 'about_image_url',
  ABOUT_DESCRIPTION: 'about_description',
  VISION: 'clinic_vision',
  MISSION: 'clinic_mission',
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];
