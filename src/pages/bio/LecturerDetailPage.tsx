import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Stack,
  Alert,
  Center,
  Loader,
  Text,
  Breadcrumbs,
  Anchor,
  ActionIcon,
  Group,
} from "@mantine/core";
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";
import { useLecturerManager } from "../../hooks/useLecturerManager";
import LecturerBioCard from "../../components/bio/LecturerBioCard";
import { Lecturer } from "../../types/lecturer";

const LecturerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLecturerById } = useLecturerManager();

  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLecturer = async () => {
      if (!id) {
        setError("ID giảng viên không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getLecturerById(id);

        if (data) {
          setLecturer(data);
        } else {
          setError("Không tìm thấy thông tin giảng viên");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin giảng viên");
      } finally {
        setLoading(false);
      }
    };

    loadLecturer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const breadcrumbItems = [
    { title: "Trang chủ", href: "/" },
    { title: "Danh sách giảng viên", href: "/bio" },
    { title: lecturer?.hoVaTen || "Chi tiết", href: `/bio/${id}` },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Loader size="lg" />
            <Text>Đang tải thông tin giảng viên...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Stack gap="lg">
          <Group>
            <ActionIcon
              variant="subtle"
              onClick={() => navigate("/bio")}
              size="lg"
            >
              <IconArrowLeft size={18} />
            </ActionIcon>
            <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
          </Group>

          <Alert icon={<IconAlertCircle size={16} />} title="Lỗi!" color="red">
            {error}
          </Alert>

          <Center>
            <Button
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate("/bio")}
              variant="outline"
            >
              Quay lại danh sách
            </Button>
          </Center>
        </Stack>
      </Container>
    );
  }

  if (!lecturer) {
    return null;
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group>
          <ActionIcon
            variant="subtle"
            onClick={() => navigate("/bio")}
            size="lg"
          >
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
        </Group>

        <LecturerBioCard lecturer={lecturer} variant="detailed" />

        <Center>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate("/bio")}
            variant="outline"
          >
            Quay lại danh sách
          </Button>
        </Center>
      </Stack>
    </Container>
  );
};

export default LecturerDetailPage;
