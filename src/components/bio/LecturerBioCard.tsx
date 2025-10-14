import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Avatar,
  Text,
  Badge,
  Group,
  Stack,
  Title,
  Divider,
  Grid,
  Paper,
  Center,
  ThemeIcon,
  Anchor,
  Container,
  Button,
} from "@mantine/core";
import {
  IconMail,
  IconPhone,
  IconCalendar,
  IconBuildingBank,
  IconUser,
  IconBriefcase,
  IconSchool,
  IconCertificate,
} from "@tabler/icons-react";
import { Lecturer } from "../../types/lecturer";
import { ImageUploadService } from "../../services/imageUploadService";

interface LecturerBioCardProps {
  lecturer: Lecturer;
  variant?: "default" | "compact" | "detailed";
  showViewButton?: boolean;
}

const LecturerBioCard: React.FC<LecturerBioCardProps> = ({
  lecturer,
  variant = "default",
  showViewButton = true,
}) => {
  const navigate = useNavigate();
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getAvatarName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayImage = (lecturer: Lecturer) => {
    return (
      lecturer.imageUrl ||
      ImageUploadService.generateDefaultAvatar(lecturer.hoVaTen)
    );
  };

  // Component để hiển thị Avatar hoặc Video
  const ProfileMedia: React.FC<{
    lecturer: Lecturer;
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "avatar" | "video";
  }> = ({ lecturer, size = "md", variant = "avatar" }) => {
    const hasVideo = !!lecturer.videoUrl;

    // Kích thước cho video và avatar
    const videoSizes = {
      sm: { width: 80, height: 80 },
      md: { width: 120, height: 120 },
      lg: { width: 160, height: 160 },
      xl: { width: 200, height: 200 },
    };

    const avatarSizes = {
      sm: 64,
      md: "lg" as const,
      lg: 120,
      xl: 160,
    };

    if (hasVideo && variant === "video") {
      return (
        <div
          style={{
            width: videoSizes[size].width,
            height: videoSizes[size].height,
            borderRadius: size === "sm" || size === "md" ? "50%" : "12px",
            overflow: "hidden",
            border: "2px solid #228be6",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <video
            width="100%"
            height="100%"
            muted
            loop
            preload="metadata"
            style={{
              objectFit: "cover",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              // Auto play on hover
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {
                // Handle autoplay restrictions
                console.log("Autoplay blocked, user interaction required");
              });
              // Scale effect on hover
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              // Pause and reset on mouse leave
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
              // Remove scale effect
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={(e) => {
              // Toggle play/pause on click
              if (e.currentTarget.paused) {
                e.currentTarget.play();
              } else {
                e.currentTarget.pause();
              }
            }}
          >
            <source src={lecturer.videoUrl} type="video/mp4" />
          </video>
        </div>
      );
    }

    // Fallback to avatar nếu không có video
    return (
      <Avatar
        size={avatarSizes[size]}
        radius={size === "sm" || size === "md" ? "50%" : "md"}
        src={getDisplayImage(lecturer)}
        style={{
          border: hasVideo ? "2px solid #40c057" : "2px solid #e9ecef",
        }}
      />
    );
  };

  if (variant === "compact") {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group>
          <ProfileMedia
            lecturer={lecturer}
            size="md"
            variant={lecturer.videoUrl ? "video" : "avatar"}
          />
          <div style={{ flex: 1 }}>
            <Text fw={600} size="lg">
              {lecturer.hoVaTen}
            </Text>
            <Text size="sm" c="dimmed">
              {lecturer.hocVi}
            </Text>
            <Text size="sm" c="dimmed">
              {lecturer.chucDanh}
            </Text>
            {/* <Badge
              color={lecturer.status ? "green" : "red"}
              variant="light"
              size="sm"
            >
              {lecturer.status ? "Đang hoạt động" : "Không hoạt động"}
            </Badge> */}
            {showViewButton && lecturer.id && (
              <Button
                size="xs"
                variant="light"
                onClick={() => navigate(`/bio/${lecturer.id}`)}
                mt="xs"
              >
                Xem chi tiết
              </Button>
            )}
          </div>
        </Group>
      </Card>
    );
  }

  if (variant === "detailed") {
    return (
      <Container fluid py="xl" px="xl">
        <Card
          shadow="lg"
          padding="xl"
          radius="lg"
          withBorder
          style={{ maxWidth: "1800px", margin: "0 auto" }}
        >
          <Stack gap="xl">
            {/* Header Section */}
            <Center>
              <Stack align="center" gap="md">
                <ProfileMedia
                  lecturer={lecturer}
                  size="xl"
                  variant={lecturer.videoUrl ? "video" : "avatar"}
                />
                <div style={{ textAlign: "center" }}>
                  <Title order={2} c="blue">
                    {lecturer.hoVaTen}
                  </Title>
                  <Text size="lg" c="dimmed" fw={500}>
                    {lecturer.hocVi}
                  </Text>
                  <Badge
                    color={lecturer.status ? "green" : "red"}
                    variant="filled"
                    size="lg"
                    mt="xs"
                  >
                    {lecturer.status ? "Đang hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
              </Stack>
            </Center>

            <Divider />

            {/* Contact Information */}
            <Paper p="lg" radius="md" withBorder>
              <Title order={4} mb="md" c="blue">
                Thông tin liên hệ
              </Title>
              <Grid>
                <Grid.Col span={6}>
                  <Group gap="sm">
                    <ThemeIcon variant="light" color="blue" size="sm">
                      <IconMail size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        Email
                      </Text>
                      <Anchor href={`mailto:${lecturer.email}`} size="sm">
                        {lecturer.email}
                      </Anchor>
                    </div>
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group gap="sm">
                    <ThemeIcon variant="light" color="green" size="sm">
                      <IconPhone size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        Điện thoại
                      </Text>
                      <Anchor href={`tel:${lecturer.soDienThoai}`} size="sm">
                        {lecturer.soDienThoai}
                      </Anchor>
                    </div>
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Professional Information */}
            <Paper p="lg" radius="md" withBorder>
              <Title order={4} mb="md" c="blue">
                Thông tin nghề nghiệp
              </Title>
              <Grid>
                <Grid.Col span={6}>
                  <Group gap="sm" mb="md">
                    <ThemeIcon variant="light" color="orange" size="sm">
                      <IconBriefcase size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        Chức danh
                      </Text>
                      <Text size="sm">{lecturer.chucDanh}</Text>
                    </div>
                  </Group>
                  <Group gap="sm" mb="md">
                    <ThemeIcon variant="light" color="purple" size="sm">
                      <IconUser size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        Chức vụ
                      </Text>
                      <Text size="sm">{lecturer.chucVu}</Text>
                    </div>
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group gap="sm" mb="md">
                    <ThemeIcon variant="light" color="teal" size="sm">
                      <IconBuildingBank size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        Phòng ban
                      </Text>
                      <Text size="sm">{lecturer.phongBan}</Text>
                    </div>
                  </Group>
                  <Group gap="sm" mb="md">
                    <ThemeIcon variant="light" color="red" size="sm">
                      <IconCertificate size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        Mã định danh
                      </Text>
                      <Text size="sm">{lecturer.maDinhDanh}</Text>
                    </div>
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Academic Information */}
            <Paper p="lg" radius="md" withBorder>
              <Title order={4} mb="md" c="blue">
                Thông tin học thuật
              </Title>
              <Grid>
                <Grid.Col span={6}>
                  <Group gap="sm">
                    <ThemeIcon variant="light" color="indigo" size="sm">
                      <IconSchool size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        Chuyên môn đào tạo
                      </Text>
                      <Text size="sm">{lecturer.chuyenMonDaoTao}</Text>
                    </div>
                  </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Group gap="sm">
                    <ThemeIcon variant="light" color="yellow" size="sm">
                      <IconCalendar size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        Ngày sinh
                      </Text>
                      <Text size="sm">{formatDate(lecturer.ngaySinh)}</Text>
                    </div>
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>
          </Stack>
        </Card>
      </Container>
    );
  }

  // Default variant
  return (
    <Card shadow="md" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group>
          <ProfileMedia
            lecturer={lecturer}
            size="lg"
            variant={lecturer.videoUrl ? "video" : "avatar"}
          />
          <div style={{ flex: 1 }}>
            <Title order={3}>{lecturer.hoVaTen}</Title>
            <Text size="lg" c="dimmed">
              {lecturer.hocVi}
            </Text>
            {/* <Badge color={lecturer.status ? "green" : "red"} variant="light">
              {lecturer.status ? "Đang hoạt động" : "Không hoạt động"}
            </Badge> */}
            {showViewButton && lecturer.id && (
              <Button
                size="sm"
                variant="light"
                onClick={() => {
                  console.log("Navigating to lecturer ID:", lecturer.id);
                  navigate(`/bio/${lecturer.id}`);
                }}
                mt="xs"
              >
                Xem chi tiết
              </Button>
            )}
          </div>
        </Group>

        <Divider />

        <Grid>
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconBriefcase size={16} color="orange" />
              <div>
                <Text size="xs" c="dimmed">
                  Chức danh
                </Text>
                <Text size="sm">{lecturer.chucDanh}</Text>
              </div>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconBuildingBank size={16} color="teal" />
              <div>
                <Text size="xs" c="dimmed">
                  Phòng ban
                </Text>
                <Text size="sm">{lecturer.phongBan}</Text>
              </div>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconMail size={16} color="blue" />
              <div>
                <Text size="xs" c="dimmed">
                  Email
                </Text>
                <Anchor href={`mailto:${lecturer.email}`} size="sm">
                  {lecturer.email}
                </Anchor>
              </div>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconPhone size={16} color="green" />
              <div>
                <Text size="xs" c="dimmed">
                  Điện thoại
                </Text>
                <Text size="sm">{lecturer.soDienThoai}</Text>
              </div>
            </Group>
          </Grid.Col>
        </Grid>
      </Stack>
    </Card>
  );
};

export default LecturerBioCard;
