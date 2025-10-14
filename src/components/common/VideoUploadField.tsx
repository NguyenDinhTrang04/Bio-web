import React, { useState } from "react";
import {
  Stack,
  Text,
  Group,
  FileButton,
  Button,
  ActionIcon,
  Alert,
  Progress,
  Box,
} from "@mantine/core";
import {
  IconVideo,
  IconTrash,
  IconAlertCircle,
  IconUpload,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { ImageUploadService } from "../../services/imageUploadService";

interface VideoUploadFieldProps {
  value?: string;
  onChange: (videoUrl: string | undefined) => void;
  lecturerName: string;
  lecturerId?: string;
  disabled?: boolean;
}

const VideoUploadField: React.FC<VideoUploadFieldProps> = ({
  value,
  onChange,
  lecturerName,
  lecturerId,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    setError(null);

    // Validate file
    const validation = ImageUploadService.validateVideoFile(file);
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
          return prev + 5;
        });
      }, 500);

      // Use temporary ID if lecturer doesn't exist yet
      const uploadId = lecturerId || `temp_${Date.now()}`;
      const videoUrl = await ImageUploadService.uploadLecturerVideo(
        file,
        uploadId
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Delete old video if exists
      if (value) {
        try {
          await ImageUploadService.deleteImage(value); // Use deleteImage for both image and video
        } catch (error) {
          console.warn("Could not delete old video:", error);
        }
      }

      onChange(videoUrl);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemoveVideo = async () => {
    if (!value) return;

    try {
      await ImageUploadService.deleteImage(value); // Use deleteImage for both
      onChange(undefined);
    } catch (error) {
      console.error("Error removing video:", error);
    }
  };

  return (
    <Stack gap="sm">
      <Text size="sm" fw={500}>
        Video giới thiệu
        <Text span c="red" ml={4}>
          *
        </Text>
      </Text>

      {/* Video Preview */}
      {value && (
        <Box
          style={{
            border: "1px solid #e9ecef",
            borderRadius: "8px",
            padding: "8px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <video
            width="100%"
            height="200"
            controls
            style={{ borderRadius: "4px" }}
          >
            <source src={value} type="video/mp4" />
            Trình duyệt không hỗ trợ video.
          </video>

          <Group justify="space-between" mt="xs">
            <Text size="xs" c="dimmed">
              Video intro cho {lecturerName}
            </Text>
            <ActionIcon
              color="red"
              variant="light"
              onClick={handleRemoveVideo}
              disabled={disabled}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Box>
      )}

      {/* Upload Progress */}
      {uploading && (
        <Stack gap="xs">
          <Progress value={uploadProgress} size="sm" />
          <Text size="xs" c="dimmed" ta="center">
            Đang tải lên video... {Math.round(uploadProgress)}%
          </Text>
        </Stack>
      )}

      {/* Error Message */}
      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Lỗi tải lên"
          color="red"
          variant="light"
        >
          {error}
        </Alert>
      )}

      {/* Upload Button */}
      <FileButton
        onChange={handleFileSelect}
        accept="video/*"
        disabled={disabled || uploading}
      >
        {(props) => (
          <Button
            {...props}
            variant={value ? "light" : "outline"}
            leftSection={
              value ? <IconVideo size="1rem" /> : <IconUpload size="1rem" />
            }
            loading={uploading}
            fullWidth
          >
            {value ? "Thay đổi video" : "Tải lên video intro"}
          </Button>
        )}
      </FileButton>

      <Text size="xs" c="dimmed">
        Chấp nhận: MP4, WebM, OGG. Tối đa 50MB. Video ngắn (30-60 giây) được
        khuyến khích.
      </Text>
    </Stack>
  );
};

export default VideoUploadField;
