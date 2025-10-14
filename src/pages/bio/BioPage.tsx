import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Title,
  Grid,
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  Card,
  Center,
  Loader,
  Text,
  Alert,
  Pagination,
  SimpleGrid,
  SegmentedControl,
  Paper,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconUsers,
  IconAlertCircle,
  IconHome,
  IconUser,
} from "@tabler/icons-react";
import { useLecturerManager } from "../../hooks/useLecturerManager";
import LecturerBioCard from "../../components/bio/LecturerBioCard";
import { Lecturer } from "../../types/lecturer";

const BioPage: React.FC = () => {
  const {
    lecturers,
    loading,
    error,
    searchLecturers,
    filterByStatus,
    loadLecturers,
    clearError,
  } = useLecturerManager();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get unique departments for filter - memoized to prevent unnecessary recalculation
  const departments = useMemo(() => {
    return Array.from(new Set(lecturers.map((l) => l.phongBan))).sort();
  }, [lecturers]);

  // Filter lecturers based on search and filters - memoized to prevent infinite loops
  const filteredLecturers = useMemo(() => {
    return lecturers.filter((lecturer) => {
      const matchesSearch =
        !searchTerm ||
        lecturer.hoVaTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.chuyenMonDaoTao
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesDepartment =
        !departmentFilter || lecturer.phongBan === departmentFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && lecturer.status) ||
        (statusFilter === "inactive" && !lecturer.status);

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [lecturers, searchTerm, departmentFilter, statusFilter]);

  // Pagination - memoized for performance
  const { totalPages, paginatedLecturers } = useMemo(() => {
    const totalPg = Math.ceil(filteredLecturers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filteredLecturers.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    return { totalPages: totalPg, paginatedLecturers: paginated };
  }, [filteredLecturers, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, statusFilter]);

  // Handle search - now just resets page since filtering is handled by useMemo
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Handle department filter
  const handleDepartmentFilter = (value: string | null) => {
    setDepartmentFilter(value);
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("");
    setStatusFilter("all");
    setCurrentPage(1);
    // Don't call loadLecturers here - let the hook's initial load handle it
  };

  const breadcrumbItems = [
    { title: "Trang chủ", href: "/" },
    { title: "Danh sách giảng viên", href: "/bio" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>

        {/* Header */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <div>
              <Title order={1} c="blue" mb="xs">
                <Group gap="sm">
                  <IconUsers size={32} />
                  Danh sách Giảng viên
                </Group>
              </Title>
              <Text c="dimmed">
                Khám phá thông tin chi tiết về các giảng viên của chúng tôi
              </Text>
            </div>
            <Paper p="md" withBorder>
              <Stack align="center" gap="xs">
                <Text size="xl" fw={700} c="blue">
                  {filteredLecturers.length}
                </Text>
                <Text size="sm" c="dimmed">
                  Giảng viên
                </Text>
              </Stack>
            </Paper>
          </Group>
        </Card>

        {/* Filters
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={4}>Bộ lọc và tìm kiếm</Title>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <TextInput
                  placeholder="Tìm kiếm theo tên, email hoặc chuyên môn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.currentTarget.value)}
                  leftSection={<IconSearch size={16} />}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  placeholder="Chọn phòng ban"
                  data={[
                    { value: "", label: "Tất cả phòng ban" },
                    ...departments.map((dept) => ({
                      value: dept,
                      label: dept,
                    })),
                  ]}
                  value={departmentFilter}
                  onChange={handleDepartmentFilter}
                  leftSection={<IconFilter size={16} />}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <SegmentedControl
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  data={[
                    { label: "Tất cả", value: "all" },
                    { label: "Hoạt động", value: "active" },
                    { label: "Nghỉ", value: "inactive" },
                  ]}
                  fullWidth
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
                <Group>
                  <Button onClick={handleSearch} variant="filled">
                    Tìm kiếm
                  </Button>
                  <Button onClick={handleClearFilters} variant="outline">
                    Xóa bộ lọc
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Hiển thị {paginatedLecturers.length} /{" "}
                {filteredLecturers.length} giảng viên
              </Text>

              <SegmentedControl
                value={viewMode}
                onChange={(value) => setViewMode(value as "grid" | "list")}
                data={[
                  { label: "Lưới", value: "grid" },
                  { label: "Danh sách", value: "list" },
                ]}
              />
            </Group>
          </Stack>
        </Card> */}

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
          <Center py="xl">
            <Stack align="center" gap="sm">
              <Loader size="lg" />
              <Text>Đang tải dữ liệu...</Text>
            </Stack>
          </Center>
        )}

        {/* Lecturers Display */}
        {!loading && (
          <>
            {paginatedLecturers.length === 0 ? (
              <Card shadow="sm" padding="xl" radius="md" withBorder>
                <Center py="xl">
                  <Stack align="center" gap="md">
                    <IconUser size={48} color="gray" />
                    <Title order={3} c="dimmed">
                      Không tìm thấy giảng viên
                    </Title>
                    <Text c="dimmed" ta="center">
                      Không có giảng viên nào phù hợp với tiêu chí tìm kiếm của
                      bạn.
                      <br />
                      Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
                    </Text>
                    <Button onClick={handleClearFilters} variant="outline">
                      Xóa tất cả bộ lọc
                    </Button>
                  </Stack>
                </Center>
              </Card>
            ) : (
              <SimpleGrid
                cols={{
                  base: 1,
                  sm: 2,
                  md: viewMode === "grid" ? 3 : 1,
                  lg: viewMode === "grid" ? 4 : 1,
                }}
                spacing="lg"
              >
                {paginatedLecturers.map((lecturer) => (
                  <LecturerBioCard
                    key={lecturer.id}
                    lecturer={lecturer}
                    variant={viewMode === "grid" ? "compact" : "default"}
                    showViewButton={true}
                  />
                ))}
              </SimpleGrid>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <Center>
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={setCurrentPage}
              size="md"
            />
          </Center>
        )}
      </Stack>
    </Container>
  );
};

export default BioPage;
