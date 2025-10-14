import { useState, useEffect, useRef, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { Lecturer, LecturerFormData } from "../types/lecturer";
import { LecturerService } from "../services/lecturerService";

export const useLecturerManager = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Load all lecturers - memoized to prevent recreation
  const loadLecturers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await LecturerService.getAllLecturers();
      setLecturers(data);
    } catch (err) {
      setError("Không thể tải danh sách giảng viên");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new lecturer
  const addLecturer = async (
    lecturerData: LecturerFormData
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Kiểm tra email đã tồn tại
      const emailExists = await LecturerService.checkEmailExists(
        lecturerData.email
      );
      if (emailExists) {
        notifications.show({
          title: "Lỗi!",
          message: "Email này đã được sử dụng",
          color: "red",
        });
        return false;
      }

      // Kiểm tra mã định danh đã tồn tại
      const maDinhDanhExists = await LecturerService.checkMaDinhDanhExists(
        lecturerData.maDinhDanh
      );
      if (maDinhDanhExists) {
        notifications.show({
          title: "Lỗi!",
          message: "Mã định danh này đã được sử dụng",
          color: "red",
        });
        return false;
      }

      await LecturerService.addLecturer(lecturerData);
      await loadLecturers(); // Reload the list
      return true;
    } catch (err) {
      setError("Không thể thêm giảng viên mới");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Import multiple lecturers from Excel
  const importLecturers = useCallback(
    async (lecturersData: LecturerFormData[]): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        let successCount = 0;
        let failedCount = 0;
        const errors: string[] = [];

        for (let index = 0; index < lecturersData.length; index++) {
          const lecturerData = lecturersData[index];
          try {
            // Check for duplicates
            const emailExists = await LecturerService.checkEmailExists(
              lecturerData.email
            );
            const maDinhDanhExists =
              await LecturerService.checkMaDinhDanhExists(
                lecturerData.maDinhDanh
              );

            if (emailExists) {
              errors.push(
                `Dòng ${index + 1}: Email ${lecturerData.email} đã được sử dụng`
              );
              failedCount++;
              continue;
            }

            if (maDinhDanhExists) {
              errors.push(
                `Dòng ${index + 1}: Mã định danh ${
                  lecturerData.maDinhDanh
                } đã được sử dụng`
              );
              failedCount++;
              continue;
            }

            await LecturerService.addLecturer(lecturerData);
            successCount++;
          } catch (error) {
            errors.push(`Dòng ${index + 1}: ${(error as Error).message}`);
            failedCount++;
          }
        }

        await loadLecturers(); // Reload the list

        // Show result notification
        if (successCount > 0) {
          notifications.show({
            title: "Import hoàn thành!",
            message: `Thành công: ${successCount}, Thất bại: ${failedCount}`,
            color: failedCount === 0 ? "green" : "yellow",
          });
        }

        if (failedCount > 0) {
          setError(
            `Có ${failedCount} lỗi trong quá trình import: ${errors.join("; ")}`
          );
        }
      } catch (err) {
        setError("Không thể import danh sách giảng viên");
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadLecturers]
  );

  // Update lecturer
  const updateLecturer = async (
    id: string,
    lecturerData: Partial<LecturerFormData>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Kiểm tra email đã tồn tại (loại trừ lecturer hiện tại)
      if (lecturerData.email) {
        const emailExists = await LecturerService.checkEmailExists(
          lecturerData.email,
          id
        );
        if (emailExists) {
          setError("Email này đã được sử dụng bởi giảng viên khác");
          return false;
        }
      }

      // Kiểm tra mã định danh đã tồn tại (loại trừ lecturer hiện tại)
      if (lecturerData.maDinhDanh) {
        const maDinhDanhExists = await LecturerService.checkMaDinhDanhExists(
          lecturerData.maDinhDanh,
          id
        );
        if (maDinhDanhExists) {
          setError("Mã định danh này đã được sử dụng bởi giảng viên khác");
          return false;
        }
      }

      await LecturerService.updateLecturer(id, lecturerData);
      await loadLecturers(); // Reload the list
      return true;
    } catch (err) {
      setError("Không thể cập nhật thông tin giảng viên");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete lecturer
  const deleteLecturer = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await LecturerService.deleteLecturer(id);
      await loadLecturers(); // Reload the list
      return true;
    } catch (err) {
      setError("Không thể xóa giảng viên");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update lecturer status
  const updateLecturerStatus = async (
    id: string,
    status: boolean
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await LecturerService.updateLecturerStatus(id, status);
      await loadLecturers(); // Reload the list
      return true;
    } catch (err) {
      setError("Không thể cập nhật trạng thái giảng viên");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Search lecturers by name
  const searchLecturers = async (name: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await LecturerService.searchLecturersByName(name);
      setLecturers(data);
    } catch (err) {
      setError("Không thể tìm kiếm giảng viên");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter lecturers by status
  const filterByStatus = async (status: boolean): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await LecturerService.getLecturersByStatus(status);
      setLecturers(data);
    } catch (err) {
      setError("Không thể lọc giảng viên theo trạng thái");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get lecturer by ID - memoized to prevent useEffect loops
  const getLecturerById = useCallback(
    async (id: string): Promise<Lecturer | null> => {
      setLoading(true);
      setError(null);
      try {
        const lecturer = await LecturerService.getLecturerById(id);
        return lecturer;
      } catch (err) {
        setError("Không thể tải thông tin giảng viên");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load lecturers on mount - only once
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadLecturers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    lecturers,
    loading,
    error,
    loadLecturers,
    addLecturer,
    updateLecturer,
    deleteLecturer,
    updateLecturerStatus,
    searchLecturers,
    filterByStatus,
    getLecturerById,
    importLecturers,
    clearError,
  };
};
