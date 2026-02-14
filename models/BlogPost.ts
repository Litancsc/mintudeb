import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

/* ============================
   Interface
============================ */
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  categories: string[];
  tags: string[];
  published: boolean;
  publishedAt?: Date;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  views: number;
  createdAt: Date;
  updatedAt: Date;
}

/* ============================
   Schema
============================ */
const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },

    content: { type: String, required: true },

    excerpt: { type: String, required: true, maxlength: 300 },

    featuredImage: { type: String, required: true },

    author: { type: String, default: "DriveNow Team" },

    categories: { type: [String], default: [] },

    tags: { type: [String], default: [] },

    published: { type: Boolean, default: false },

    publishedAt: Date,

    metaTitle: String,
    metaDescription: String,
    metaKeywords: { type: [String], default: [] },

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ============================
   Middleware (PRODUCTION SAFE)
============================ */
BlogPostSchema.pre<IBlogPost>("save", async function () {
  const siteName = process.env.SITE_NAME || "DriveNow Rentals";

  // ---------- Slug ----------
  if (!this.slug || this.isModified("title")) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;
    let count = 1;

    const BlogPostModel = this.constructor as Model<IBlogPost>;

    while (await BlogPostModel.exists({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }

  // ---------- Publish date ----------
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // ---------- SEO ----------
  if (!this.metaTitle) {
    this.metaTitle = `${this.title} | ${siteName} Blog`;
  }

  if (!this.metaDescription) {
    this.metaDescription = this.excerpt;
  }

  if (!this.metaKeywords || this.metaKeywords.length === 0) {
    this.metaKeywords =
      this.tags.length > 0
        ? this.tags
        : [this.title, "car rental", "blog"];
  }
});

/* ============================
   Indexes
============================ */
BlogPostSchema.index(
  {
    title: "text",
    metaTitle: "text",
    metaDescription: "text",
    tags: "text",
    content: "text",
  },
  {
    weights: {
      title: 5,
      metaTitle: 4,
      tags: 3,
      content: 1,
    },
  }
);

/* ============================
   Export
============================ */
const BlogPost =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
