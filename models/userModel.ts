export interface UsersModel {
  success: boolean;
  message: string;
  data: {
    data: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  isBlocked: boolean;
  profileImage: string;
}
