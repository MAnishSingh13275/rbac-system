export type User = {
    id: string;
    email: string;
    name?: string;
    role: { id: string; name: string } | null;
    permissions: { name: string }[];
    status: UserStatus;
    createdAt: string;
    updatedAt: string;

};

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Permission {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
  }