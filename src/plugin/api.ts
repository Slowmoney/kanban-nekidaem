import axios from 'axios';
import type { ICard } from '../store/types';
const API = "https://trello.backend.tests.nekidaem.ru/api/v1"
export type Row = "0" | "1" | "2" | "3"
export type UpdateData = {
    item: ICard;
    row?: Row;
    text?: string
}
export interface IAuthData
{
    username: string,
    email: string,
    password: string,
}
interface IError
{
    [name: string]: string[]
}
export default {
    cards: {
        get: (row: Row ) => axios.get<ICard[]>(`${API}/cards/?row=${row}`),
        add: (data: { row: Row, text: string }) => axios.post<ICard>(`${API}/cards/`, data),
        update: (id: number, data: { row: Row, text: string, seq_num: number }) => axios.patch(`${API}/cards/${id}/`, data),
        delete: (id: number) => axios.delete(`${API}/cards/${id}/`)
    },
    users: {
        create: (data: IAuthData) => axios.post<IError>(`${API}/users/create/`, data) ,
        login: (data: Omit<IAuthData, "email">) => axios.post<IError>(`${API}/users/login/`, data) ,
        refreshToken: (token: string) => axios.post(`${API}/users/refresh_token/`, {token})
    }
}