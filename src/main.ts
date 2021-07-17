import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import axios from "axios";

axios.interceptors.request.use(function (config)
{
    const token = store.state.auth.token;
    if(token)
    {
        config.headers.Authorization = `JWT ${token}`;
    }
    return config;
}, function (err)
{
    return Promise.reject(err);
});

axios.interceptors.response.use(response =>
{
    return response;
}, error =>
{
    console.log(error);

    if(error && error.response && error.response.status === 401)
    {
        store.commit('signout')
    }
    if(error && error.response && error.response.status === 400)
    {
    }
    if(error && error.response)
        return error.response;
    return error
});


createApp(App).use(store).use(router).use(ElementPlus).mount("#app");

