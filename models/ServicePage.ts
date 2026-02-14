import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IServicePage extends Document {
  title: string;
  serviceSlug: string;  // e.g., 'car-rental'
  locationSlug: string; // e.g., 'guwahati'
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: Date;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServicePageSchema = new Schema<IServicePage>(
  {
    title: {
      type: String,
      required: [true, 'Service page title is required'],
      trim: true,
    },
    serviceSlug: {
      type: String,
      required: [true, 'Service slug is required'],
      lowercase: true,
      trim: true,
    },
    locationSlug: {
      type: String,
      required: [true, 'Location slug is required'],
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Page content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: String,
      trim: true,
    },
    featuredImage: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    author: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate service-location combinations
ServicePageSchema.index({ serviceSlug: 1, locationSlug: 1 }, { unique: true });
ServicePageSchema.index({ isPublished: 1 });
ServicePageSchema.index({ publishedAt: -1 });

// Virtual field for full URL path
ServicePageSchema.virtual('fullPath').get(function () {
  return `services/${this.serviceSlug}/${this.locationSlug}`;
});

// Auto-set publishedAt when isPublished changes to true
ServicePageSchema.pre('save', function () {
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const ServicePage: Model<IServicePage> =
  mongoose.models.ServicePage || mongoose.model<IServicePage>('ServicePage', ServicePageSchema);

export default ServicePage;