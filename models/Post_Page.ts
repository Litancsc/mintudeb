import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPage extends Document {
  title: string;
  slug: string;
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

const PageSchema = new Schema<IPage>(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Page slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
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

// Indexes for better performance (slug index is created automatically by unique: true)
PageSchema.index({ isPublished: 1 });
PageSchema.index({ publishedAt: -1 });

// Auto-set publishedAt when isPublished changes to true
PageSchema.pre<IPage>('save', async function () {
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);

export default Page;