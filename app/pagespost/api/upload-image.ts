// pages/api/upload-image.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // ❌ Let multer handle file parsing
  },
};

// Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Set up multer
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  },
});

const upload = multer({ storage });
const uploadMiddleware = upload.single('image');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method not allowed' });

  uploadMiddleware(req as any, res as any, (err: any) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }

    const file = (req as any).file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const fileUrl = `/uploads/${file.filename}`;
    console.log('✅ Uploaded file:', fileUrl);

    return res.status(200).json({ url: fileUrl });
  });
}
