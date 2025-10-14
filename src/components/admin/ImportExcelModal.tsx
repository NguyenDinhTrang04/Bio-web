import React, { useState } from "react";
import {
  Modal,
  Button,
  Stack,
  Text,
  Alert,
  Progress,
  Group,
  FileButton,
  Card,
  Table,
  ScrollArea,
  Divider,
} from "@mantine/core";
import {
  IconFileSpreadsheet,
  IconUpload,
  IconAlertCircle,
  IconCheck,
  IconDownload,
} from "@tabler/icons-react";
import * as XLSX from "xlsx";
import { LecturerFormData } from "../../types/lecturer";
import { notifications } from "@mantine/notifications";

interface ImportExcelModalProps {
  opened: boolean;
  onClose: () => void;
  onImport: (lecturers: LecturerFormData[]) => Promise<void>;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  opened,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<LecturerFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Expected column mapping (Vietnamese to English)
  const columnMapping: Record<string, keyof LecturerFormData> = {
    "Mã định danh": "maDinhDanh",
    "Họ và tên": "hoVaTen",
    Email: "email",
    "Số điện thoại": "soDienThoai",
    "Phòng ban": "phongBan",
    "Chức vụ": "chucVu",
    "Chức danh": "chucDanh",
    "Chuyên môn đào tạo": "chuyenMonDaoTao",
    "Ngày sinh": "ngaySinh",
    "Học vị": "hocVi",
    "URL ảnh": "imageUrl",
    "URL video": "videoUrl",
    "Trạng thái": "status",
  };

  // Generate sample Excel template
  const downloadTemplate = () => {
    const templateData = [
      {
        "Mã định danh": "GV001",
        "Họ và tên": "Nguyễn Văn A",
        Email: "nva@example.com",
        "Số điện thoại": "0901234567",
        "Phòng ban": "Khoa Công nghệ thông tin",
        "Chức vụ": "Giảng viên",
        "Chức danh": "Thạc sĩ",
        "Chuyên môn đào tạo": "Lập trình, Cơ sở dữ liệu",
        "Ngày sinh": "1990-01-01",
        "Học vị": "Thạc sĩ",
        "URL ảnh": "",
        "URL video": "",
        "Trạng thái": "true",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Giảng viên");
    XLSX.writeFile(wb, "mau_import_giang_vien.xlsx");

    notifications.show({
      title: "Thành công!",
      message: "Đã tải xuống file mẫu",
      color: "green",
    });
  };

  // Parse Excel file
  const parseExcelFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);
    setErrors([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as any[][];

        if (jsonData.length < 2) {
          setErrors(["File Excel phải có ít nhất 2 dòng (header + data)"]);
          setLoading(false);
          return;
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);

        // Validate headers
        const requiredColumns = [
          "Mã định danh",
          "Họ và tên",
          "Email",
          "Phòng ban",
        ];
        const missingColumns = requiredColumns.filter(
          (col) => !headers.includes(col)
        );

        if (missingColumns.length > 0) {
          setErrors([`Thiếu các cột bắt buộc: ${missingColumns.join(", ")}`]);
          setLoading(false);
          return;
        }

        // Parse data
        const parsed: LecturerFormData[] = [];
        const parseErrors: string[] = [];

        rows.forEach((row, index) => {
          try {
            const lecturer: any = {};

            headers.forEach((header, colIndex) => {
              const fieldName = columnMapping[header];
              if (fieldName) {
                let value = row[colIndex];

                // Handle special cases
                if (fieldName === "status") {
                  value =
                    value === true ||
                    value === "true" ||
                    value === "1" ||
                    value === 1;
                } else {
                  value = value?.toString() || "";
                }

                lecturer[fieldName] = value;
              }
            });

            // Validate required fields
            if (
              !lecturer.maDinhDanh ||
              !lecturer.hoVaTen ||
              !lecturer.email ||
              !lecturer.phongBan
            ) {
              parseErrors.push(`Dòng ${index + 2}: Thiếu thông tin bắt buộc`);
              return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(lecturer.email)) {
              parseErrors.push(`Dòng ${index + 2}: Email không hợp lệ`);
              return;
            }

            // Set default values
            lecturer.chucVu = lecturer.chucVu || "Giảng viên";
            lecturer.chucDanh = lecturer.chucDanh || "";
            lecturer.hocVi = lecturer.hocVi || "";
            lecturer.chuyenMonDaoTao = lecturer.chuyenMonDaoTao || "";
            lecturer.ngaySinh = lecturer.ngaySinh || "";
            lecturer.soDienThoai = lecturer.soDienThoai || "";
            lecturer.status =
              lecturer.status !== undefined ? lecturer.status : true;

            parsed.push(lecturer);
          } catch (error) {
            parseErrors.push(`Dòng ${index + 2}: Lỗi xử lý dữ liệu`);
          }
        });

        setParsedData(parsed);
        setErrors(parseErrors);

        if (parsed.length > 0) {
          notifications.show({
            title: "Phân tích thành công!",
            message: `Tìm thấy ${parsed.length} giảng viên hợp lệ`,
            color: "green",
          });
        }
      } catch (error) {
        setErrors([
          "Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.",
        ]);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  // Import lecturers
  const handleImport = async () => {
    if (parsedData.length === 0) return;

    setImporting(true);
    try {
      await onImport(parsedData);

      setImportResult({
        success: parsedData.length,
        failed: 0,
        errors: [],
      });

      notifications.show({
        title: "Import thành công!",
        message: `Đã import ${parsedData.length} giảng viên`,
        color: "green",
      });

      // Reset after successful import
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setImportResult({
        success: 0,
        failed: parsedData.length,
        errors: [(error as Error).message],
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setImportResult(null);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Import Giảng viên từ Excel"
      size="xl"
    >
      <Stack gap="md">
        {/* Download Template */}
        <Card withBorder>
          <Stack gap="sm">
            <Group>
              <IconDownload size={20} />
              <Text fw={500}>Tải xuống file mẫu</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Tải xuống file Excel mẫu để xem định dạng dữ liệu yêu cầu
            </Text>
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={downloadTemplate}
            >
              Tải file mẫu
            </Button>
          </Stack>
        </Card>

        <Divider />

        {/* File Upload */}
        <Card withBorder>
          <Stack gap="sm">
            <Group>
              <IconFileSpreadsheet size={20} />
              <Text fw={500}>Chọn file Excel</Text>
            </Group>

            <FileButton onChange={parseExcelFile} accept=".xlsx,.xls">
              {(props) => (
                <Button
                  {...props}
                  leftSection={<IconUpload size={16} />}
                  variant="outline"
                  loading={loading}
                >
                  {file ? file.name : "Chọn file Excel"}
                </Button>
              )}
            </FileButton>

            {loading && <Progress value={100} animated color="blue" />}
          </Stack>
        </Card>

        {/* Errors */}
        {errors.length > 0 && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text fw={500}>Có lỗi khi xử lý file:</Text>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Preview Data */}
        {parsedData.length > 0 && (
          <Card withBorder>
            <Stack gap="sm">
              <Text fw={500}>
                Xem trước dữ liệu ({parsedData.length} giảng viên)
              </Text>

              <ScrollArea h={300}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Mã định danh</Table.Th>
                      <Table.Th>Họ và tên</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Phòng ban</Table.Th>
                      <Table.Th>Chức vụ</Table.Th>
                      <Table.Th>Trạng thái</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {parsedData.slice(0, 10).map((lecturer, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>{lecturer.maDinhDanh}</Table.Td>
                        <Table.Td>{lecturer.hoVaTen}</Table.Td>
                        <Table.Td>{lecturer.email}</Table.Td>
                        <Table.Td>{lecturer.phongBan}</Table.Td>
                        <Table.Td>{lecturer.chucVu}</Table.Td>
                        <Table.Td>
                          <Text c={lecturer.status ? "green" : "red"}>
                            {lecturer.status ? "Hoạt động" : "Không hoạt động"}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              {parsedData.length > 10 && (
                <Text size="sm" c="dimmed" ta="center">
                  Hiển thị 10/{parsedData.length} giảng viên đầu tiên
                </Text>
              )}
            </Stack>
          </Card>
        )}

        {/* Import Result */}
        {importResult && (
          <Alert
            icon={<IconCheck size={16} />}
            color={importResult.success > 0 ? "green" : "red"}
          >
            <Text fw={500}>Kết quả import:</Text>
            <Text>Thành công: {importResult.success}</Text>
            <Text>Thất bại: {importResult.failed}</Text>
            {importResult.errors.length > 0 && (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {importResult.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </Alert>
        )}

        {/* Action Buttons */}
        <Group justify="flex-end">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            loading={importing}
            disabled={parsedData.length === 0}
            leftSection={<IconUpload size={16} />}
          >
            Import{" "}
            {parsedData.length > 0 ? `${parsedData.length} giảng viên` : ""}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ImportExcelModal;
