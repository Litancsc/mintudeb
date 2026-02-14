import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  carId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: Date;
  returnDate: Date;
  pickupLocation: string;
  pickupTime: string;
  returnTime?: string;
  totalDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  message?: string;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    pickupTime: {
      type: String,
      required: [true, 'Pickup time is required'],
    },
    returnTime: {
      type: String,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      select: false,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    message: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes
BookingSchema.index({ customerEmail: 1, createdAt: -1 });
BookingSchema.index({ carId: 1, pickupDate: 1 });
BookingSchema.index({ status: 1 });

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
