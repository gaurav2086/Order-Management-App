export interface User {
  id: number | undefined;
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  phoneNumber: string | undefined;
  userType: string | undefined;
  isActive: boolean;
  createdBy: string | undefined;
  token: string | undefined;
}
