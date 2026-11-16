import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Request } from 'express';
import multer, { StorageEngine } from 'multer';

// 1. Initialize Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryFileResult {
  url: string;
  publicId: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
}

/**
 * Custom Multer Storage Engine that streams multipart file bytes DIRECTLY
 * to Cloudinary via HTTP socket streaming (file.stream.pipe).
 *
 * This ensures:
 * - NO accumulating in Node.js RAM / process memory (Buffer)
 * - NO saving to temporary server disk
 * - Maximum scalability and zero memory leaks under high upload traffic
 */
export class CloudinaryStreamStorage implements StorageEngine {
  private folder: string;

  constructor(folder = 'astrobaby/avatars') {
    this.folder = folder;
  }

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: Partial<Express.Multer.File> & CloudinaryFileResult) => void
  ): void {
    // If Cloudinary credentials are not configured (e.g. mock test environment), handle safely
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.warn('[CloudinaryStorage] Warning: Cloudinary credentials missing in environment.');
      return cb(new Error('Cloudinary credentials are not configured in .env'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: this.folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'heic'],
        transformation: [
          { width: 600, height: 600, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result?: UploadApiResponse) => {
        if (error) {
          console.error('[CloudinaryStorage] Direct Stream Upload Error:', error);
          return cb(error);
        }

        if (!result) {
          return cb(new Error('Cloudinary direct stream upload returned empty response.'));
        }

        cb(null, {
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );

    // DIRECT STREAM: Piped chunk-by-chunk straight to Cloudinary without buffering into Node.js RAM
    file.stream.pipe(uploadStream);
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File & { publicId?: string },
    cb: (error: Error | null) => void
  ): void {
    if (file.publicId) {
      cloudinary.uploader.destroy(file.publicId, () => {
        cb(null);
      });
    } else {
      cb(null);
    }
  }
}

export const cloudinaryStreamStorage = new CloudinaryStreamStorage();
export { cloudinary };

