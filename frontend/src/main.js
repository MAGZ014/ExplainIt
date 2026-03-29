import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import { addIcons, OhVueIcon } from "oh-vue-icons";
import {
  BiCodeSlash,
  BiSendFill,
  BiArrowRepeat,
  BiClipboard,
  BiCheck2,
  BiTerminal,
  BiStars,
  BiLightningFill,
  BiInfoCircle,
  BiPersonVideo3,
  BiEmojiSmile,
  BiSpeedometer,
  BiFileEarmarkText,
  BiPatchQuestion,
  BiChatDots,
} from "oh-vue-icons/icons";

addIcons(
  BiCodeSlash,
  BiSendFill,
  BiArrowRepeat,
  BiClipboard,
  BiCheck2,
  BiTerminal,
  BiStars,
  BiLightningFill,
  BiInfoCircle,
  BiPersonVideo3,
  BiEmojiSmile,
  BiSpeedometer,
  BiFileEarmarkText,
  BiPatchQuestion,
  BiChatDots,
);

const app = createApp(App);
app.component("v-icon", OhVueIcon);
app.mount("#app");
