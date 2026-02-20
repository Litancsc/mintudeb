import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from 'slugify';

export interface ICar extends Document {
  name: string;
  slug: string;
  brand: string;
  carModel: string;
  year: number;
  type: 'Economy' | 'Luxury' | 'SUV' | 'Sports' | 'Van' | 'Electric';
  seats: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  features: string[];
  images: string[];
  mainImage: string;
  description: string;
  available: boolean;
  mileage?: string;
  color?: string;
  licensePlate?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema<ICar>(
  {
    name: { type: String, required: true, trim: true },

    // ✅ FIXED
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    brand: { type: String, required: true, trim: true },
    carModel: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 2000 },
    type: {
      type: String,
      enum: ['Economy', 'Luxury', 'SUV', 'Sports', 'Van', 'Electric'],
      required: true,
    },
    seats: { type: Number, required: true, min: 2, max: 15 },
    transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
      required: true,
    },
    pricePerDay: { type: Number, required: true, min: 0 },
    pricePerWeek: { type: Number, min: 0 },
    pricePerMonth: { type: Number, min: 0 },
    features: [String],
    images: [String],
    mainImage: { type: String, required: true },
    description: { type: String, required: true },
    available: { type: Boolean, default: true },
    mileage: String,
    color: String,
    licensePlate: String,
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
  },
  { timestamps: true }
);

/* ======================
   Middleware
====================== */
CarSchema.pre<ICar>('save', function () {
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (!this.metaTitle) {
    this.metaTitle = `${this.name} - Rent for $${this.pricePerDay}/day | cloudhills.in`;
  }

  if (!this.metaDescription) {
    this.metaDescription = `Book ${this.name} - ${this.year} ${this.brand} ${this.carModel}. ${this.transmission}, ${this.seats} seats. Starting at $${this.pricePerDay} per day.`;
  }
});

CarSchema.index({
  name: 'text',
  brand: 'text',
  carModel: 'text',
  description: 'text',
});

const Car: Model<ICar> =
  mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);

export default Car;
