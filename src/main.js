import { createApp } from "vue";
import App from "./App.vue";
import router from "./assets/router";
import slave from './helper/slave'
createApp(App)
.mixin(slave)
.use(router)
.mount("#app")
