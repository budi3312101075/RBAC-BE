export interface IUserModel {
  id: string;
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone: string;
  is_deleted: number;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  role_id: string;
}
