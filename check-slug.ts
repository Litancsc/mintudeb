import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, id } = req.query;
  if (!slug) return res.status(400).json({ error: 'Slug required' });

  await dbConnect();
  const exists = await BlogPost.findOne({ slug, _id: { $ne: id } });
  res.status(200).json({ exists: !!exists });
}

module.exports = {
  // ...existing config...
  productionBrowserSourceMaps: true,
};
