export interface Lecturer {
  id?: string;
  chucDanh: string; // Position/Title
  chucVu: string; // Role
  chuyenMonDaoTao: string; // Training specialization
  email: string;
  hoVaTen: string; // Full name
  hocVi: string; // Academic degree
  imageUrl?: string; // Profile image URL
  videoUrl?: string; // Intro video URL
  maDinhDanh: string; // ID code
  ngaySinh: string; // Date of birth
  phongBan: string; // Department
  soDienThoai: string; // Phone number
  status: boolean; // Active status
}

export interface LecturerFormData extends Omit<Lecturer, "id"> {}
