import axios from "axios";

const API_BASE_USERS = "/api/users";
const API_BASE_ROLES = "/api/roles";
const API_BASE_PERMISSIONS = "/api/permissions";

export const fetchUsers = async () => {
  const response = await axios.get(API_BASE_USERS);
  return response.data;
};

export const addUser = async (user: any) => {
  const response = await axios.post(API_BASE_USERS, user);
  return response.data;
};

export const updateUser = async (id: string, updatedUser: any) => {
  const response = await axios.put(`${API_BASE_USERS}/${id}`, updatedUser);
  return response.data;
};

export const deleteUser = async (id: string) => {
  await axios.delete(`${API_BASE_USERS}/${id}`);
};

export const fetchRoles = async () => {
  const response = await axios.get(API_BASE_ROLES);
  console.log("Roles:", response.data);
  return response.data;
};

export const addRole = async (role: any) => {
  const response = await axios.post(API_BASE_ROLES, role);
  return response.data;
};

export const deleteRole = async (id: string) => {
  await axios.delete(`${API_BASE_ROLES}/${id}`);
};

export const fetchPermissions = async () => {
  const response = await axios.get(API_BASE_PERMISSIONS);
  console.log("Permissions:", response.data);
  return response.data;
};

export const addPermission = async (permission: any) => {
  const response = await axios.post(API_BASE_PERMISSIONS, permission);
  return response.data;
};

export const deletePermission = async (id: string) => {
  await axios.delete(`${API_BASE_PERMISSIONS}/${id}`);
};