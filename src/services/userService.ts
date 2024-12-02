import axios from "axios";
import { User, Role, Permission } from "@/types/utils";

const API_BASE_USERS = "/api/users";
const API_BASE_ROLES = "/api/roles";
const API_BASE_PERMISSIONS = "/api/permissions";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(API_BASE_USERS);
  return response.data;
};

export const addUser = async (user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> => {
  const response = await axios.post(API_BASE_USERS, user);
  return response.data;
};

export const updateUser = async (id: string, updatedUser: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User> => {
  const response = await axios.put(`${API_BASE_USERS}/${id}`, updatedUser);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_USERS}/${id}`);
};

export const fetchRoles = async (): Promise<Role[]> => {
  const response = await axios.get(API_BASE_ROLES);
  return response.data;
};

export const addRole = async (role: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role> => {
  const response = await axios.post(API_BASE_ROLES, role);
  return response.data;
};

export const fetchPermissions = async (): Promise<Permission[]> => {
  const response = await axios.get(API_BASE_PERMISSIONS);
  return response.data;
};

export const addPermission = async (permission: Omit<Permission, "id" | "createdAt" | "updatedAt">): Promise<Permission> => {
  const response = await axios.post(API_BASE_PERMISSIONS, permission);
  return response.data;
};