import { createStore, StoreOptions } from "vuex";
import api, { Row, UpdateData } from "@/plugin/api";
import type { ICard, IKanBan } from "./types";
function saveKanban(kanban: IKanBan[]) {
  localStorage.setItem("kanban", JSON.stringify(kanban));
}

interface IState {
  kanban: IKanBan[];
  auth: {
    token: string;
    isLogined: boolean;
  };
}

const state: StoreOptions<IState> = {
  state: {
    kanban: [
      {
        title: "ON-HOLD",
        color: "#ff5722",
        items: [],
      },
      {
        title: "IN-PROGRESS",
        color: "#03a9f4",
        items: [],
      },
      {
        title: "NEEDS-REWIEW",
        color: "#ffeb3b",
        items: [],
      },
      {
        title: "APPROVED",
        color: "#4caf50",
        items: [],
      },
    ],
    auth: {
      token: "",
      isLogined: false,
    },
  },
  getters: {},
  mutations: {
    setLogined(state, token: string) {
      state.auth.token = token;
      state.auth.isLogined = true;
      localStorage.setItem("token", token);
    },
    signout(state) {
      state.auth.token = "";
      state.auth.isLogined = false;
      localStorage.removeItem("token");
    },
    addItem(state, data: ICard) {
      state.kanban[data.row as unknown as number].items.push(data);
      saveKanban(state.kanban);
    },
    clearItems(state, row: ICard["row"]) {
      state.kanban[row as unknown as number].items = [];
      saveKanban(state.kanban);
    },
    deleteItem(state, id: number) {
      state.kanban.forEach((e) => {
        const index = e.items.findIndex((e) => e.id == id);
        if (~index) e.items.splice(index, 1);
      });
      saveKanban(state.kanban);
    },
  },
  actions: {
    async add(
      state,
      data: {
        row: Row;
        text: string;
      }
    ) {
      const _response = await api.cards.add(data);
      if (_response.status == 201) {
        _response.data;
        state.commit("addItem", _response.data);
      }
    },
    async getCards(state, row: Row) {
      if (state.state.auth.isLogined) {
        const _response = await api.cards.get(row);
        if (_response.status == 200) {
          state.commit("clearItems", row);
          _response.data.forEach((e) => state.commit("addItem", e));
        }
      }
    },
    checkAuth(state) {
      const token = localStorage.getItem("token");
      if (token) state.commit("setLogined", token);
    },
    async deleteItem(state, id: number) {
      state.commit("deleteItem", id);
      api.cards.delete(id);
    },
    async updateItem(state, data: UpdateData) {
      const row = data.row !== undefined ? data.row : data.item.row;
      const text = data.text !== undefined ? data.text : data.item.text;
      api.cards.update(data.item.id, { row, text, seq_num: data.item.seq_num });
    },
    loadKanBan(state) {
      const data = localStorage.getItem("kanban");
      if (data) state.state.kanban = JSON.parse(data);
    },
  },
};
export default createStore(state);
