import mongoose, { Schema, model, models } from 'mongoose';

const SEOSettingsSchema = new Schema({
  siteName: { type: String, default: '' },
  siteDescription: { type: String, default: '' },
  siteKeywords: { type: String, default: '' },
  googleAnalyticsId: { type: String, default: '' },
  googleSearchConsole: { type: String, default: '' },
  facebookPixel: { type: String, default: '' },
  twitterHandle: { type: String, default: '' },
  defaultOgImage: { type: String, default: '' },
}, { timestamps: true });

export default models.SEOSettings || model('SEOSettings', SEOSettingsSchema);
