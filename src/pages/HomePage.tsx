import React from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  SimpleGrid,
  ThemeIcon,
  Center,
  Paper,
  BackgroundImage,
  Overlay,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconUsers,
  IconSearch,
  IconDatabase,
  IconStar,
  IconBook,
  IconAward,
} from "@tabler/icons-react";
import { useLecturerManager } from "../hooks/useLecturerManager";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { lecturers } = useLecturerManager();

  const stats = [
    {
      icon: <IconUsers size={28} />,
      title: "Tổng số giảng viên",
      value: lecturers.length.toString(),
      color: "blue",
      description: "Giảng viên trong hệ thống",
    },
    {
      icon: <IconStar size={28} />,
      title: "Đang hoạt động",
      value: lecturers.filter((l) => l.status).length.toString(),
      color: "green",
      description: "Giảng viên đang công tác",
    },
    {
      icon: <IconBook size={28} />,
      title: "Phòng ban",
      value: new Set(lecturers.map((l) => l.phongBan)).size.toString(),
      color: "orange",
      description: "Số phòng ban khác nhau",
    },
    {
      icon: <IconAward size={28} />,
      title: "Chuyên môn",
      value: new Set(lecturers.map((l) => l.chuyenMonDaoTao)).size.toString(),
      color: "purple",
      description: "Lĩnh vực chuyên môn",
    },
  ];

  const features = [
    {
      icon: <IconSearch size={32} />,
      title: "Tìm kiếm dễ dàng",
      description:
        "Tìm kiếm giảng viên theo tên, email, phòng ban hoặc chuyên môn đào tạo một cách nhanh chóng và chính xác.",
      color: "blue",
    },
    {
      icon: <IconUsers size={32} />,
      title: "Thông tin chi tiết",
      description:
        "Xem thông tin đầy đủ về giảng viên bao gồm liên hệ, chức danh, học vị và chuyên môn.",
      color: "green",
    },
    {
      icon: <IconDatabase size={32} />,
      title: "Quản lý hiệu quả",
      description:
        "Hệ thống quản trị cho phép thêm, sửa, xóa thông tin giảng viên một cách dễ dàng và an toàn.",
      color: "orange",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <Paper radius={0} style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            // backgroundColor: "rgb(0, 53, 143, 1)",
            padding: "80px 0",
            color: "white",
          }}
        >
          <Container size="lg">
            <Stack align="center" gap="xl" ta="center">
              <Title order={1} size={48} fw={700}>
                Hệ thống Bio Page giới thiệu khoa công nghệ thông tin
              </Title>
              <Title order={2} size={24} fw={400} c="gray.1">
                Khoa Công nghệ thông tin Trường Đại học Đại Nam (FIT DNU)
              </Title>
              <Text size="lg" maw={600} c="gray.2">
                Khám phá thông tin chi tiết về đội ngũ giảng viên xuất sắc của
                khoa Công nghệ thông tin. Tìm hiểu về chuyên môn, kinh nghiệm và
                liên hệ với các thầy cô một cách dễ dàng.
              </Text>
              <Group gap="md">
                <Button
                  size="lg"
                  onClick={() => navigate("/bio")}
                  leftSection={<IconUsers size={20} />}
                >
                  Xem danh sách giảng viên
                </Button>
                {/* <Button
                  size="lg"
                  variant="outline"
                  color="white"
                  onClick={() => navigate("/admin")}
                  leftSection={<IconDatabase size={20} />}
                >
                  Quản trị hệ thống
                </Button> */}
              </Group>
            </Stack>
          </Container>
        </div>
      </Paper>

      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Statistics */}
          <div>
            <Title order={2} ta="center" mb="xl">
              Thống kê tổng quan
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
              {stats.map((stat, index) => (
                <Paper key={index} p="md" radius="md" withBorder shadow="sm">
                  <Group>
                    <ThemeIcon size="xl" variant="light" color={stat.color}>
                      {stat.icon}
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                        {stat.title}
                      </Text>
                      <Text fw={700} size="xl">
                        {stat.value}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {stat.description}
                      </Text>
                    </div>
                  </Group>
                </Paper>
              ))}
            </SimpleGrid>
          </div>

          {/* Features */}
          <div>
            <Title order={2} ta="center" mb="xl">
              Tính năng nổi bật
            </Title>
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
              {features.map((feature, index) => (
                <Card key={index} shadow="md" padding="xl" radius="md">
                  <Stack align="center" ta="center" gap="md">
                    <ThemeIcon
                      size={60}
                      variant="light"
                      color={feature.color}
                      radius="md"
                    >
                      {feature.icon}
                    </ThemeIcon>
                    <Title order={4}>{feature.title}</Title>
                    <Text c="dimmed" size="sm">
                      {feature.description}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </div>

          {/* Call to Action */}
          <Card shadow="lg" padding="xl" radius="md" withBorder>
            <Stack align="center" ta="center" gap="md">
              <Title order={3} c="blue">
                Sẵn sàng khám phá?
              </Title>
              <Text c="dimmed" maw={500}>
                Bắt đầu tìm hiểu về đội ngũ giảng viên xuất sắc của chúng tôi.
                Tìm kiếm thông tin liên hệ, chuyên môn và kinh nghiệm của các
                thầy cô.
              </Text>
              <Group>
                <Button
                  size="md"
                  onClick={() => navigate("/bio")}
                  leftSection={<IconUsers size={18} />}
                >
                  Khám phá ngay
                </Button>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </div>
  );
};

export default HomePage;
