import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGithub,
  faTwitter,
  faMicrosoft,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

library.add(faGithub, faTwitter, faMicrosoft, faFacebook);
library.add(faTimes);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
