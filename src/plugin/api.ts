import axios, { AxiosResponse } from "axios";
import type { ICard } from "../store/types";
const API = "https://trello.backend.tests.nekidaem.ru/api/v1";
export type Row = "0" | "1" | "2" | "3";
export type UpdateData = {
  item: ICard;
  row?: Row;
  text?: string;
};
export interface IAuthData {
  username: string;
  email: string;
  password: string;
}
interface IError {
  [name: string]: string[];
}
export default {
  cards: {
    get: (row: Row): Promise<AxiosResponse<ICard[]>> =>
      axios.get<ICard[]>(`${API}/cards/?row=${row}`),
    add: (data: Omit<ICard, "seq_num" | "id">): Promise<AxiosResponse<ICard>> =>
      axios.post<ICard>(`${API}/cards/`, data),
    update: (
      id: number,
      data: Omit<ICard, "id">
    ): Promise<AxiosResponse<ICard>> =>
      axios.patch<ICard>(`${API}/cards/${id}/`, data),
    delete: (id: number): Promise<AxiosResponse<void>> =>
      axios.delete<void>(`${API}/cards/${id}/`),
  },
  users: {
    create: (data: IAuthData): Promise<AxiosResponse<IError>> =>
      axios.post<IError>(`${API}/users/create/`, data),
    login: (data: Omit<IAuthData, "email">): Promise<AxiosResponse<IError>> =>
      axios.post<IError>(`${API}/users/login/`, data),
    refreshToken: (
      token: string
    ): Promise<
      AxiosResponse<{
        token: string;
      }>
    > =>
      axios.post<{ token: string }>(`${API}/users/refresh_token/`, { token }),
  },
};
