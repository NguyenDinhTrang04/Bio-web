import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { Lecturer, LecturerFormData } from "../types/lecturer";

const COLLECTION_NAME = "giangVien";

export class LecturerService {
  /**
   * Lấy tất cả giảng viên
   */
  static async getAllLecturers(): Promise<Lecturer[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("hoVaTen"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Lecturer)
      );
    } catch (error) {
      console.error("Error getting lecturers:", error);
      throw error;
    }
  }

  /**
   * Lấy giảng viên theo ID
   */
  static async getLecturerById(id: string): Promise<Lecturer | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Lecturer;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting lecturer by ID:", error);
      throw error;
    }
  }

  /**
   * Tìm kiếm giảng viên theo tên
   */
  static async searchLecturersByName(name: string): Promise<Lecturer[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("hoVaTen", ">=", name),
        where("hoVaTen", "<=", name + "\uf8ff"),
        orderBy("hoVaTen")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Lecturer)
      );
    } catch (error) {
      console.error("Error searching lecturers:", error);
      throw error;
    }
  }

  /**
   * Lấy giảng viên theo trạng thái
   */
  static async getLecturersByStatus(status: boolean): Promise<Lecturer[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("status", "==", status),
        orderBy("hoVaTen")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Lecturer)
      );
    } catch (error) {
      console.error("Error getting lecturers by status:", error);
      throw error;
    }
  }

  /**
   * Thêm mới giảng viên
   */
  static async addLecturer(lecturerData: LecturerFormData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...lecturerData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error adding lecturer:", error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin giảng viên
   */
  static async updateLecturer(
    id: string,
    lecturerData: Partial<LecturerFormData>
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...lecturerData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating lecturer:", error);
      throw error;
    }
  }

  /**
   * Xóa giảng viên
   */
  static async deleteLecturer(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting lecturer:", error);
      throw error;
    }
  }

  /**
   * Cập nhật trạng thái giảng viên
   */
  static async updateLecturerStatus(
    id: string,
    status: boolean
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating lecturer status:", error);
      throw error;
    }
  }

  /**
   * Kiểm tra email đã tồn tại
   */
  static async checkEmailExists(
    email: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      if (excludeId) {
        // Loại bỏ document hiện tại khi update
        return querySnapshot.docs.some((doc) => doc.id !== excludeId);
      }

      return querySnapshot.docs.length > 0;
    } catch (error) {
      console.error("Error checking email exists:", error);
      throw error;
    }
  }

  /**
   * Kiểm tra mã định danh đã tồn tại
   */
  static async checkMaDinhDanhExists(
    maDinhDanh: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("maDinhDanh", "==", maDinhDanh)
      );
      const querySnapshot = await getDocs(q);

      if (excludeId) {
        // Loại bỏ document hiện tại khi update
        return querySnapshot.docs.some((doc) => doc.id !== excludeId);
      }

      return querySnapshot.docs.length > 0;
    } catch (error) {
      console.error("Error checking maDinhDanh exists:", error);
      throw error;
    }
  }
}
