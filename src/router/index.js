import {createRouter, createWebHashHistory} from "vue-router";
import routes from "./routes";

const router = createRouter({
    history: createWebHashHistory(), //使用哈希模式
    routes,
    linkActiveClass: 'activeClass' //使用active-class
});

export default router;