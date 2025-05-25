// src/services/userService.ts
import axios from "axios";
import apiSec from "../utils/tokenapi.utils";
import API_URL from "../config/api.config";

export const loginUser = async (email: string, password: string): Promise<string> => {
  const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
  return data.access_token;
};

export const getUserInfo = async (): Promise<any> => {
  const { data } = await apiSec.get(`users/me`);
  return data;
};

export const getUserRelations = async (userId: number, relationType: string): Promise<any[]> => {
  const { data } = await apiSec.get(`userrelations`, {
    params: { userId: userId.toString(), direction: "from", relationType }
  });
  return data;
};

export const getAllUserRelations = async (userId?: number): Promise<any[]> => {
  const params: any = { direction: "from" };
  if (userId) params.userId = userId.toString();

  const { data } = await apiSec.get(`userrelations`, { params });
  return data;
};

export const getConnectedUserId = (): number => {
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  return userInfo.id;
};

export const getPedagogicalManagers = async (): Promise<any[]> => {
  const { data } = await apiSec.get(`/users`, { params: { role: "pedagogical_manager" } });
  return data;
};
