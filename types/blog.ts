// types/blog.ts
export interface BlogPost {
  _id?: string;

  title: string;
  slug: string;
  content: string;
  excerpt: string;

  featuredImage: string;

  author: string;
  categories: string[];
  tags: string[];

  published: boolean;
  publishedAt?: string;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  views: number;

  createdAt?: string;
  updatedAt?: string;
}
