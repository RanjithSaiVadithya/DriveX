import type { ActiveRole, UserStatus } from "./auth";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string | null;
  role: ActiveRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
