import { createStore, Store } from "vuex";
import api, { Row, UpdateData } from "@/plugin/api";
import type { ICard } from "./types";
function saveKanban(kanban: any) {
    localStorage.setItem("kanban", JSON.stringify(kanban));
}
const state = {
    state: {
        kanban: [
            {
                title: "ON-HOLD",
                color: "#ff5722",
                items: []
            },
            {
                title: "IN-PROGRESS",
                color: "#03a9f4",
                items: []
            },
            {
                title: "NEEDS-REWIEW",
                color: "#ffeb3b",
                items: []
            },
            {
                title: "APPROVED",
                color: "#4caf50",
                items: []
            },
        ],
        auth: {
            token: "",
            isLogging: false
        }
    },
    getters: {

    },
    mutations: {
        setLogined (state: any, token: string)
        {
            console.log(state, token);

            state.auth.token = token
            state.auth.isLogging = true
            localStorage.setItem("token", token);
        },
        signout (state: any)
        {
            console.log(state);
            state.auth.token = ""
            state.auth.isLogging = false
            localStorage.removeItem("token")
        },
        addItem (state: any, data: ICard)
        {
            state.kanban[data.row].items.push(data)
            saveKanban(state.kanban);
        },
        clearItems (state: any, row: ICard["row"])
        {
            state.kanban[row].items = []
            saveKanban(state.kanban);
        },
        deleteItem (state: any, id: number)
        {
            state.kanban.forEach((e: any) => {
                const index = e.items.findIndex((e: any) => e.id == id)
                if (~index) {
                    e.items.splice(index, 1)
                }
            });
            saveKanban(state.kanban);
        }
    },
    actions: {
        async add (state: any, data: {
            row: "0" | "1" | "2" | "3";
            text: string;
        })
        {
            console.log('add');
            const _response = await api.cards.add(data)
            if(_response.status == 201)
            {
                _response.data
                state.commit("addItem", _response.data)
            }

        },
        async getCards (state: any, row: "0" | "1" | "2" | "3")
        {
            if(state.state.auth.isLogging)
            {
                const _response = await api.cards.get(row)
                if(_response.status == 200)
                {
                    state.commit("clearItems", row)
                    _response.data.forEach(e => state.commit("addItem", e))

                }
            }
        },
        checkAuth (state: any)
        {
            const token = localStorage.getItem("token")
            if (token) state.commit('setLogined', token)
        },
        async deleteItem (state: any, id: number)
        {
            state.commit('deleteItem', id)
            api.cards.delete(id);
        },
        async updateItem (state: any, data: UpdateData)
        {
            const row = data.row !== undefined ? data.row : data.item.row;
            const text = data.text !== undefined ? data.text : data.item.text;
            api.cards.update(data.item.id, { row, text, seq_num: data.item.seq_num})
        },
        loadKanBan (state: any)
        {
            const data = localStorage.getItem("kanban")
            if (data) 
                state.state.kanban = JSON.parse(data)
        }
    },
    modules: {},
}
export default createStore(state);
