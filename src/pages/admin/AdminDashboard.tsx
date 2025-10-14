import React, { useState, useMemo } from "react";
import {
  Container,
  Title,
  Button,
  Group,
  Stack,
  TextInput,
  SegmentedControl,
  Table,
  Badge,
  ActionIcon,
  Card,
  Text,
  Grid,
  Paper,
  Center,
  Loader,
  Alert,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconFileSpreadsheet,
} from "@tabler/icons-react";
import { Lecturer } from "../../types/lecturer";
import { useLecturerManager } from "../../hooks/useLecturerManager";
import LecturerForm from "./LecturerForm";
import ImportExcelModal from "../../components/admin/ImportExcelModal";

const LecturerManager: React.FC = () => {
  const {
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
    importLecturers,
    clearError,
  } = useLecturerManager();

  const [opened, { open, close }] = useDisclosure(false);
  const [importOpened, { open: openImport, close: closeImport }] =
    useDisclosure(false);
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Local filtering for real-time search
  const filteredLecturers = useMemo(() => {
    return lecturers.filter((lecturer) => {
      const matchesSearch =
        !searchTerm ||
        lecturer.hoVaTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.maDinhDanh.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.chuyenMonDaoTao
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && lecturer.status) ||
        (statusFilter === "inactive" && !lecturer.status);

      return matchesSearch && matchesStatus;
    });
  }, [lecturers, searchTerm, statusFilter]);

  // Handle form submission
  const handleFormSubmit = async (formData: any) => {
    if (editingLecturer) {
      const success = await updateLecturer(editingLecturer.id!, formData);
      if (success) {
        setEditingLecturer(null);
        close();
        notifications.show({
          title: "Thành công!",
          message: "Cập nhật thông tin giảng viên thành công",
          color: "green",
        });
      }
      return success;
    } else {
      const success = await addLecturer(formData);
      if (success) {
        close();
        notifications.show({
          title: "Thành công!",
          message: "Thêm giảng viên mới thành công",
          color: "green",
        });
      }
      return success;
    }
  };

  // Handle edit lecturer
  const handleEditLecturer = (lecturer: Lecturer) => {
    setEditingLecturer(lecturer);
    open();
  };

  // Handle delete lecturer with confirmation
  const handleDeleteLecturer = (lecturer: Lecturer) => {
    modals.openConfirmModal({
      title: "Xác nhận xóa giảng viên",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa giảng viên{" "}
          <strong>{lecturer.hoVaTen}</strong>? Hành động này không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        const success = await deleteLecturer(lecturer.id!);
        if (success) {
          notifications.show({
            title: "Thành công!",
            message: "Xóa giảng viên thành công",
            color: "green",
          });
        }
      },
    });
  };

  // Handle search - now uses local filtering
  const handleSearch = () => {
    // Search is now handled by useMemo, no need for API calls
  };

  // Handle status filter - now uses local filtering
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  // Handle toggle status
  const handleToggleStatus = async (lecturer: Lecturer) => {
    const success = await updateLecturerStatus(lecturer.id!, !lecturer.status);
    if (success) {
      notifications.show({
        title: "Thành công!",
        message: `${
          lecturer.status ? "Vô hiệu hóa" : "Kích hoạt"
        } giảng viên thành công`,
        color: "green",
      });
    }
  };

  // Clear search and reload
  const handleClearSearch = () => {
    setSearchTerm("");
    setStatusFilter("all");
    // Don't call loadLecturers - let the hook's initial data be used
  };

  // Statistics
  const totalLecturers = lecturers.length;
  const activeLecturers = lecturers.filter((l) => l.status).length;
  const inactiveLecturers = lecturers.filter((l) => !l.status).length;
  const filteredCount = filteredLecturers.length;

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Card padding="lg" radius="md" withBorder>
          <Flex justify="space-between" align="center">
            <Title order={1} c="blue">
              Quản lý Giảng viên
            </Title>
            <Group>
              <Button
                variant="light"
                leftSection={<IconFileSpreadsheet size={16} />}
                onClick={openImport}
              >
                Import Excel
              </Button>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => {
                  setEditingLecturer(null);
                  open();
                }}
              >
                Thêm giảng viên mới
              </Button>
            </Group>
          </Flex>
        </Card>

        {/* Statistics */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Paper p="md" radius="md" withBorder>
              <Group>
                <IconUsers size={24} color="blue" />
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Tổng số giảng viên
                  </Text>
                  <Text fw={700} size="xl">
                    {totalLecturers}
                  </Text>
                </div>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Paper p="md" radius="md" withBorder>
              <Group>
                <IconUserCheck size={24} color="green" />
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Đang hoạt động
                  </Text>
                  <Text fw={700} size="xl" c="green">
                    {activeLecturers}
                  </Text>
                </div>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Paper p="md" radius="md" withBorder>
              <Group>
                <IconUserX size={24} color="red" />
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Không hoạt động
                  </Text>
                  <Text fw={700} size="xl" c="red">
                    {inactiveLecturers}
                  </Text>
                </div>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Search and Filter */}
        <Card padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group>
              <TextInput
                placeholder="Tìm kiếm theo tên giảng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                style={{ flex: 1 }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                leftSection={<IconSearch size={16} />}
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
              <Button variant="outline" onClick={handleClearSearch}>
                Xóa bộ lọc
              </Button>
            </Group>

            <Group>
              <Text size="sm" fw={500}>
                Lọc theo trạng thái:
              </Text>
              <SegmentedControl
                value={statusFilter}
                onChange={handleStatusFilter}
                data={[
                  { label: "Tất cả", value: "all" },
                  { label: "Hoạt động", value: "active" },
                  { label: "Không hoạt động", value: "inactive" },
                ]}
              />
            </Group>

            {/* Show filtered results count */}
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Hiển thị {filteredCount} / {totalLecturers} giảng viên
              </Text>
              {(searchTerm || statusFilter !== "all") && (
                <Button size="xs" variant="light" onClick={handleClearFilters}>
                  Xóa bộ lọc
                </Button>
              )}
            </Group>
          </Stack>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Lỗi!"
            color="red"
            withCloseButton
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Center p="xl">
            <Stack align="center" gap="sm">
              <Loader size="lg" />
              <Text>Đang tải dữ liệu...</Text>
            </Stack>
          </Center>
        )}

        {/* Lecturers Table */}
        <Card padding="lg" radius="md" withBorder>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Họ và tên</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Mã định danh</Table.Th>
                <Table.Th>Chức danh</Table.Th>
                <Table.Th>Phòng ban</Table.Th>
                <Table.Th>Số điện thoại</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th>Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredLecturers.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <Center py="xl">
                      <Text c="dimmed">
                        {loading
                          ? "Đang tải dữ liệu..."
                          : "Không có giảng viên nào"}
                      </Text>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredLecturers.map((lecturer) => (
                  <Table.Tr key={lecturer.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500}>{lecturer.hoVaTen}</Text>
                        <Text size="xs" c="dimmed">
                          {lecturer.hocVi}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>{lecturer.email}</Table.Td>
                    <Table.Td>{lecturer.maDinhDanh}</Table.Td>
                    <Table.Td>
                      <div>
                        <Text>{lecturer.chucDanh}</Text>
                        <Text size="xs" c="dimmed">
                          {lecturer.chucVu}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>{lecturer.phongBan}</Table.Td>
                    <Table.Td>{lecturer.soDienThoai}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={lecturer.status ? "green" : "red"}
                        variant="light"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleToggleStatus(lecturer)}
                      >
                        {lecturer.status ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleEditLecturer(lecturer)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteLecturer(lecturer)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Form Modal */}
        <LecturerForm
          lecturer={editingLecturer || undefined}
          onSubmit={handleFormSubmit}
          opened={opened}
          onClose={() => {
            close();
            setEditingLecturer(null);
          }}
          isEditing={!!editingLecturer}
        />

        <ImportExcelModal
          opened={importOpened}
          onClose={closeImport}
          onImport={importLecturers}
        />
      </Stack>
    </Container>
  );
};

export default LecturerManager;
