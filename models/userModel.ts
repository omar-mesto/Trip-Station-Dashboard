export interface UsersModel {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: User[];
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  isBlocked: boolean;
  profileImage: string;
}
