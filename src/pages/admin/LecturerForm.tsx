import React, { useEffect, useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Stack,
  Grid,
  Switch,
  Title,
  Box,
  LoadingOverlay,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Lecturer, LecturerFormData } from "../../types/lecturer";
import ImageUploadField from "../../components/common/ImageUploadField";
import VideoUploadField from "../../components/common/VideoUploadField";

interface LecturerFormProps {
  lecturer?: Lecturer;
  onSubmit: (data: LecturerFormData) => Promise<boolean>;
  opened: boolean;
  onClose: () => void;
  isEditing?: boolean;
}

const LecturerForm: React.FC<LecturerFormProps> = ({
  lecturer,
  onSubmit,
  opened,
  onClose,
  isEditing = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LecturerFormData>({
    initialValues: {
      chucDanh: "",
      chucVu: "",
      chuyenMonDaoTao: "",
      email: "",
      hoVaTen: "",
      hocVi: "",
      imageUrl: "",
      videoUrl: "",
      maDinhDanh: "",
      ngaySinh: "",
      phongBan: "",
      soDienThoai: "",
      status: true,
    },
    validate: {
      hoVaTen: (value) => (value.trim() ? null : "Họ và tên là bắt buộc"),
      email: (value) => {
        if (!value.trim()) return "Email là bắt buộc";
        if (!/\S+@\S+\.\S+/.test(value)) return "Email không hợp lệ";
        return null;
      },
      maDinhDanh: (value) => (value.trim() ? null : "Mã định danh là bắt buộc"),
      chucDanh: (value) => (value.trim() ? null : "Chức danh là bắt buộc"),
      chucVu: (value) => (value.trim() ? null : "Chức vụ là bắt buộc"),
      phongBan: (value) => (value.trim() ? null : "Phòng ban là bắt buộc"),
      hocVi: (value) => (value.trim() ? null : "Học vị là bắt buộc"),
      chuyenMonDaoTao: (value) =>
        value.trim() ? null : "Chuyên môn đào tạo là bắt buộc",
      ngaySinh: (value) => (value.trim() ? null : "Ngày sinh là bắt buộc"),
      soDienThoai: (value) => {
        if (!value.trim()) return "Số điện thoại là bắt buộc";
        if (!/^[0-9+\-\s()]+$/.test(value)) return "Số điện thoại không hợp lệ";
        return null;
      },
    },
  });

  // Helper function to convert date format
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";

    // If already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Handle Excel serial date number (like "30996")
    const serialNumber = parseInt(dateString);
    if (!isNaN(serialNumber) && serialNumber > 0) {
      // Excel epoch starts from January 1, 1900 (but Excel incorrectly treats 1900 as leap year)
      // So we use January 1, 1900 as base and subtract 1 day to account for Excel's leap year bug
      const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
      const date = new Date(
        excelEpoch.getTime() + serialNumber * 24 * 60 * 60 * 1000
      );

      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }

    // Try to parse as regular date string
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; // Return empty if can't parse
    }

    // Convert to YYYY-MM-DD format
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (opened) {
      if (lecturer && isEditing) {
        form.setValues({
          chucDanh: lecturer.chucDanh,
          chucVu: lecturer.chucVu,
          chuyenMonDaoTao: lecturer.chuyenMonDaoTao,
          email: lecturer.email,
          hoVaTen: lecturer.hoVaTen,
          hocVi: lecturer.hocVi,
          imageUrl: lecturer.imageUrl || "",
          videoUrl: lecturer.videoUrl || "",
          maDinhDanh: lecturer.maDinhDanh,
          ngaySinh: formatDateForInput(lecturer.ngaySinh),
          phongBan: lecturer.phongBan,
          soDienThoai: lecturer.soDienThoai,
          status: lecturer.status,
        });
        form.clearErrors();
      } else {
        form.reset();
        form.clearErrors();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lecturer, isEditing, opened]);

  const handleSubmit = async (values: LecturerFormData) => {
    setIsSubmitting(true);

    try {
      const success = await onSubmit(values);

      if (success) {
        notifications.show({
          title: "Thành công!",
          message: isEditing
            ? "Cập nhật thông tin giảng viên thành công"
            : "Thêm giảng viên mới thành công",
          color: "green",
        });

        if (!isEditing) {
          form.reset();
        }
        onClose();
      }
    } catch (error) {
      notifications.show({
        title: "Lỗi!",
        message: "Có lỗi xảy ra khi xử lý dữ liệu",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3}>
          {isEditing ? "Sửa thông tin giảng viên" : "Thêm giảng viên mới"}
        </Title>
      }
      size="lg"
      centered
    >
      <Box pos="relative">
        <LoadingOverlay visible={isSubmitting} />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {/* Image Upload Section */}
            <ImageUploadField
              value={form.values.imageUrl}
              onChange={(imageUrl) =>
                form.setFieldValue("imageUrl", imageUrl || "")
              }
              lecturerName={form.values.hoVaTen || "Giảng viên"}
              lecturerId={lecturer?.id}
              disabled={isSubmitting}
            />

            {/* Video Upload Field */}
            <VideoUploadField
              value={form.values.videoUrl}
              onChange={(videoUrl) =>
                form.setFieldValue("videoUrl", videoUrl || "")
              }
              lecturerName={form.values.hoVaTen || "Giảng viên"}
              lecturerId={lecturer?.id}
              disabled={isSubmitting}
            />

            <Divider />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Họ và tên"
                  placeholder="Nhập họ và tên"
                  required
                  {...form.getInputProps("hoVaTen")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Email"
                  placeholder="Nhập email"
                  type="email"
                  required
                  {...form.getInputProps("email")}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Mã định danh"
                  placeholder="Nhập mã định danh"
                  required
                  {...form.getInputProps("maDinhDanh")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  required
                  {...form.getInputProps("soDienThoai")}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Chức danh"
                  placeholder="Nhập chức danh"
                  required
                  {...form.getInputProps("chucDanh")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Chức vụ"
                  placeholder="Nhập chức vụ"
                  required
                  {...form.getInputProps("chucVu")}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Học vị"
                  placeholder="Nhập học vị"
                  required
                  {...form.getInputProps("hocVi")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Phòng ban"
                  placeholder="Nhập phòng ban"
                  required
                  {...form.getInputProps("phongBan")}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Chuyên môn đào tạo"
                  placeholder="Nhập chuyên môn đào tạo"
                  required
                  {...form.getInputProps("chuyenMonDaoTao")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Ngày sinh"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  required
                  {...form.getInputProps("ngaySinh")}
                />
              </Grid.Col>
            </Grid>

            <Switch
              label="Trạng thái hoạt động"
              description="Bật/tắt trạng thái hoạt động của giảng viên"
              {...form.getInputProps("status", { type: "checkbox" })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default LecturerForm;
