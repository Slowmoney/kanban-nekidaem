import { Row } from "../plugin/api";

export interface IKanBan{
    title: string;
    color: string;
    items: IKanBanItem[];
}

export interface IKanBanItem
{
    text: string;
    id: number;
}

export interface ICard
{
    id: number,
    row: Row,
    seq_num: number,
    text: string
}