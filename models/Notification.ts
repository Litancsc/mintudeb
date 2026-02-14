import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'offer' | 'promotion' | 'announcement' | 'alert';
  displayLocation: ('homepage' | 'banner' | 'popup')[];
  active: boolean;
  startDate: Date;
  endDate?: Date;
  link?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    type: {
      type: String,
      enum: ['offer', 'promotion', 'announcement', 'alert'],
      default: 'announcement',
    },
    displayLocation: [{
      type: String,
      enum: ['homepage', 'banner', 'popup'],
    }],
    active: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    link: {
      type: String,
    },
    buttonText: {
      type: String,
    },
    backgroundColor: {
      type: String,
      default: '#D4AF37',
    },
    textColor: {
      type: String,
      default: '#FFFFFF',
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes
NotificationSchema.index({ active: 1, startDate: -1 });

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
