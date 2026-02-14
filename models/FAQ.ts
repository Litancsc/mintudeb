// models/FAQ.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema<IFAQ> = new Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Avoid model overwrite in dev/hot reload
const FAQ: Model<IFAQ> = mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);

export default FAQ;
