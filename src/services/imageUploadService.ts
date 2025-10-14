import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase-config";

export class ImageUploadService {
  /**
   * Upload image to Firebase Storage
   * @param file - Image file to upload
   * @param lecturerId - Lecturer ID for file naming
   * @returns Promise<string> - Download URL of uploaded image
   */
  static async uploadLecturerImage(
    file: File,
    lecturerId: string
  ): Promise<string> {
    try {
      console.log("Starting image upload for lecturer:", lecturerId);
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      console.log("Storage object:", storage);

      // Create a reference to the file location
      const fileExtension = file.name.split(".").pop() || "jpg";
      const fileName = `lecturers/${lecturerId}/profile.${fileExtension}`;
      console.log("Upload path:", fileName);

      const storageRef = ref(storage, fileName);
      console.log("Storage ref created:", storageRef);

      // Upload the file với resumable upload
      console.log("Uploading file...");
      const uploadTask = uploadBytesResumable(storageRef, file);

      const snapshot = await new Promise<any>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          () => {
            resolve(uploadTask.snapshot);
          }
        );
      });
      console.log("Upload successful, snapshot:", snapshot);

      // Get the download URL
      console.log("Getting download URL...");
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Download URL obtained:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      console.error("Error details:", {
        message: (error as Error).message,
        code: (error as any).code,
        stack: (error as Error).stack,
      });
      throw new Error(
        `Không thể tải lên hình ảnh: ${(error as Error).message}`
      );
    }
  }

  /**
   * Delete image from Firebase Storage
   * @param imageUrl - URL of image to delete
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the file path from URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);

      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      // Don't throw error for delete operations
    }
  }

  /**
   * Validate image file
   * @param file - File to validate
   * @returns boolean - True if valid
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP",
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "Kích thước file không được vượt quá 5MB",
      };
    }

    return { valid: true };
  }

  /**
   * Upload video to Firebase Storage
   * @param file - Video file to upload
   * @param lecturerId - Lecturer ID for file naming
   * @returns Promise<string> - Download URL of uploaded video
   */
  static async uploadLecturerVideo(
    file: File,
    lecturerId: string
  ): Promise<string> {
    try {
      console.log("Starting video upload for lecturer:", lecturerId);
      console.log("Video file details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Create a reference to the file location
      const fileExtension = file.name.split(".").pop() || "mp4";
      const fileName = `lecturers/${lecturerId}/intro.${fileExtension}`;
      console.log("Video upload path:", fileName);

      const storageRef = ref(storage, fileName);

      // Upload the video với resumable upload
      console.log("Uploading video...");
      const uploadTask = uploadBytesResumable(storageRef, file);

      const snapshot = await new Promise<any>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Video upload is " + progress + "% done");
          },
          (error) => {
            console.error("Video upload error:", error);
            reject(error);
          },
          () => {
            resolve(uploadTask.snapshot);
          }
        );
      });

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Video download URL obtained:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw new Error(`Không thể tải lên video: ${(error as Error).message}`);
    }
  }

  /**
   * Validate video file
   * @param file - File to validate
   * @returns boolean - True if valid
   */
  static validateVideoFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Chỉ chấp nhận file video định dạng MP4, WebM hoặc OGG",
      };
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "Kích thước video không được vượt quá 50MB",
      };
    }

    return { valid: true };
  }

  /**
   * Generate default avatar URL based on name
   * @param name - Full name of lecturer
   * @returns string - Default avatar URL
   */
  static generateDefaultAvatar(name: string): string {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials
    )}&background=228be6&color=fff&size=200&font-size=0.6`;
  }
}
