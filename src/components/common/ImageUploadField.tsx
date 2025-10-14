import React, { useState } from "react";
import {
  Stack,
  Text,
  Group,
  Avatar,
  FileButton,
  Button,
  ActionIcon,
  Alert,
  Progress,
} from "@mantine/core";
import {
  IconCamera,
  IconTrash,
  IconAlertCircle,
  IconUpload,
} from "@tabler/icons-react";
import { ImageUploadService } from "../../services/imageUploadService";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (imageUrl: string | undefined) => void;
  lecturerName: string;
  lecturerId?: string;
  disabled?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  lecturerName,
  lecturerId,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Get display image URL or default avatar
  const displayImageUrl =
    value || ImageUploadService.generateDefaultAvatar(lecturerName);
  const isDefaultAvatar = !value;

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    setError(null);

    // Validate file
    const validation = ImageUploadService.validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "File không hợp lệ");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Use temporary ID if lecturer doesn't exist yet
      const uploadId = lecturerId || `temp_${Date.now()}`;
      const imageUrl = await ImageUploadService.uploadLecturerImage(
        file,
        uploadId
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Delete old image if exists
      if (value && !isDefaultAvatar) {
        await ImageUploadService.deleteImage(value);
      }

      onChange(imageUrl);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemoveImage = async () => {
    if (!value || isDefaultAvatar) return;

    try {
      await ImageUploadService.deleteImage(value);
      onChange(undefined);
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  return (
    <Stack gap="sm">
      <Text size="sm" fw={500}>
        Ảnh đại diện
      </Text>

      <Group align="flex-start" gap="md">
        <Avatar
          src={displayImageUrl}
          size="xl"
          radius="md"
          style={{
            border: isDefaultAvatar ? "2px dashed #ced4da" : "none",
          }}
        />

        <Stack gap="xs" style={{ flex: 1 }}>
          <Group gap="xs">
            <FileButton
              onChange={handleFileSelect}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              disabled={disabled || uploading}
            >
              {(props) => (
                <Button
                  {...props}
                  size="sm"
                  variant="light"
                  leftSection={<IconCamera size={14} />}
                  loading={uploading}
                >
                  {isDefaultAvatar ? "Tải ảnh lên" : "Thay đổi ảnh"}
                </Button>
              )}
            </FileButton>

            {!isDefaultAvatar && (
              <ActionIcon
                size="sm"
                variant="light"
                color="red"
                onClick={handleRemoveImage}
                disabled={disabled || uploading}
              >
                <IconTrash size={14} />
              </ActionIcon>
            )}
          </Group>

          {uploading && (
            <Progress value={uploadProgress} size="sm" animated color="blue" />
          )}

          <Text size="xs" c="dimmed">
            Chấp nhận: JPG, PNG, WebP (tối đa 5MB)
          </Text>
        </Stack>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
          {error}
        </Alert>
      )}
    </Stack>
  );
};

export default ImageUploadField;
