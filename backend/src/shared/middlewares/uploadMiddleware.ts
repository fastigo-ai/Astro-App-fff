import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { cloudinaryStreamStorage } from '../services/cloudinary.service';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/heic'];

function imageFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and HEIC images are allowed.'));
  }
}

/**
 * Multer middleware configured with Cloudinary direct streaming storage.
 * - Streams directly to Cloudinary socket
 * - Zero RAM buffering in Node process
 * - 5 MB file size limit
 */
export const uploadAvatarMiddleware = multer({
  storage: cloudinaryStreamStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1,
  },
  fileFilter: imageFilter,
}).single('avatar');
